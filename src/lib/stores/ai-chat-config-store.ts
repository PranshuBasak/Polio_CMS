import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/lib/types/supabase';
import aiKnowledge from '@/data/ai-knowledge.json';
import { create } from 'zustand';
import { z } from 'zod';

type AiChatSettingsRow = Database['public']['Tables']['ai_chat_settings']['Row'];
type AiChatContextBlockRow = Database['public']['Tables']['ai_chat_context_blocks']['Row'];
type AiChatSkillRow = Database['public']['Tables']['ai_chat_skills']['Row'];

export type AiChatSettings = {
  id?: string;
  name: string;
  provider: string;
  model: string;
  systemPrompt: string;
  temperature: number | null;
  topP: number | null;
  maxOutputTokens: number | null;
  includeSiteContext: boolean;
  includeSkillsContext: boolean;
  enabled: boolean;
};

export type AiChatContextBlock = {
  id: string;
  title: string;
  content: string;
  orderIndex: number;
  enabled: boolean;
};

export type AiChatSkill = {
  id: string;
  name: string;
  description: string;
  instructions: string;
  orderIndex: number;
  enabled: boolean;
};

const aiChatSettingsSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).default('default'),
  provider: z.string().min(1).default('google'),
  model: z.string().min(1),
  systemPrompt: z.string().min(1),
  temperature: z.number().min(0).max(2).nullable(),
  topP: z.number().min(0).max(1).nullable(),
  maxOutputTokens: z.number().int().positive().nullable(),
  includeSiteContext: z.boolean(),
  includeSkillsContext: z.boolean(),
  enabled: z.boolean(),
});

const aiChatContextBlockSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  content: z.string().min(1),
  orderIndex: z.number().int().min(0),
  enabled: z.boolean(),
});

const aiChatSkillSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  instructions: z.string().min(1),
  orderIndex: z.number().int().min(0),
  enabled: z.boolean(),
});

const DEFAULT_SETTINGS: AiChatSettings = {
  name: 'default',
  provider: 'google',
  model: 'gemini-3-flash-preview',
  systemPrompt: aiKnowledge.systemPrompt,
  temperature: null,
  topP: null,
  maxOutputTokens: null,
  includeSiteContext: true,
  includeSkillsContext: true,
  enabled: true,
};

const mapSettingsRow = (row: AiChatSettingsRow): AiChatSettings => ({
  id: row.id,
  name: row.name,
  provider: row.provider,
  model: row.model,
  systemPrompt: row.system_prompt,
  temperature: row.temperature,
  topP: row.top_p,
  maxOutputTokens: row.max_output_tokens,
  includeSiteContext: row.include_site_context,
  includeSkillsContext: row.include_skills_context,
  enabled: row.enabled,
});

const mapContextBlockRow = (row: AiChatContextBlockRow): AiChatContextBlock => ({
  id: row.id,
  title: row.title,
  content: row.content,
  orderIndex: row.order_index,
  enabled: row.enabled,
});

const mapSkillRow = (row: AiChatSkillRow): AiChatSkill => ({
  id: row.id,
  name: row.name,
  description: row.description || '',
  instructions: row.instructions,
  orderIndex: row.order_index,
  enabled: row.enabled,
});

type AiChatConfigStore = {
  settings: AiChatSettings;
  contextBlocks: AiChatContextBlock[];
  skills: AiChatSkill[];
  isLoading: boolean;
  error: string | null;
  fetchConfig: () => Promise<void>;
  upsertSettings: (settings: Partial<AiChatSettings>) => Promise<string | null>;
  saveContextBlocks: (blocks: AiChatContextBlock[]) => Promise<boolean>;
  saveSkills: (skills: AiChatSkill[]) => Promise<boolean>;
  reset: () => void;
};

