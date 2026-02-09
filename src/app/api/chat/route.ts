import { google } from '@ai-sdk/google';
import { createClient } from '@supabase/supabase-js';
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  tool,
  type FinishReason,
  type UIMessage,
} from 'ai';
import { z } from 'zod';
import aiKnowledge from '@/data/ai-knowledge.json';
import { serverLogger } from '@/lib/logger/server-logger';

export const maxDuration = 30;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const querySchema = z.object({
  table: z.enum(['projects', 'skills', 'experiences', 'education', 'about']),
  query: z.string().optional(),
  limit: z.number().optional().default(5),
});

type ChatRequestBody = {
  messages: UIMessage[];
  terminalSessionId?: string;
};

type ChatLogContext = {
  requestId: string;
  terminalSessionId?: string;
};

type ChatRuntimeConfig = {
  source: 'database' | 'fallback';
  settingsId?: string;
  model: string;
  systemPrompt: string;
  temperature: number | null;
  topP: number | null;
  maxOutputTokens: number | null;
  contextBlockCount: number;
  skillCount: number;
};

const MAX_LOG_PREVIEW_LENGTH = 180;
const FALLBACK_MODEL = process.env.AI_MODEL || 'gemini-3-flash-preview';
const EMPTY_FINAL_RESPONSE_TEXT =
  'I fetched the data but could not format a final response. Please retry.';
const TOOL_RETRIEVAL_INSTRUCTION =
  'Use tools when needed to gather portfolio data. Keep this step focused on retrieval and reasoning only.';
const FINAL_RESPONSE_INSTRUCTION =
  'Return a final user-facing markdown answer. Do not end with tool output only.';
const MAX_TOOL_RESULT_PREVIEW_LENGTH = 12000;

const safeInfo = (message: string, meta?: Record<string, unknown>) => {
  serverLogger.safeInfo(message, meta);
};

const safeWarn = (message: string, meta?: Record<string, unknown>) => {
  serverLogger.safeWarn(message, meta);
};

const safeDebug = (message: string, meta?: Record<string, unknown>) => {
  serverLogger.safeDebug(message, meta);
};

const safeError = (
  message: string,
  error?: Error | unknown,
  meta?: Record<string, unknown>
) => {
  serverLogger.safeError(message, error, meta);
};

const truncateForLog = (value: string, maxLength = MAX_LOG_PREVIEW_LENGTH) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
};

const createRequestId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `req-${Math.random().toString(36).slice(2, 10)}`;
};

const getTextPreviewFromMessage = (message: UIMessage | undefined) => {
  if (!message) {
    return undefined;
  }

  const combinedText = message.parts
    .filter(
      (part): part is Extract<UIMessage['parts'][number], { type: 'text' }> =>
        part.type === 'text'
    )
    .map((part) => part.text)
    .join('\n')
    .trim();

  if (!combinedText) {
    return undefined;
  }

  return truncateForLog(combinedText);
};

const getFullTextFromMessage = (message: UIMessage | undefined) => {
  if (!message) {
    return '';
  }

  return message.parts
    .filter(
      (part): part is Extract<UIMessage['parts'][number], { type: 'text' }> =>
        part.type === 'text'
    )
    .map((part) => part.text)
    .join('\n')
    .trim();
};

const buildFallbackRuntimeConfig = (): ChatRuntimeConfig => ({
  source: 'fallback',
  model: FALLBACK_MODEL,
  systemPrompt: aiKnowledge.systemPrompt,
  temperature: null,
  topP: null,
  maxOutputTokens: null,
  contextBlockCount: 0,
  skillCount: 0,
});

const buildSystemPrompt = ({
  basePrompt,
  includeSiteContext,
  includeSkillsContext,
  contextBlocks,
  skills,
}: {
  basePrompt: string;
  includeSiteContext: boolean;
  includeSkillsContext: boolean;
  contextBlocks: { title: string; content: string }[];
  skills: { name: string; description: string | null; instructions: string }[];
}) => {
  const sections: string[] = [basePrompt];

  if (includeSiteContext && contextBlocks.length > 0) {
    const contextText = contextBlocks
      .map((block, index) => `${index + 1}. ${block.title}\n${block.content}`)
      .join('\n\n');
    sections.push(`Portfolio Context:\n${contextText}`);
  }

  if (includeSkillsContext && skills.length > 0) {
    const skillsText = skills
      .map(
        (skill, index) =>
          `${index + 1}. ${skill.name}${skill.description ? ` - ${skill.description}` : ''}\n${skill.instructions}`
      )
      .join('\n\n');
    sections.push(`Assistant Skills:\n${skillsText}`);
  }

  return sections.join('\n\n');
};

