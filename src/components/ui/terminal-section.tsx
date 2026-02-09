'use client';

import React, { useState, useRef, useEffect, useMemo, useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CYBERPUNK_MESSAGES } from '@/data/cyberpunk-messages';
import { useHeroStore } from '@/lib/stores/hero-store';
import { useProjectsStore } from '@/lib/stores/projects-store';
import { useSkillsStore } from '@/lib/stores/skills-store';
import { useSiteSettingsStore } from '@/lib/stores/site-settings-store';
import { clientLogger } from '@/lib/logger/client-logger';
import { useTheme } from 'next-themes';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import ReactMarkdown from 'react-markdown';
import aiKnowledge from '@/data/ai-knowledge.json';

interface Command {
  input: string;
  output: React.ReactNode;
}

const readLocalStorageJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const MAX_LOG_PREVIEW_LENGTH = 120;

const truncateForLog = (value: string, maxLength = MAX_LOG_PREVIEW_LENGTH) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
};

const summarizeMessage = (message: UIMessage) => ({
  id: message.id,
  role: message.role,
  parts: message.parts.map((part) => {
    if (part.type === 'text') {
      return { type: 'text', preview: truncateForLog(part.text) };
    }

    return { type: part.type };
  }),
});

const getTextFromMessageParts = (message: UIMessage | undefined) => {
  if (!message) {
    return '';
  }

  return message.parts
    .filter((part): part is Extract<UIMessage['parts'][number], { type: 'text' }> => part.type === 'text')
    .map((part) => part.text)
    .join('\n');
};

const getAssistantStatusFromMessage = (message: UIMessage | undefined) => {
  if (!message || message.role !== 'assistant') {
    return null;
  }

  const hasText = message.parts.some((part) => part.type === 'text');
  if (hasText) {
    return null;
  }

  const partTypes = message.parts.map((part) => String(part.type));

  if (partTypes.some((type) => type.startsWith('tool-queryPortfolioDB'))) {
    return 'Retrieving portfolio data...';
  }

  if (partTypes.some((type) => type.startsWith('tool-'))) {
    return 'Running tool call...';
  }

  if (partTypes.some((type) => type === 'step-start' || type === 'start-step')) {
    return 'Thinking...';
  }

  if (partTypes.some((type) => type === 'finish-step')) {
    return 'Finalizing response...';
  }

  return 'Preparing response...';
};

const getStableMessage = (messages: string[], key: string) => {
  if (messages.length === 0) {
    return '';
  }

  const stableHash = key
    .split('')
    .reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0);

  return messages[stableHash % messages.length];
};