export const useAiChatConfigStore = create<AiChatConfigStore>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  contextBlocks: [],
  skills: [],
  isLoading: false,
  error: null,

  fetchConfig: async () => {
    set({ isLoading: true, error: null });

    try {
      const supabase = createClient();

      const { data: activeSettings } = await supabase
        .from('ai_chat_settings')
        .select('*')
        .eq('enabled', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const settingsRow = activeSettings
        ? activeSettings
        : (
            await supabase
              .from('ai_chat_settings')
              .select('*')
              .order('updated_at', { ascending: false })
              .limit(1)
              .maybeSingle()
          ).data;

      if (!settingsRow) {
        set({
          settings: DEFAULT_SETTINGS,
          contextBlocks: [],
          skills: [],
          isLoading: false,
        });
        return;
      }

      const [contextResult, skillsResult] = await Promise.all([
        supabase
          .from('ai_chat_context_blocks')
          .select('*')
          .eq('settings_id', settingsRow.id)
          .order('order_index', { ascending: true }),
        supabase
          .from('ai_chat_skills')
          .select('*')
          .eq('settings_id', settingsRow.id)
          .order('order_index', { ascending: true }),
      ]);

      if (contextResult.error) throw contextResult.error;
      if (skillsResult.error) throw skillsResult.error;

      set({
        settings: mapSettingsRow(settingsRow),
        contextBlocks: (contextResult.data || []).map(mapContextBlockRow),
        skills: (skillsResult.data || []).map(mapSkillRow),
      });
    } catch (error) {
      console.error('Failed to fetch AI chat configuration:', error);
      set({
        error: (error as Error).message || 'Failed to fetch AI chat configuration',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  upsertSettings: async (settingsPatch) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const mergedSettings = {
        ...DEFAULT_SETTINGS,
        ...get().settings,
        ...settingsPatch,
      };
      const parsed = aiChatSettingsSchema.parse(mergedSettings);

      const payload: Database['public']['Tables']['ai_chat_settings']['Insert'] = {
        name: parsed.name,
        provider: parsed.provider,
        model: parsed.model,
        system_prompt: parsed.systemPrompt,
        temperature: parsed.temperature,
        top_p: parsed.topP,
        max_output_tokens: parsed.maxOutputTokens,
        include_site_context: parsed.includeSiteContext,
        include_skills_context: parsed.includeSkillsContext,
        enabled: parsed.enabled,
      };

      let targetId = parsed.id;
      if (!targetId) {
        const { data: existingByName } = await supabase
          .from('ai_chat_settings')
          .select('id')
          .eq('name', parsed.name)
          .maybeSingle();
        targetId = existingByName?.id;
      }

      const query = targetId
        ? supabase.from('ai_chat_settings').update(payload).eq('id', targetId)
        : supabase.from('ai_chat_settings').insert(payload);

      const { data, error } = await query.select('*').single();
      if (error) throw error;

      const mapped = mapSettingsRow(data);
      set({ settings: mapped });
      return mapped.id || null;
    } catch (error) {
      console.error('Failed to save AI chat settings:', error);
      set({
        error: (error as Error).message || 'Failed to save AI chat settings',
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  saveContextBlocks: async (blocks) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const settingsId = get().settings.id || (await get().upsertSettings({}));
      if (!settingsId) throw new Error('AI settings must be saved before context blocks.');

      const normalized = blocks.map((block, index) => ({
        ...block,
        orderIndex: index,
      }));
      const parsed = z.array(aiChatContextBlockSchema).parse(normalized);

      const { error: deleteError } = await supabase
        .from('ai_chat_context_blocks')
        .delete()
        .eq('settings_id', settingsId);
      if (deleteError) throw deleteError;

      if (parsed.length > 0) {
        const insertPayload: Database['public']['Tables']['ai_chat_context_blocks']['Insert'][] =
          parsed.map((block) => ({
            settings_id: settingsId,
            title: block.title,
            content: block.content,
            order_index: block.orderIndex,
            enabled: block.enabled,
          }));

        const { error: insertError } = await supabase
          .from('ai_chat_context_blocks')
          .insert(insertPayload);
        if (insertError) throw insertError;
      }

      await get().fetchConfig();
      return true;
    } catch (error) {
      console.error('Failed to save AI chat context blocks:', error);
      set({
        error: (error as Error).message || 'Failed to save AI chat context blocks',
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  saveSkills: async (skills) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const settingsId = get().settings.id || (await get().upsertSettings({}));
      if (!settingsId) throw new Error('AI settings must be saved before skills.');

      const normalized = skills.map((skill, index) => ({
        ...skill,
        orderIndex: index,
      }));
      const parsed = z.array(aiChatSkillSchema).parse(normalized);

      const { error: deleteError } = await supabase
        .from('ai_chat_skills')
        .delete()
        .eq('settings_id', settingsId);
      if (deleteError) throw deleteError;

      if (parsed.length > 0) {
        const insertPayload: Database['public']['Tables']['ai_chat_skills']['Insert'][] =
          parsed.map((skill) => ({
            settings_id: settingsId,
            name: skill.name,
            description: skill.description || null,
            instructions: skill.instructions,
            order_index: skill.orderIndex,
            enabled: skill.enabled,
          }));

        const { error: insertError } = await supabase
          .from('ai_chat_skills')
          .insert(insertPayload);
        if (insertError) throw insertError;
      }

      await get().fetchConfig();
      return true;
    } catch (error) {
      console.error('Failed to save AI chat skills:', error);
      set({
        error: (error as Error).message || 'Failed to save AI chat skills',
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () =>
    set({
      settings: DEFAULT_SETTINGS,
      contextBlocks: [],
      skills: [],
      error: null,
    }),
}));