const getGenerationSettings = (config: ChatRuntimeConfig) => ({
  ...(config.temperature !== null ? { temperature: config.temperature } : {}),
  ...(config.topP !== null ? { topP: config.topP } : {}),
  ...(config.maxOutputTokens !== null
    ? { maxOutputTokens: config.maxOutputTokens }
    : {}),
});

const loadRuntimeConfig = async (
  logContext: ChatLogContext
): Promise<ChatRuntimeConfig> => {
  const fallback = buildFallbackRuntimeConfig();

  const { data: settingsRow, error: settingsError } = await supabase
    .from('ai_chat_settings')
    .select('*')
    .eq('enabled', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (settingsError) {
    safeWarn('Unable to load AI chat settings; using fallback', {
      ...logContext,
      error: settingsError.message,
    });
    return fallback;
  }

  if (!settingsRow) {
    safeInfo('No active AI chat settings row found; using fallback', logContext);
    return fallback;
  }

  const [contextResult, skillsResult] = await Promise.all([
    supabase
      .from('ai_chat_context_blocks')
      .select('title, content')
      .eq('settings_id', settingsRow.id)
      .eq('enabled', true)
      .order('order_index', { ascending: true }),
    supabase
      .from('ai_chat_skills')
      .select('name, description, instructions')
      .eq('settings_id', settingsRow.id)
      .eq('enabled', true)
      .order('order_index', { ascending: true }),
  ]);

  if (contextResult.error) {
    safeWarn('Failed loading AI context blocks', {
      ...logContext,
      settingsId: settingsRow.id,
      error: contextResult.error.message,
    });
  }

  if (skillsResult.error) {
    safeWarn('Failed loading AI skills', {
      ...logContext,
      settingsId: settingsRow.id,
      error: skillsResult.error.message,
    });
  }

  const contextBlocks = contextResult.error ? [] : contextResult.data || [];
  const skills = skillsResult.error ? [] : skillsResult.data || [];
  const systemPrompt = buildSystemPrompt({
    basePrompt: settingsRow.system_prompt || fallback.systemPrompt,
    includeSiteContext: settingsRow.include_site_context,
    includeSkillsContext: settingsRow.include_skills_context,
    contextBlocks,
    skills,
  });

  return {
    source: 'database',
    settingsId: settingsRow.id,
    model: settingsRow.model || fallback.model,
    systemPrompt,
    temperature: settingsRow.temperature,
    topP: settingsRow.top_p,
    maxOutputTokens: settingsRow.max_output_tokens,
    contextBlockCount: contextBlocks.length,
    skillCount: skills.length,
  };
};

const buildQueryPortfolioDBTool = (logContext: ChatLogContext) =>
  tool({
    description: 'Query the portfolio database for projects, skills, or experience.',
    inputSchema: querySchema,
    execute: async ({ table, query, limit }) => {
      const startedAt = Date.now();

      safeDebug('Portfolio DB tool invoked', {
        ...logContext,
        table,
        limit,
        queryPreview: query ? truncateForLog(query) : undefined,
      });

      let dbQuery = supabase.from(table).select('*').limit(limit);

      if (query) {
        if (table === 'projects') {
          dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
        } else if (table === 'skills') {
          dbQuery = dbQuery.ilike('name', `%${query}%`);
        } else if (table === 'experiences') {
          dbQuery = dbQuery.or(
            `company.ilike.%${query}%,position.ilike.%${query}%,description.ilike.%${query}%`
          );
        } else if (table === 'education') {
          dbQuery = dbQuery.or(
            `institution.ilike.%${query}%,degree.ilike.%${query}%,field_of_study.ilike.%${query}%`
          );
        } else if (table === 'about') {
          dbQuery = dbQuery.or(`name.ilike.%${query}%,bio.ilike.%${query}%,tagline.ilike.%${query}%`);
        }
      }

      const { data, error } = await dbQuery;
      const durationMs = Date.now() - startedAt;

      if (error) {
        safeError('Portfolio DB tool failed', error, {
          ...logContext,
          table,
          durationMs,
        });
        return `Error querying ${table}: ${error.message}`;
      }

      const count = data?.length ?? 0;
      safeDebug('Portfolio DB tool succeeded', {
        ...logContext,
        table,
        durationMs,
        count,
      });

      return JSON.stringify(data ?? []);
    },
  });

export async function POST(req: Request) {
  const requestId = createRequestId();
  const requestStartedAt = Date.now();
  let terminalSessionId: string | undefined;

  safeInfo('Chat request received', {
    requestId,
    method: req.method,
    path: '/api/chat',
  });

  try {
    const body = (await req.json()) as Partial<ChatRequestBody>;
    terminalSessionId =
      typeof body.terminalSessionId === 'string' ? body.terminalSessionId : undefined;
    const logContext: ChatLogContext = { requestId, terminalSessionId };
    const messages = body.messages;

    if (!messages || !Array.isArray(messages)) {
      safeWarn('Invalid chat request body: messages must be an array', logContext);
      return Response.json(
        { error: 'messages array required' },
        { status: 400, headers: { 'x-request-id': requestId } }
      );
    }

    safeInfo('Chat request validated', {
      ...logContext,
      messageCount: messages.length,
      lastMessageRole: messages[messages.length - 1]?.role,
      lastMessagePreview: getTextPreviewFromMessage(messages[messages.length - 1]),
    });

    const modelMessages = await convertToModelMessages(messages);
    safeDebug('Converted UI messages to model messages', {
      ...logContext,
      modelMessageCount: modelMessages.length,
    });

    const runtimeConfig = await loadRuntimeConfig(logContext);
    safeInfo('Runtime chat configuration loaded', {
      ...logContext,
      source: runtimeConfig.source,
      settingsId: runtimeConfig.settingsId,
      model: runtimeConfig.model,
      contextBlockCount: runtimeConfig.contextBlockCount,
      skillCount: runtimeConfig.skillCount,
      temperature: runtimeConfig.temperature,
      topP: runtimeConfig.topP,
      maxOutputTokens: runtimeConfig.maxOutputTokens,
    });

    const stream = createUIMessageStream<UIMessage>({
      originalMessages: messages,
      execute: async ({ writer }) => {
        const tools = {
          queryPortfolioDB: buildQueryPortfolioDBTool(logContext),
        };

        let finishReason: FinishReason = 'stop';

        try {
          safeDebug('Starting step 1 tool-enabled stream', logContext);
          const resultStepOne = streamText({
            model: google(runtimeConfig.model),
            system: `${runtimeConfig.systemPrompt}\n\n${TOOL_RETRIEVAL_INSTRUCTION}`,
            messages: modelMessages,
            ...getGenerationSettings(runtimeConfig),
            tools,
            onStepFinish: (step) => {
              safeDebug('AI chat step 1 finished', {
                ...logContext,
                finishReason: step.finishReason,
                textPreview: truncateForLog(step.text),
                toolCalls: step.toolCalls.map((toolCall) => ({
                  toolName: toolCall.toolName,
                  toolCallId: toolCall.toolCallId,
                })),
                toolResults: step.toolResults.map((toolResult) => ({
                  toolName: toolResult.toolName,
                  toolCallId: toolResult.toolCallId,
                })),
                usage: step.usage,
              });
            },
            onError: ({ error }) => {
              safeError('AI chat step 1 stream error', error, logContext);
            },
          });

          writer.merge(resultStepOne.toUIMessageStream({ sendFinish: false }));
          const stepOneResponse = await resultStepOne.response;
          const stepOneSteps = await resultStepOne.steps;
          const stepOneFinishReason = await resultStepOne.finishReason;
          const stepOneText = (await resultStepOne.text).trim();
          const stepOneUsedTools = stepOneSteps.some(
            (step) => step.toolCalls.length > 0 || step.toolResults.length > 0
          );

          safeDebug('Step 1 summary', {
            ...logContext,
            finishReason: stepOneFinishReason,
            stepCount: stepOneSteps.length,
            stepOneTextLength: stepOneText.length,
            stepOneUsedTools,
          });

          if (!stepOneUsedTools && stepOneText.length > 0) {
            finishReason = stepOneFinishReason ?? 'stop';
            safeDebug('Skipping step 2 because step 1 already produced final text', {
              ...logContext,
              finishReason,
            });
            writer.write({ type: 'finish', finishReason });
            return;
          }

          safeDebug('Starting step 2 final-answer stream', {
            ...logContext,
            stepOneMessageCount: stepOneResponse.messages.length,
          });

          const lastUserMessage = [...messages]
            .reverse()
            .find((message) => message.role === 'user');
          const userPrompt = getFullTextFromMessage(lastUserMessage);

          const toolResultsText = stepOneSteps
            .flatMap((step) => step.toolResults)
            .map((toolResult, index) => {
              const outputText =
                typeof toolResult.output === 'string'
                  ? toolResult.output
                  : JSON.stringify(toolResult.output);
              return `Tool Result ${index + 1} (${toolResult.toolName}):\n${outputText}`;
            })
            .join('\n\n')
            .slice(0, MAX_TOOL_RESULT_PREVIEW_LENGTH);

          let finalText = '';
          const resultStepTwo = streamText({
            model: google(runtimeConfig.model),
            system: `${runtimeConfig.systemPrompt}\n\n${FINAL_RESPONSE_INSTRUCTION}\nYou must answer directly for the user request. Do not call tools.`,
            prompt: [
              `User request:\n${userPrompt || '(empty user prompt)'}`,
              toolResultsText
                ? `Retrieved tool results:\n${toolResultsText}`
                : 'No tool results were returned. Use available context to answer.',
              'Now write the final response for the user in markdown.',
            ].join('\n\n'),
            ...getGenerationSettings(runtimeConfig),
            toolChoice: 'none',
            onStepFinish: (step) => {
              safeDebug('AI chat step 2 finished', {
                ...logContext,
                finishReason: step.finishReason,
                textPreview: truncateForLog(step.text),
                usage: step.usage,
              });
            },
            onError: ({ error }) => {
              safeError('AI chat step 2 stream error', error, logContext);
            },
            onFinish: ({ text, finishReason: stepTwoFinishReason, steps, totalUsage }) => {
              finalText = text.trim();
              finishReason = stepTwoFinishReason ?? 'stop';
              safeInfo('AI chat step 2 stream finished', {
                ...logContext,
                finishReason,
                textLength: text.length,
                textPreview: truncateForLog(text),
                stepCount: steps.length,
                usage: totalUsage,
              });
            },
          });

          writer.merge(
            resultStepTwo.toUIMessageStream({
              sendStart: false,
              sendFinish: false,
            })
          );

          await resultStepTwo.consumeStream({
            onError: (error) => {
              safeError('AI chat step 2 consume stream error', error, logContext);
            },
          });

          if (finalText.length === 0) {
            const fallbackTextId = `fallback-${requestId}`;
            safeWarn('Step 2 produced empty final text; writing fallback response', logContext);
            writer.write({ type: 'text-start', id: fallbackTextId });
            writer.write({
              type: 'text-delta',
              id: fallbackTextId,
              delta: EMPTY_FINAL_RESPONSE_TEXT,
            });
            writer.write({ type: 'text-end', id: fallbackTextId });
            finishReason = 'stop';
          }
        } catch (streamError) {
          const fallbackTextId = `fallback-error-${requestId}`;
          safeError('Unhandled error while composing UI message stream', streamError, logContext);
          writer.write({ type: 'text-start', id: fallbackTextId });
          writer.write({
            type: 'text-delta',
            id: fallbackTextId,
            delta: EMPTY_FINAL_RESPONSE_TEXT,
          });
          writer.write({ type: 'text-end', id: fallbackTextId });
          finishReason = 'error';
        }

        writer.write({ type: 'finish', finishReason });
        safeDebug('Streaming response to client completed', {
          ...logContext,
          durationMs: Date.now() - requestStartedAt,
        });
      },
      onError: (error) => {
        safeError('UI message stream failure', error, { requestId, terminalSessionId });
        return 'An error occurred while generating the response.';
      },
      onFinish: ({ responseMessage, finishReason, isAborted }) => {
        safeInfo('UI message stream closed', {
          requestId,
          terminalSessionId,
          finishReason,
          isAborted,
          responseMessageId: responseMessage.id,
          responsePartCount: responseMessage.parts.length,
          durationMs: Date.now() - requestStartedAt,
        });
      },
    });

    return createUIMessageStreamResponse({
      stream,
      headers: { 'x-request-id': requestId },
    });
  } catch (error) {
    safeError('Unhandled chat route error', error, {
      requestId,
      terminalSessionId,
      durationMs: Date.now() - requestStartedAt,
    });
    return Response.json(
      {
        error: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
      },
      { status: 500, headers: { 'x-request-id': requestId } }
    );
  }
}
