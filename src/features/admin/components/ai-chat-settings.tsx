'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  useAiChatConfigStore,
  type AiChatContextBlock,
  type AiChatSettings,
  type AiChatSkill,
} from '@/lib/stores';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const createLocalId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const parseNullableNumber = (rawValue: string): number | null => {
  if (!rawValue.trim()) return null;
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) ? parsed : null;
};

const moveItem = <T,>(items: T[], from: number, to: number) => {
  const copy = [...items];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
};

export default function AiChatSettings() {
  const { toast } = useToast();
  const {
    settings,
    contextBlocks,
    skills,
    isLoading,
    error,
    fetchConfig,
    upsertSettings,
    saveContextBlocks,
    saveSkills,
  } = useAiChatConfigStore();

  const [settingsDraft, setSettingsDraft] = useState<AiChatSettings>(settings);
  const [contextDraft, setContextDraft] = useState<AiChatContextBlock[]>(contextBlocks);
  const [skillsDraft, setSkillsDraft] = useState<AiChatSkill[]>(skills);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    setSettingsDraft(settings);
  }, [settings]);

  useEffect(() => {
    setContextDraft(contextBlocks);
  }, [contextBlocks]);

  useEffect(() => {
    setSkillsDraft(skills);
  }, [skills]);

  const hasUnsavedSettings = useMemo(
    () =>
      JSON.stringify({
        ...settingsDraft,
        id: undefined,
      }) !==
      JSON.stringify({
        ...settings,
        id: undefined,
      }),
    [settings, settingsDraft]
  );

  const handleSaveSettings = async () => {
    const savedId = await upsertSettings(settingsDraft);
    if (!savedId) {
      toast({
        title: 'Failed to save AI settings',
        description: 'Check logs for details and try again.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'AI settings saved',
      description: 'System prompt and model configuration were updated.',
    });
  };

  const handleSaveContextBlocks = async () => {
    const ok = await saveContextBlocks(contextDraft);
    if (ok) {
      toast({
        title: 'Context blocks saved',
        description: 'Runtime context blocks are now active for chat.',
      });
      return;
    }

    toast({
      title: 'Failed to save context blocks',
      description: 'Check logs for details and try again.',
      variant: 'destructive',
    });
  };

  const handleSaveSkills = async () => {
    const ok = await saveSkills(skillsDraft);
    if (ok) {
      toast({
        title: 'AI skills saved',
        description: 'Skill instructions are now active for chat.',
      });
      return;
    }

    toast({
      title: 'Failed to save skills',
      description: 'Check logs for details and try again.',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-red-500/50">
          <CardHeader>
            <CardTitle className="text-red-500">AI Config Error</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Assistant Runtime</CardTitle>
          <CardDescription>
            Configure model and core system prompt used by <code>/api/chat</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ai-provider">Provider</Label>
              <Input
                id="ai-provider"
                value={settingsDraft.provider}
                onChange={(e) =>
                  setSettingsDraft((prev) => ({ ...prev, provider: e.target.value }))
                }
                placeholder="google"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-model">Model</Label>
              <Input
                id="ai-model"
                value={settingsDraft.model}
                onChange={(e) => setSettingsDraft((prev) => ({ ...prev, model: e.target.value }))}
                placeholder="gemini-3-flash-preview"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Textarea
              id="system-prompt"
              value={settingsDraft.systemPrompt}
              onChange={(e) =>
                setSettingsDraft((prev) => ({ ...prev, systemPrompt: e.target.value }))
              }
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={settingsDraft.temperature ?? ''}
                onChange={(e) =>
                  setSettingsDraft((prev) => ({
                    ...prev,
                    temperature: parseNullableNumber(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="top-p">Top P</Label>
              <Input
                id="top-p"
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={settingsDraft.topP ?? ''}
                onChange={(e) =>
                  setSettingsDraft((prev) => ({
                    ...prev,
                    topP: parseNullableNumber(e.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-output-tokens">Max Output Tokens</Label>
              <Input
                id="max-output-tokens"
                type="number"
                min="1"
                value={settingsDraft.maxOutputTokens ?? ''}
                onChange={(e) =>
                  setSettingsDraft((prev) => ({
                    ...prev,
                    maxOutputTokens: parseNullableNumber(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between rounded-md border p-3">
              <Label htmlFor="settings-enabled">Enabled</Label>
              <Switch
                id="settings-enabled"
                checked={settingsDraft.enabled}
                onCheckedChange={(checked) =>
                  setSettingsDraft((prev) => ({ ...prev, enabled: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <Label htmlFor="include-site-context">Include Context Blocks</Label>
              <Switch
                id="include-site-context"
                checked={settingsDraft.includeSiteContext}
                onCheckedChange={(checked) =>
                  setSettingsDraft((prev) => ({ ...prev, includeSiteContext: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <Label htmlFor="include-skills-context">Include Skill Blocks</Label>
              <Switch
                id="include-skills-context"
                checked={settingsDraft.includeSkillsContext}
                onCheckedChange={(checked) =>
                  setSettingsDraft((prev) => ({ ...prev, includeSkillsContext: checked }))
                }
              />
            </div>
          </div>

          <Button onClick={handleSaveSettings} disabled={isLoading || !hasUnsavedSettings}>
            {isLoading ? 'Saving...' : 'Save Assistant Runtime'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Context Blocks</CardTitle>
          <CardDescription>
            Additional static context appended to the system prompt when enabled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contextDraft.map((block, index) => (
            <div key={block.id} className="space-y-3 rounded-md border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label className="font-medium">Context Block {index + 1}</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={index === 0}
                    onClick={() => setContextDraft((prev) => moveItem(prev, index, index - 1))}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={index === contextDraft.length - 1}
                    onClick={() => setContextDraft((prev) => moveItem(prev, index, index + 1))}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      setContextDraft((prev) => prev.filter((item) => item.id !== block.id))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Input
                value={block.title}
                onChange={(e) =>
                  setContextDraft((prev) =>
                    prev.map((item) =>
                      item.id === block.id ? { ...item, title: e.target.value } : item
                    )
                  )
                }
                placeholder="Block title"
              />
              <Textarea
                value={block.content}
                onChange={(e) =>
                  setContextDraft((prev) =>
                    prev.map((item) =>
                      item.id === block.id ? { ...item, content: e.target.value } : item
                    )
                  )
                }
                rows={4}
                placeholder="Context content"
              />
              <div className="flex items-center justify-between rounded-md border p-3">
                <Label htmlFor={`context-enabled-${block.id}`}>Enabled</Label>
                <Switch
                  id={`context-enabled-${block.id}`}
                  checked={block.enabled}
                  onCheckedChange={(checked) =>
                    setContextDraft((prev) =>
                      prev.map((item) =>
                        item.id === block.id ? { ...item, enabled: checked } : item
                      )
                    )
                  }
                />
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setContextDraft((prev) => [
                  ...prev,
                  {
                    id: createLocalId('context'),
                    title: 'New Context',
                    content: '',
                    orderIndex: prev.length,
                    enabled: true,
                  },
                ])
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Context Block
            </Button>
            <Button type="button" onClick={handleSaveContextBlocks} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Context Blocks'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skill Instructions</CardTitle>
          <CardDescription>
            Specialized skill instructions appended when skill context is enabled.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {skillsDraft.map((skill, index) => (
            <div key={skill.id} className="space-y-3 rounded-md border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label className="font-medium">Skill {index + 1}</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={index === 0}
                    onClick={() => setSkillsDraft((prev) => moveItem(prev, index, index - 1))}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={index === skillsDraft.length - 1}
                    onClick={() => setSkillsDraft((prev) => moveItem(prev, index, index + 1))}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => setSkillsDraft((prev) => prev.filter((item) => item.id !== skill.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Input
                value={skill.name}
                onChange={(e) =>
                  setSkillsDraft((prev) =>
                    prev.map((item) =>
                      item.id === skill.id ? { ...item, name: e.target.value } : item
                    )
                  )
                }
                placeholder="Skill name"
              />
              <Input
                value={skill.description}
                onChange={(e) =>
                  setSkillsDraft((prev) =>
                    prev.map((item) =>
                      item.id === skill.id ? { ...item, description: e.target.value } : item
                    )
                  )
                }
                placeholder="Short description"
              />
              <Textarea
                value={skill.instructions}
                onChange={(e) =>
                  setSkillsDraft((prev) =>
                    prev.map((item) =>
                      item.id === skill.id ? { ...item, instructions: e.target.value } : item
                    )
                  )
                }
                rows={4}
                placeholder="Instruction text"
              />
              <div className="flex items-center justify-between rounded-md border p-3">
                <Label htmlFor={`skill-enabled-${skill.id}`}>Enabled</Label>
                <Switch
                  id={`skill-enabled-${skill.id}`}
                  checked={skill.enabled}
                  onCheckedChange={(checked) =>
                    setSkillsDraft((prev) =>
                      prev.map((item) =>
                        item.id === skill.id ? { ...item, enabled: checked } : item
                      )
                    )
                  }
                />
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setSkillsDraft((prev) => [
                  ...prev,
                  {
                    id: createLocalId('skill'),
                    name: 'New Skill',
                    description: '',
                    instructions: '',
                    orderIndex: prev.length,
                    enabled: true,
                  },
                ])
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Skill Instruction
            </Button>
            <Button type="button" onClick={handleSaveSkills} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Skill Instructions'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