const TerminalMarkdown = ({ content }: { content: string }) => {
  return (
    <div className="space-y-3 text-foreground">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 text-foreground/95">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 text-foreground/95">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => <strong className="text-primary font-semibold">{children}</strong>,
          em: ({ children }) => <em className="text-accent">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary/30 pl-3 text-muted-foreground italic">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:text-primary transition-colors"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded bg-muted/40 border border-primary/20 px-1.5 py-0.5 text-primary">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded border border-primary/20 bg-muted/30 p-3 text-foreground/95">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export function TerminalSection() {
  const [history, setHistory] = useState<Command[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>(() =>
    readLocalStorageJson<string[]>('terminal_command_history', [])
  );
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState('');
  const [isAiMode, setIsAiMode] = useState(false);
  const [pendingQuit, setPendingQuit] = useState(false);
  // We initialize state with empty, then load from localStorage to avoid hydration mismatch
  const [initialAiMessages] = useState<UIMessage[]>(() =>
    readLocalStorageJson<UIMessage[]>('terminal_ai_chat_history', [])
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pendingQuitRef = useRef(false);
  const hasRestoredAiMessagesRef = useRef(false);
  const initialCommandHistoryCountRef = useRef(commandHistory.length);
  const initialAiMessageCountRef = useRef(initialAiMessages.length);
  const reactId = useId();
  const terminalSessionId = useMemo(
    () => `terminal-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`,
    [reactId]
  );

  const { heroData } = useHeroStore();
  const { projects } = useProjectsStore();
  const { skills } = useSkillsStore();
  const { settings } = useSiteSettingsStore();
  const { resolvedTheme } = useTheme();
  const chatTransport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: { terminalSessionId },
      }),
    [terminalSessionId]
  );

  // Load histories from localStorage on mount
  useEffect(() => {
    clientLogger.info('Terminal mounted', { terminalSessionId });
    clientLogger.debug('Loaded terminal command history', {
      terminalSessionId,
      commandCount: initialCommandHistoryCountRef.current,
    });
    clientLogger.debug('Loaded AI chat history', {
      terminalSessionId,
      messageCount: initialAiMessageCountRef.current,
    });
  }, [terminalSessionId]);

  // Save command history to localStorage
  useEffect(() => {
    if (commandHistory.length > 0) {
      clientLogger.debug('Saving command history', {
        terminalSessionId,
        commandCount: commandHistory.length,
      });
      localStorage.setItem('terminal_command_history', JSON.stringify(commandHistory.slice(-50)));
    }
  }, [commandHistory, terminalSessionId]);

  useEffect(() => {
    pendingQuitRef.current = pendingQuit;
  }, [pendingQuit]);

  const { messages, status, setMessages, sendMessage } = useChat({
    transport: chatTransport,
    onFinish: ({ message, finishReason, isAbort, isDisconnect, isError }) => {
      clientLogger.info('AI response finished', {
        terminalSessionId,
        finishReason,
        isAbort,
        isDisconnect,
        isError,
        message: summarizeMessage(message),
      });

      if (pendingQuitRef.current) {
        pendingQuitRef.current = false;
        setPendingQuit(false);
        setIsAiMode(false);
        setHistory((prev) => [
          ...prev,
          {
            input: 'quit',
            output: <span className="text-yellow-500">Exited AI Chat Mode.</span>,
          },
        ]);
        clientLogger.info('Quit processed after stream completion', {
          terminalSessionId,
        });
      }
    },
    onError: (error: Error) => {
      clientLogger.error('AI chat request failed', error, {
        terminalSessionId,
      });
    },
  });

  const isLoading = status === 'streaming' || status === 'submitted';
  const latestMessage = messages[messages.length - 1];
  const latestAssistantText =
    latestMessage?.role === 'assistant' ? getTextFromMessageParts(latestMessage) : '';
  const isAwaitingFirstToken =
    isLoading && (latestMessage?.role !== 'assistant' || latestAssistantText.trim().length === 0);

  // Log status changes
  useEffect(() => {
    clientLogger.debug('Chat status changed', { terminalSessionId, status });
  }, [status, terminalSessionId]);

  // Sync AI messages to local storage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      clientLogger.debug('Saving AI messages', {
        terminalSessionId,
        messageCount: messages.length,
        latestMessage: summarizeMessage(messages[messages.length - 1]),
      });
      localStorage.setItem('terminal_ai_chat_history', JSON.stringify(messages));
    }
  }, [messages, terminalSessionId]);

  // If initial messages loaded late (after hook init), we might need to manually set them
  // But useChat handles initialMessages well if provided at start. 
  // Since we load from localStorage in useEffect, we might need to sync `setMessages` once loaded.
  useEffect(() => {
    if (hasRestoredAiMessagesRef.current) {
      return;
    }

    if (initialAiMessages.length > 0 && messages.length === 0) {
      clientLogger.info('Restoring AI messages into chat state', {
        terminalSessionId,
        messageCount: initialAiMessages.length,
      });
      setMessages(initialAiMessages);
    }

    hasRestoredAiMessagesRef.current = true;
  }, [initialAiMessages, messages.length, setMessages, terminalSessionId]);


  // Auto-scroll logic
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [history, messages, isAiMode]);

  const commands = useMemo(() => {
    return {
      help: () => (
        <div className="space-y-1 text-primary/80">
          <p>Available commands:</p>
          <ul className="list-disc list-inside pl-4">
            <li><span className="text-primary font-bold">about</span> - Who am I?</li>
            <li><span className="text-primary font-bold">projects</span> - View my work</li>
            <li><span className="text-primary font-bold">skills</span> - My tech stack</li>
            <li><span className="text-primary font-bold">contact</span> - Get in touch</li>
            <li><span className="text-primary font-bold">ai</span> - Enter AI Chat Mode</li>
            <li><span className="text-primary font-bold">clear</span> - Clear terminal</li>
          </ul>
        </div>
      ),
      about: () => (
        <div className="text-foreground/90">
          <p className="text-primary font-bold mb-1">{getStableMessage(CYBERPUNK_MESSAGES.headers.about, 'about')}</p>
          <p className="leading-relaxed">{heroData.description || aiKnowledge.profile.bio}</p>
        </div>
      ),
      projects: () => (
        <div className="text-foreground/90">
          <p className="text-primary font-bold mb-2">{getStableMessage(CYBERPUNK_MESSAGES.headers.projects, 'projects')}</p>
          {projects.length > 0 ? (
            <ul className="space-y-2">
              {projects.slice(0, 5).map((project) => (
                <li key={project.id} className="flex flex-col">
                  <span className="font-bold text-primary">- {project.title}</span>
                  <span className="text-sm text-muted-foreground pl-4">{project.description.substring(0, 60)}...</span>
                </li>
              ))}
              {projects.length > 5 && <li className="text-muted-foreground italic">...and {projects.length - 5} more</li>}
            </ul>
          ) : (
            <p>No projects found in the database.</p>
          )}
        </div>
      ),
      skills: () => (
        <div className="text-foreground/90">
          <p className="text-primary font-bold mb-2">{getStableMessage(CYBERPUNK_MESSAGES.headers.skills, 'skills')}</p>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="px-2 py-1 rounded bg-primary/10 text-primary text-sm border border-primary/20">
                  {skill.name}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {aiKnowledge.skills.map((skill, i) => (
                <span key={i} className="px-2 py-1 rounded bg-primary/10 text-primary text-sm border border-primary/20">
                  {skill} (Static)
                </span>
              ))}
            </div>
          )}
        </div>
      ),
      contact: () => (
        <div className="text-foreground/90">
          <p className="text-primary font-bold mb-2">{getStableMessage(CYBERPUNK_MESSAGES.headers.contact, 'contact')}</p>
          <div className="space-y-1">
            <p>📧 Email: <a href={`mailto:${settings.social.email || aiKnowledge.profile.email}`} className="hover:text-primary transition-colors">{settings.social.email || aiKnowledge.profile.email}</a></p>
            <p>🐙 GitHub: <a href={settings.social.github || aiKnowledge.profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{settings.social.github || aiKnowledge.profile.github}</a></p>
            <p>💼 LinkedIn: <a href={settings.social.linkedin || aiKnowledge.profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{settings.social.linkedin || aiKnowledge.profile.linkedin}</a></p>
          </div>
        </div>
      ),
      clear: () => {
        clientLogger.info('Clearing terminal history', { terminalSessionId });
        setHistory([]);
        clientLogger.info('Clearing AI chat history from clear command', { terminalSessionId });
        setMessages([]);
        localStorage.removeItem('terminal_ai_chat_history');
        return null;
      }
    };
  }, [heroData, projects, setMessages, settings, skills, terminalSessionId]);

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    clientLogger.info('Terminal command received', {
      terminalSessionId,
      isAiMode,
      pendingQuit,
      commandPreview: truncateForLog(trimmedCmd),
    });

    // Add to specific command history for up/down navigation
    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    // AI MODE LOGIC
    if (isAiMode) {
      if (trimmedCmd.toLowerCase() === 'quit') {
        if (isLoading) {
          setPendingQuit(true);
          pendingQuitRef.current = true;
          clientLogger.info('Quit queued while AI response is in progress', {
            terminalSessionId,
            status,
          });
          setHistory((prev) => [
            ...prev,
            {
              input: cmd,
              output: (
                <span className="text-yellow-500">
                  AI response in progress. quit queued; exiting after current response.
                </span>
              ),
            },
          ]);
          return;
        }

        clientLogger.info('Exiting AI mode immediately', { terminalSessionId });
        setPendingQuit(false);
        pendingQuitRef.current = false;
        setIsAiMode(false);
        setHistory((prev) => [
          ...prev,
          { input: cmd, output: <span className="text-yellow-500">Exited AI Chat Mode.</span> },
        ]);
        return;
      }
      if (trimmedCmd.toLowerCase() === 'clear') {
        clientLogger.info('Clearing terminal while in AI mode', { terminalSessionId });
        setHistory([]);
        clientLogger.info('Clearing AI chat history from clear command (AI mode)', {
          terminalSessionId,
        });
        setMessages([]);
        localStorage.removeItem('terminal_ai_chat_history');
        return;
      }

      if (pendingQuitRef.current) {
        setHistory((prev) => [
          ...prev,
          {
            input: cmd,
            output: <span className="text-yellow-500">quit is already queued. Waiting for response to finish.</span>,
          },
        ]);
        return;
      }

      // Send to AI
      try {
        clientLogger.info('Sending message to AI backend', {
          terminalSessionId,
          status,
          messagePreview: truncateForLog(trimmedCmd),
        });
        await sendMessage({
          text: trimmedCmd,
        });
      } catch (e) {
        clientLogger.error('Failed to send message to AI', e, {
          terminalSessionId,
        });
        setHistory((prev) => [
          ...prev,
          {
            input: cmd,
            output: <span className="text-red-500">Error sending message. Check logs for details.</span>,
          },
        ]);
      }
      return;
    }

    // STANDARD MODE LOGIC
    const lowerCmd = trimmedCmd.toLowerCase();
    const commandName = lowerCmd.split(' ')[0];

    if (commandName === 'ai') {
      clientLogger.info('Entering AI mode', { terminalSessionId });
      setIsAiMode(true);
      setPendingQuit(false);
      pendingQuitRef.current = false;
      setHistory(prev => [...prev, {
        input: cmd,
        output: (
          <div className="text-primary">
            <p>Initializing AI Link... Connected.</p>
            <p className="text-xs text-muted-foreground mt-1">Type &apos;quit&apos; to return to standard shell.</p>
          </div>
        )
      }]);
      return;
    }

    let output: React.ReactNode = null;

    if (commandName in commands) {
      clientLogger.debug('Executing local terminal command', {
        terminalSessionId,
        commandName,
      });
      output = commands[commandName as keyof typeof commands]();
      if (commandName === 'clear') return;
    } else {
      clientLogger.warn('Unknown terminal command', {
        terminalSessionId,
        commandName,
      });
      output = <span className="text-red-500">Command not found: {commandName}. Type &apos;help&apos; for available commands.</span>;
    }

    setHistory((prev) => [...prev, { input: cmd, output }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
        if (historyIndex === commandHistory.length - 1) {
          setHistoryIndex(-1);
          setInput('');
        }
      }
    }
  };

  const promptLabel = isAiMode ? 'ai@portfolio:~$' : 'visitor@portfolio:~$';

  return (
    <section className="w-full py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, ${resolvedTheme === 'dark' ? '#333' : '#ccc'} 1px, transparent 1px), linear-gradient(to bottom, ${resolvedTheme === 'dark' ? '#333' : '#ccc'} 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 glitch-text" data-text="TERMINAL_ACCESS">
            TERMINAL_ACCESS
          </h2>
          <p className="text-muted-foreground text-sm">{getStableMessage(CYBERPUNK_MESSAGES.prompts, 'prompts')}</p>
        </div>

        <div
          className="bg-card/80 dark:bg-black/80 border border-primary/30 rounded-lg p-6 min-h-[400px] max-h-[600px] overflow-y-auto shadow-[0_0_30px_rgba(var(--primary),0.1)] backdrop-blur-sm scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent font-mono text-sm md:text-base"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="space-y-4">
            <div className="text-muted-foreground text-xs md:text-sm mb-4 border-b border-primary/10 pb-2">
              Last login: {new Date().toLocaleString()} on ttys000
              <br />
              System: {resolvedTheme === 'dark' ? 'NEON_OS_V2.0' : 'LIGHT_CORE_V1.0'}
              <br />
              Type <span className="text-primary font-bold">&apos;help&apos;</span> to see available commands.
            </div>

            {/* Standard Terminal History */}
            {history.map((entry, i) => (
              <div key={i} className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2">
                  <span className="text-primary/70">{entry.input.startsWith('ai') && entry.input !== 'ai' ? 'ai@portfolio:~$' : 'visitor@portfolio:~$'}</span>
                  <span className="text-foreground font-medium">{entry.input}</span>
                </div>
                {entry.output && (
                  <div className="pl-4 pb-2 border-l-2 border-primary/10 ml-1">
                    {entry.output}
                  </div>
                )}
              </div>
            ))}

            {/* AI Chat History - Only show active chat when in AI Mode */}
            {isAiMode && (
              <div className="mt-4 border-t border-primary/20 pt-4 relative">
                <div className="absolute top-0 right-0 text-[10px] text-primary/50 uppercase tracking-widest">Secure Link Active</div>
                {messages.map((m) => (
                  <div key={m.id} className="mb-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-xs uppercase font-bold", m.role === 'user' ? "text-primary/70" : "text-accent")}>
                        {m.role === 'user' ? 'You' : 'AI_Assistant'}
                      </span>
                    </div>
                    <div className="pl-2 border-l-2 border-primary/10 ml-1">
                      {m.role === 'assistant' ? (
                        (() => {
                          const textContent = getTextFromMessageParts(m).trim();
                          const assistantStatus = getAssistantStatusFromMessage(m);

                          if (textContent.length > 0) {
                            return <TerminalMarkdown content={textContent} />;
                          }

                          if (assistantStatus) {
                            return (
                              <div className="text-xs text-accent/80 italic animate-pulse">
                                {assistantStatus}
                              </div>
                            );
                          }

                          return (
                            <div className="text-xs text-muted-foreground italic">
                              Waiting for final response...
                            </div>
                          );
                        })()
                      ) : (
                        <div className="text-foreground whitespace-pre-wrap">
                          {getTextFromMessageParts(m)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="pl-4 pb-2 border-l-2 border-primary/10 ml-1">
                    {isAwaitingFirstToken ? (
                      <div className="flex items-center gap-2 text-xs text-primary/70">
                        <span>Generating response</span>
                        <div className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                        </div>
                      </div>
                    ) : (
                      <span className="animate-pulse inline-block w-2 h-4 bg-primary align-middle" />
                    )}
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
              <span className={cn("shrink-0 transition-colors", isAiMode ? "text-accent" : "text-primary/70")}>{promptLabel}</span>
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none outline-none text-foreground w-full focus:ring-0 p-0"
                  spellCheck={false}
                  autoComplete="off"
                  autoFocus
                />
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className={cn("w-2 h-5 absolute", isAiMode ? "bg-accent" : "bg-primary")}
                  style={{ left: `${input.length}ch` }}
                />
              </div>
            </form>
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
