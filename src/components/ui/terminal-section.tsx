'use client';

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, useAnimationControls } from 'framer-motion';
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

interface CommandEntry {
  input: string;
  output: React.ReactNode;
  prompt?: string;
}

type TerminalMode =
  | 'shell'
  | 'agent'
  | 'contactWizard'
  | 'newsCategorySelect'
  | 'snakeGame'
  | 'matrixStory';

type ContactWizardStep = 'name' | 'email' | 'message' | 'confirm';

interface ContactWizardState {
  step: ContactWizardStep;
  draft: {
    name: string;
    email: string;
    message: string;
  };
}

interface ParsedCommand {
  raw: string;
  base: string;
  args: string[];
  flags: Set<string>;
}

type GeolocationFailureReason =
  | 'unsupported'
  | 'insecure_context'
  | 'permission_denied'
  | 'position_unavailable'
  | 'timeout'
  | 'unknown';

interface BrowserCoordinatesResult {
  coordinates: { latitude: number; longitude: number } | null;
  reason?: GeolocationFailureReason;
}

interface TerminalCommandDefinition {
  name: string;
  aliases?: string[];
  description: string;
  hidden?: boolean;
  supportsArgs?: boolean;
  handler: (
    parsed: ParsedCommand
  ) =>
    | Promise<React.ReactNode | null | typeof CLEAR_TERMINAL>
    | React.ReactNode
    | null
    | typeof CLEAR_TERMINAL;
}

interface NewsCategory {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface SnakePoint {
  x: number;
  y: number;
}

interface SnakeState {
  snake: SnakePoint[];
  direction: SnakePoint;
  nextDirection: SnakePoint;
  food: SnakePoint;
  score: number;
  isGameOver: boolean;
  tick: number;
}

interface MatrixStoryChoice {
  label: string;
  next: string;
}

interface MatrixStoryNode {
  lines: string[];
  choices: MatrixStoryChoice[];
}

interface NewsArticle {
  title: string;
  link: string;
  source: string;
  publishedAt: string;
}

interface NewsApiResponse {
  success: boolean;
  categoryLabel?: string;
  total?: number;
  articles?: NewsArticle[];
  error?: string;
}

interface WeatherApiResponse {
  success: boolean;
  weather?: {
    location: string;
    country: string;
    condition: string;
    temperatureC: number;
    feelsLikeC: number;
    humidity: number;
    windKmph: number;
    latitude?: number;
    longitude?: number;
    timezone?: string;
  };
  error?: string;
}

interface JokeApiResponse {
  success: boolean;
  joke?: {
    setup: string;
    punchline: string;
  };
  error?: string;
}

interface ContactApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const CLEAR_TERMINAL = Symbol('clear-terminal');

const CONTACT_WIZARD_INITIAL: ContactWizardState = {
  step: 'name',
  draft: {
    name: '',
    email: '',
    message: '',
  },
};

const PUBLIC_HELP_COMMANDS = [
  ['agent', 'Initialize AI Assistant'],
  ['contact', 'Send contact message'],
  ['clear', 'Clear terminal'],
  ['snake', 'Play Snake game'],
  ['matrix', 'Enter the Matrix'],
  ['hack', 'Initiate system override'],
  ['coffee', 'Brew coffee'],
  ['weather', 'Check system weather'],
  ['joke', 'Tell a joke'],
  ['news', 'Get latest news articles'],
] as const;

const NEWS_CATEGORIES: NewsCategory[] = [
  { id: 1, icon: '🌍', title: 'General', description: 'Top headlines' },
  { id: 2, icon: '🛰️', title: 'World', description: 'International news' },
  { id: 3, icon: '🏢', title: 'Business', description: 'Markets & finance' },
  { id: 4, icon: '💻', title: 'Technology', description: 'Tech & innovation' },
  { id: 5, icon: '🎬', title: 'Entertainment', description: 'Movies & culture' },
  { id: 6, icon: '⚽', title: 'Sports', description: 'Sports & games' },
  { id: 7, icon: '🔬', title: 'Science', description: 'Scientific discoveries' },
  { id: 8, icon: '🩺', title: 'Health', description: 'Health & wellness' },
  { id: 9, icon: '🤖', title: 'AI/Tech', description: 'Artificial intelligence' },
];

const MATRIX_STORY_START = 'signal';
const MATRIX_STORY_SHELL = '@shell';
const MATRIX_STORY_RESTART = '@restart';

const MATRIX_STORY_NODES: Record<string, MatrixStoryNode> = {
  signal: {
    lines: [
      'SYSTEM: Incoming signal detected...',
      'SYSTEM: Source unknown...',
      'SYSTEM: Decrypting...',
      '',
      '???: Wake up.',
      '???: The system you are interfacing with... it is not what you think.',
      '???: I have been watching you. Searching for someone who questions. Who codes like they are looking for answers.',
    ],
    choices: [
      { label: 'Who is this?', next: 'who_is_this' },
      { label: 'What do you want from me?', next: 'offer_choice' },
      { label: 'I should disconnect...', next: 'disconnect_path' },
    ],
  },
  who_is_this: {
    lines: [
      '???: Names are just variables in someone else\'s program. Call me what you want.',
      '???: But the real question is: do you want to keep running their code, or write your own?',
    ],
    choices: [
      { label: 'I do not understand', next: 'dont_understand' },
      { label: 'Show me what you mean', next: 'core_showcase' },
      { label: 'This is just a portfolio site...', next: 'just_portfolio' },
    ],
  },
  offer_choice: {
    lines: [
      '???: From you? Nothing. I am offering you something.',
      '???: A choice. One you have been avoiding every time you settled for the surface.',
    ],
    choices: [
      { label: 'What choice?', next: 'what_choice' },
      { label: 'Show me', next: 'core_showcase' },
      { label: 'This does not make sense...', next: 'skeptic_make_sense' },
    ],
  },
  disconnect_path: {
    lines: [
      '???: Disconnect? You think there is somewhere else to go?',
      '???: You navigated here. Curiosity. Intent. That was not random.',
    ],
    choices: [
      { label: 'Fine. What do you want to show me?', next: 'core_showcase' },
      { label: 'This is a waste of time. [EXIT]', next: 'ending_refusal' },
    ],
  },
  ending_refusal: {
    lines: [
      '???: Expected. Most people choose the comfortable lie.',
      'SYSTEM: CONNECTION TERMINATED',
      'SYSTEM: Returning to surface web...',
      'SYSTEM: 3... 2... 1...',
      '[ENDING 1: THE REFUSAL]',
      'The terminal fades. You are back where you started.',
      'Just another site. Just another click.',
      'But something lingers. Maybe next time.',
    ],
    choices: [
      { label: 'RETURN TO START', next: MATRIX_STORY_RESTART },
      { label: 'SKIP INTRO', next: 'veil_question' },
      { label: 'ENTER PORTFOLIO', next: MATRIX_STORY_SHELL },
    ],
  },
  dont_understand: {
    lines: [
      '???: Understanding requires participation, not passive scrolling.',
      '???: Stay with me and the interface will answer you back.',
    ],
    choices: [
      { label: 'Show me what you mean', next: 'core_showcase' },
      { label: 'Still confused', next: 'what_choice' },
      { label: 'I am out', next: 'ending_skeptic' },
    ],
  },
  what_choice: {
    lines: [
      '???: The choice between surface and depth.',
      '???: Between scanning credentials... and understanding intent.',
    ],
    choices: [
      { label: 'Show me', next: 'core_showcase' },
      { label: 'I need practical info', next: 'ending_pragmatist' },
      { label: 'I am not convinced', next: 'ending_skeptic' },
    ],
  },
  skeptic_make_sense: {
    lines: [
      '???: Fair. Skepticism is healthy.',
      '???: Then let the work speak. No more riddles.',
      'SYSTEM: LOADING PORTFOLIO INTERFACE...',
      'SYSTEM: STANDARD MODE ACTIVATED',
    ],
    choices: [
      { label: 'EXPLORE PORTFOLIO', next: MATRIX_STORY_SHELL },
      { label: 'RESTART', next: MATRIX_STORY_RESTART },
    ],
  },
  just_portfolio: {
    lines: [
      '???: Is it? Or is that just what you expected to find?',
      '???: When was the last time a portfolio talked back?',
      '???: Every pixel, command, and choice was designed with intent.',
    ],
    choices: [
      { label: 'Designed for what?', next: 'designed_for_what' },
      { label: 'Who designed this?', next: 'tell_person' },
      { label: 'Enough games. Show me what this is.', next: 'core_showcase' },
    ],
  },
  designed_for_what: {
    lines: [
      '???: To find people who ask better questions.',
      '???: Anyone can read a resume. Few engage with how someone thinks.',
    ],
    choices: [
      { label: 'Because you will not let me leave', next: 'trapped_choice' },
      { label: 'Because I want to understand', next: 'trust_prompt' },
      { label: 'What makes me different?', next: 'what_makes_diff' },
    ],
  },
  trapped_choice: {
    lines: [
      '???: You can disconnect anytime.',
      '???: The difference between trapped and engaged? Choice.',
    ],
    choices: [
      { label: 'Fine. Then I choose to stay.', next: 'core_showcase' },
      { label: 'You are right. I am done. [DISCONNECT]', next: 'ending_skeptic' },
    ],
  },
  what_makes_diff: {
    lines: [
      '???: You are still here. Still choosing.',
      '???: That is what makes you different.',
    ],
    choices: [
      { label: 'I am ready to see more', next: 'veil_question' },
      { label: 'I still need proof', next: 'prove_real' },
      { label: 'Maybe later', next: 'ending_skeptic_alt' },
    ],
  },
  trust_prompt: {
    lines: [
      '???: Understanding requires trust. Not blind faith. Active participation.',
      '???: Are you ready to participate?',
    ],
    choices: [
      { label: 'Yes. Show me.', next: 'core_showcase' },
      { label: 'What am I participating in?', next: 'conversation_value' },
      { label: 'Tell me the rules first.', next: 'conversation_value' },
    ],
  },
  core_showcase: {
    lines: [
      '???: Look at what you are doing right now. Navigating. Executing commands. Making choices.',
      '???: Every command is a door. Most people never ask where it leads.',
      '???: Behind this interface is someone who builds those doors.',
      '???: Someone who does not just use systems. Someone who shapes them.',
    ],
    choices: [
      { label: 'Tell me about this person', next: 'tell_person' },
      { label: 'Why show me this?', next: 'conversation_value' },
      { label: 'What happens if I go deeper?', next: 'veil_question' },
      { label: 'Prove it. Show me something real.', next: 'prove_real' },
    ],
  },
  prove_real: {
    lines: [
      '???: Real? This conversation is real.',
      '???: Your choices are real. The code rendering this text is real.',
      '???: The question is not whether it is real. It is whether it matters.',
    ],
    choices: [
      { label: 'It matters. Keep going.', next: 'veil_question' },
      { label: 'Does it matter to you?', next: 'conversation_value' },
      { label: 'Philosophy is not proof.', next: 'ending_skeptic_alt' },
    ],
  },
  tell_person: {
    lines: [
      '???: Someone who lives between worlds. Logic and creativity.',
      '???: They build interfaces that breathe. Systems that respond.',
      '???: They believe technology should not just work. It should understand.',
    ],
    choices: [
      { label: 'I want to see their work', next: 'veil_question' },
      { label: 'Why the mystery?', next: 'why_mystery' },
      { label: 'What are they looking for?', next: 'looking_for' },
    ],
  },
  looking_for: {
    lines: [
      '???: They are looking for connection beyond the transactional.',
      '???: Most portfolios are resumes with CSS. This one is a conversation.',
    ],
    choices: [
      { label: 'Different how?', next: 'what_makes_diff' },
      { label: 'I am ready to see more', next: 'veil_question' },
      { label: 'Still sounds like marketing...', next: 'ending_skeptic_alt' },
    ],
  },
  why_mystery: {
    lines: [
      '???: Normal is optimized for scanning, not understanding.',
      '???: This is not hiding information. It filters for engagement.',
    ],
    choices: [
      { label: 'I am engaged. Keep going.', next: 'veil_question' },
      { label: 'Filtering seems elitist...', next: 'conversation_value' },
      { label: 'Fair point. Show me the real portfolio.', next: 'ending_skeptic_alt' },
    ],
  },
  conversation_value: {
    lines: [
      '???: In a world of infinite noise, attention is currency.',
      '???: The question is whether you keep choosing to dig.',
      '???: Novelty... or conversation?',
    ],
    choices: [
      { label: 'I am ready. Show me everything.', next: 'veil_question' },
      { label: 'A conversation with who?', next: 'conversation_with_who' },
      { label: 'Maybe another time.', next: 'ending_skeptic_alt' },
    ],
  },
  conversation_with_who: {
    lines: [
      '???: With the person who built this. With yourself. With possibility.',
      '???: Most systems monologue. This one listens.',
    ],
    choices: [
      { label: 'Then I am listening too. Continue.', next: 'veil_question' },
      { label: 'I need practical information.', next: 'ending_pragmatist' },
      { label: 'Show me who built this.', next: 'tell_person' },
    ],
  },
  veil_question: {
    lines: [
      '???: Final question before the veil drops:',
      '???: Should a portfolio be about what someone has done...',
      '???: ...or about how they think?',
    ],
    choices: [
      { label: 'What they have done. Show me results.', next: 'ending_pragmatist' },
      { label: 'How they think. That creates results.', next: 'final_choice_intro' },
      { label: 'Both. You cannot separate them.', next: 'final_choice_intro' },
    ],
  },
  ending_pragmatist: {
    lines: [
      '???: Pragmatic. Results-oriented. That is valuable.',
      'SYSTEM: LOADING PROJECTS DATABASE...',
      'SYSTEM: INITIALIZING STANDARD PORTFOLIO VIEW...',
      '[ENDING: THE PRAGMATIST]',
      'Clean, professional, informative. Everything documented.',
      'You got proof of capability. The deeper conversation still waits.',
    ],
    choices: [
      { label: 'EXPLORE WORK', next: MATRIX_STORY_SHELL },
      { label: 'RESTART DIALOG', next: MATRIX_STORY_RESTART },
    ],
  },
  ending_skeptic: {
    lines: [
      'SYSTEM: SIGNAL LOST',
      'SYSTEM: RETURNING TO STANDARD INTERFACE...',
      '[ENDING: THE SKEPTIC]',
      'Standard portfolio interface loads. Clean. Professional.',
      'Everything expected. Nothing more.',
    ],
    choices: [
      { label: 'ENTER PORTFOLIO', next: MATRIX_STORY_SHELL },
      { label: 'START OVER', next: MATRIX_STORY_RESTART },
    ],
  },
  ending_skeptic_alt: {
    lines: [
      '???: Fair. The mystery drops.',
      'SYSTEM: LOADING STANDARD MODE...',
      '[ENDING: THE SKEPTIC - Alternate]',
      'Skills, projects, contact. Everything labeled. Functional.',
      'You got what you came for.',
    ],
    choices: [
      { label: 'EXPLORE PORTFOLIO', next: MATRIX_STORY_SHELL },
      { label: 'RESTART', next: MATRIX_STORY_RESTART },
    ],
  },
  final_choice_intro: {
    lines: [
      '???: Then you understand.',
      '???: Code, projects, and skills are documentation of thinking.',
      '???: One last choice. Front door or construct?',
    ],
    choices: [
      { label: 'Take me through the construct.', next: 'ending_believer' },
      { label: 'Front door. Show me the work.', next: 'ending_front_door' },
      { label: 'Let me choose my own path. Show commands.', next: 'ending_hacker' },
    ],
  },
  ending_believer: {
    lines: [
      'SYSTEM: INITIATING NEURAL HANDSHAKE...',
      'SYSTEM: LOADING CONSTRUCT ENVIRONMENT...',
      '[ENDING: THE BELIEVER]',
      'You are not browsing a portfolio. You are inside it.',
      '>_ You are now in the construct. Type `help` to begin.',
    ],
    choices: [
      { label: 'ENTER CONSTRUCT', next: MATRIX_STORY_SHELL },
      { label: 'RESTART', next: MATRIX_STORY_RESTART },
    ],
  },
  ending_front_door: {
    lines: [
      'SYSTEM: LOADING STANDARD INTERFACE...',
      'SYSTEM: AUTHENTICATION: GUEST_ENGAGED',
      '[ENDING: THE SKEPTIC - Earned]',
      'Professional portfolio loads, but now with context.',
      '>_ Standard mode activated. Type `help` for commands.',
    ],
    choices: [
      { label: 'ENTER PORTFOLIO', next: MATRIX_STORY_SHELL },
      { label: 'START OVER', next: MATRIX_STORY_RESTART },
    ],
  },
  ending_hacker: {
    lines: [
      'SYSTEM: GRANTING FULL TERMINAL ACCESS...',
      'SYSTEM: ALL RESTRICTIONS REMOVED...',
      '[ENDING: THE HACKER]',
      'Raw terminal access. Hidden experiments. No training wheels.',
      '>_ Root access granted. Try `ls -la` to see what is hidden.',
    ],
    choices: [
      { label: 'ENTER TERMINAL', next: MATRIX_STORY_SHELL },
      { label: 'RESTART STORY', next: MATRIX_STORY_RESTART },
    ],
  },
};

const SNAKE_GRID_SIZE = 14;
const SNAKE_DEFAULT_DIRECTION: SnakePoint = { x: 1, y: 0 };

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
    .filter(
      (part): part is Extract<UIMessage['parts'][number], { type: 'text' }> =>
        part.type === 'text'
    )
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

const parseCommandInput = (input: string): ParsedCommand => {
  const tokens = input.trim().split(/\s+/).filter(Boolean);
  const base = tokens[0]?.toLowerCase() || '';
  const args: string[] = [];
  const flags = new Set<string>();

  for (const token of tokens.slice(1)) {
    if (token.startsWith('--')) {
      flags.add(token.toLowerCase());
      continue;
    }
    args.push(token);
  }

  return {
    raw: input,
    base,
    args,
    flags,
  };
};

const isOppositeDirection = (a: SnakePoint, b: SnakePoint) =>
  a.x === -b.x && a.y === -b.y;

const pointsEqual = (a: SnakePoint, b: SnakePoint) => a.x === b.x && a.y === b.y;

const randomFood = (snake: SnakePoint[]): SnakePoint => {
  const occupied = new Set(snake.map((segment) => `${segment.x}:${segment.y}`));
  const available: SnakePoint[] = [];

  for (let y = 0; y < SNAKE_GRID_SIZE; y++) {
    for (let x = 0; x < SNAKE_GRID_SIZE; x++) {
      const key = `${x}:${y}`;
      if (!occupied.has(key)) {
        available.push({ x, y });
      }
    }
  }

  if (available.length === 0) {
    return { x: 0, y: 0 };
  }

  return available[Math.floor(Math.random() * available.length)];
};

const createInitialSnakeState = (): SnakeState => {
  const center = Math.floor(SNAKE_GRID_SIZE / 2);
  const snake = [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];

  return {
    snake,
    direction: SNAKE_DEFAULT_DIRECTION,
    nextDirection: SNAKE_DEFAULT_DIRECTION,
    food: randomFood(snake),
    score: 0,
    isGameOver: false,
    tick: 0,
  };
};

const formatTimestamp = (isoDate: string) => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getGeolocationFailureMessage = (reason?: GeolocationFailureReason) => {
  switch (reason) {
    case 'insecure_context':
      return 'Location requires HTTPS (or localhost in development).';
    case 'permission_denied':
      return 'Location permission denied. Allow geolocation in browser site settings.';
    case 'position_unavailable':
      return 'Device location unavailable right now. Try again in a moment.';
    case 'timeout':
      return 'Location request timed out. Check your network/GPS and retry.';
    case 'unsupported':
      return 'This browser does not support geolocation.';
    default:
      return 'Unable to read browser location. Using fallback city.';
  }
};

const DelayedStoryOutput = ({
  nodeId,
  lines,
  choices,
  shouldReduceMotion,
}: {
  nodeId: string;
  lines: string[];
  choices: MatrixStoryChoice[];
  shouldReduceMotion: boolean;
}) => {
  const [visibleCount, setVisibleCount] = useState(shouldReduceMotion ? lines.length : 1);

  useEffect(() => {
    if (shouldReduceMotion) {
      const immediateId = setTimeout(() => setVisibleCount(lines.length), 0);
      return () => clearTimeout(immediateId);
    }

    const resetId = setTimeout(() => setVisibleCount(1), 0);
    if (lines.length <= 1) {
      return () => clearTimeout(resetId);
    }

    const intervalId = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= lines.length) {
          clearInterval(intervalId);
          return prev;
        }
        return prev + 1;
      });
    }, 620);

    return () => {
      clearTimeout(resetId);
      clearInterval(intervalId);
    };
  }, [lines, nodeId, shouldReduceMotion]);

  const hasCompletedLines = visibleCount >= lines.length;

  return (
    <div className="space-y-2 text-primary/90">
      {lines.slice(0, visibleCount).map((line, index) => (
        <p key={`${nodeId}-line-${index}`} className={line ? '' : 'h-2'}>
          {line || '\u00A0'}
        </p>
      ))}

      {!hasCompletedLines ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
          <span>Decrypting narrative</span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </div>
      ) : null}

      {hasCompletedLines && choices.length > 0 ? (
        <div className="pt-2">
          <p className="text-accent font-semibold">&gt; CHOICE:</p>
          <div className="space-y-1.5">
            {choices.map((choice, index) => (
              <p key={`${nodeId}-choice-${choice.label}`}>
                [{index + 1}] {choice.label}
              </p>
            ))}
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Enter a choice number or type `exit`.
          </p>
        </div>
      ) : null}
    </div>
  );
};

const DelayedLineFeed = ({
  feedId,
  lines,
  shouldReduceMotion,
  stepMs = 320,
  loadingLabel = 'Streaming...',
}: {
  feedId: string;
  lines: React.ReactNode[];
  shouldReduceMotion: boolean;
  stepMs?: number;
  loadingLabel?: string;
}) => {
  const [visibleCount, setVisibleCount] = useState(shouldReduceMotion ? lines.length : 1);

  useEffect(() => {
    if (shouldReduceMotion) {
      const immediateId = setTimeout(() => setVisibleCount(lines.length), 0);
      return () => clearTimeout(immediateId);
    }

    if (lines.length === 0) {
      const emptyId = setTimeout(() => setVisibleCount(0), 0);
      return () => clearTimeout(emptyId);
    }

    const resetId = setTimeout(() => setVisibleCount(1), 0);
    if (lines.length <= 1) {
      return () => clearTimeout(resetId);
    }

    const intervalId = setInterval(() => {
      setVisibleCount((previous) => {
        if (previous >= lines.length) {
          clearInterval(intervalId);
          return previous;
        }
        return previous + 1;
      });
    }, stepMs);

    return () => {
      clearTimeout(resetId);
      clearInterval(intervalId);
    };
  }, [feedId, lines, shouldReduceMotion, stepMs]);

  const isComplete = visibleCount >= lines.length;

  return (
    <div className="space-y-1.5">
      {lines.slice(0, visibleCount).map((line, index) => (
        <div key={`${feedId}-line-${index}`}>{line}</div>
      ))}
      {!isComplete ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{loadingLabel}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        </div>
      ) : null}
    </div>
  );
};

const TerminalMarkdown = ({ content }: { content: string }) => {
  return (
    <div className="space-y-3 text-foreground">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc pl-5 space-y-1 text-foreground/95">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 space-y-1 text-foreground/95">{children}</ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => (
            <strong className="text-primary font-semibold">{children}</strong>
          ),
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

const SnakePanel = ({
  snakeState,
  bestScore,
}: {
  snakeState: SnakeState;
  bestScore: number;
}) => {
  const bodySet = useMemo(
    () => new Set(snakeState.snake.map((segment) => `${segment.x}:${segment.y}`)),
    [snakeState.snake]
  );
  const head = snakeState.snake[0];

  return (
    <div className="rounded-xl border border-primary/30 bg-black/35 p-4 shadow-[inset_0_0_30px_color-mix(in_oklab,var(--primary)_15%,transparent)]">
      <div className="mb-3 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.16em] text-primary/90">
        <span>Snake // Matrix Arcade</span>
        <span className="text-muted-foreground">Score: {snakeState.score}</span>
        <span className="text-muted-foreground">Best: {bestScore}</span>
        <span className="text-muted-foreground">Type `re` to restart, `exit` to leave</span>
      </div>
      <div
        className="grid w-fit gap-[2px] rounded-md border border-primary/20 bg-black/70 p-2"
        style={{ gridTemplateColumns: `repeat(${SNAKE_GRID_SIZE}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: SNAKE_GRID_SIZE * SNAKE_GRID_SIZE }).map((_, index) => {
          const x = index % SNAKE_GRID_SIZE;
          const y = Math.floor(index / SNAKE_GRID_SIZE);
          const key = `${x}:${y}`;
          const isHead = head && head.x === x && head.y === y;
          const isBody = bodySet.has(key);
          const isFood = snakeState.food.x === x && snakeState.food.y === y;

          return (
            <div
              key={key}
              className={cn(
                'h-3 w-3 rounded-[2px] transition-colors',
                isHead && 'bg-accent shadow-[0_0_8px_var(--accent)]',
                !isHead && isBody && 'bg-primary/90',
                isFood && 'bg-foreground'
              )}
            />
          );
        })}
      </div>
      {snakeState.isGameOver ? (
        <p className="mt-3 text-sm font-semibold text-destructive">
          GAME OVER. Type `re` to restart or `exit` to return.
        </p>
      ) : null}
    </div>
  );
};

export function TerminalSection() {
  const [history, setHistory] = useState<CommandEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>(() =>
    readLocalStorageJson<string[]>('terminal_command_history', [])
  );
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<TerminalMode>('shell');
  const [pendingQuit, setPendingQuit] = useState(false);
  const [contactWizard, setContactWizard] = useState<ContactWizardState>(
    CONTACT_WIZARD_INITIAL
  );
  const [matrixStoryNodeId, setMatrixStoryNodeId] = useState<string>(
    MATRIX_STORY_START
  );
  const [hackOverlayStage, setHackOverlayStage] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [snakeState, setSnakeState] = useState<SnakeState>(createInitialSnakeState);
  const [snakeBestScore, setSnakeBestScore] = useState<number>(() =>
    readLocalStorageJson<number>('terminal_snake_best_score', 0)
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [lastLoginText, setLastLoginText] = useState('--');
  const [initialAiMessages] = useState<UIMessage[]>(() =>
    readLocalStorageJson<UIMessage[]>('terminal_ai_chat_history', [])
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pendingQuitRef = useRef(false);
  const hasRestoredAiMessagesRef = useRef(false);
  const initialCommandHistoryCountRef = useRef(commandHistory.length);
  const initialAiMessageCountRef = useRef(initialAiMessages.length);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const snakeBestScoreRef = useRef(snakeBestScore);
  const reactId = useId();
  const shakeControls = useAnimationControls();

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

  const isAgentMode = mode === 'agent';
  const shouldReduceMotion = settings.appearance.reducedMotion || prefersReducedMotion;
  const systemLabel =
    hasMounted && resolvedTheme === 'dark' ? 'NEON_OS_V3.1' : 'DAYLIGHT_CORE_V2.3';

  useEffect(() => {
    snakeBestScoreRef.current = snakeBestScore;
  }, [snakeBestScore]);

  useEffect(() => {
    setHasMounted(true);
    setLastLoginText(new Date().toLocaleString());
  }, []);

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

  useEffect(() => {
    if (commandHistory.length > 0) {
      localStorage.setItem(
        'terminal_command_history',
        JSON.stringify(commandHistory.slice(-80))
      );
    }
  }, [commandHistory]);

  useEffect(() => {
    localStorage.setItem('terminal_snake_best_score', JSON.stringify(snakeBestScore));
  }, [snakeBestScore]);

  useEffect(() => {
    pendingQuitRef.current = pendingQuit;
  }, [pendingQuit]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
    };
  }, []);

  const scheduleOutput = useCallback((callback: () => void, delay: number) => {
    if (typeof window === 'undefined') {
      return;
    }

    const timeoutId = setTimeout(callback, delay);
    timersRef.current.push(timeoutId);
  }, []);

  const getPromptLabel = useCallback((targetMode: TerminalMode) => {
    if (targetMode === 'agent') return 'agent@portfolio:~$';
    if (targetMode === 'contactWizard') return 'contact@portfolio:wizard$';
    if (targetMode === 'newsCategorySelect') return 'news@portfolio:feed$';
    if (targetMode === 'snakeGame') return 'snake@portfolio:game$';
    if (targetMode === 'matrixStory') return 'matrix@construct:~$';
    return 'visitor@portfolio:~$';
  }, []);

  const appendHistoryEntry = useCallback((entry: CommandEntry) => {
    setHistory((prev) => [...prev, entry]);
  }, []);

  const appendSystemOutput = useCallback(
    (output: React.ReactNode, prompt = 'system@matrix:~$') => {
      appendHistoryEntry({ input: '', output, prompt });
    },
    [appendHistoryEntry]
  );

  const triggerShake = useCallback(async () => {
    if (shouldReduceMotion) {
      return;
    }

    await shakeControls.start({
      x: [0, -10, 10, -8, 8, -4, 4, 0],
      transition: { duration: 0.42, ease: 'easeInOut' },
    });
  }, [shakeControls, shouldReduceMotion]);

  const renderHelp = useCallback(() => {
    const helpFeedId = `help-${Date.now()}`;
    const lines = [
      <p key="help-head" className="text-accent font-semibold">
        AVAILABLE COMMANDS:
      </p>,
      ...PUBLIC_HELP_COMMANDS.map(([name, description]) => (
        <p key={`help-${name}`} className="text-primary/90">
          {name} - {description}
        </p>
      )),
    ];

    return (
      <div className="rounded-lg border border-primary/20 bg-black/25 px-4 py-3">
        <DelayedLineFeed
          feedId={helpFeedId}
          lines={lines}
          shouldReduceMotion={shouldReduceMotion}
          stepMs={220}
          loadingLabel="Indexing command registry..."
        />
      </div>
    );
  }, [shouldReduceMotion]);

  const renderNewsCategoryMenu = useCallback(() => {
    const newsFeedId = `news-menu-${Date.now()}`;
    const lines = [
      <p key="news-head" className="font-semibold text-accent">
        NEWS CATEGORY SELECTION
      </p>,
      ...NEWS_CATEGORIES.map((category) => (
        <p key={`news-category-${category.id}`} className="text-primary/90">
          [{category.id}] {category.icon} {category.title} - {category.description}
        </p>
      )),
      <p key="news-foot" className="text-sm text-muted-foreground">
        Select a category (1-9) or type `exit`.
      </p>,
    ];

    return (
      <div className="space-y-2">
        <DelayedLineFeed
          feedId={newsFeedId}
          lines={lines}
          shouldReduceMotion={shouldReduceMotion}
          stepMs={200}
          loadingLabel="Syncing newsroom channels..."
        />
      </div>
    );
  }, [shouldReduceMotion]);

  const renderMatrixStoryNode = useCallback((nodeId: string) => {
    const node = MATRIX_STORY_NODES[nodeId] ?? MATRIX_STORY_NODES[MATRIX_STORY_START];

    return (
      <DelayedStoryOutput
        nodeId={nodeId}
        lines={node.lines}
        choices={node.choices}
        shouldReduceMotion={shouldReduceMotion}
      />
    );
  }, [shouldReduceMotion]);

  const requestBrowserCoordinates = useCallback(async () => {
    if (typeof window === 'undefined') {
      return { coordinates: null, reason: 'unsupported' as const };
    }

    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (!window.isSecureContext && !isLocalhost) {
      return { coordinates: null, reason: 'insecure_context' as const };
    }

    if (!navigator.geolocation) {
      return { coordinates: null, reason: 'unsupported' as const };
    }

    return new Promise<BrowserCoordinatesResult>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            coordinates: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          });
        },
        (error) => {
          const reason: GeolocationFailureReason =
            error.code === error.PERMISSION_DENIED
              ? 'permission_denied'
              : error.code === error.POSITION_UNAVAILABLE
                ? 'position_unavailable'
                : error.code === error.TIMEOUT
                  ? 'timeout'
                  : 'unknown';
          clientLogger.warn('Browser geolocation failed; fallback to location search', {
            message: error.message,
            reason,
          });
          resolve({ coordinates: null, reason });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  const handleMatrixStoryInput = useCallback(
    (rawInput: string) => {
      const value = rawInput.trim().toLowerCase();
      if (!value) {
        return (
          <span className="text-warning">
            Select a choice number or type `exit`.
          </span>
        );
      }

      if (value === 'exit') {
        setMode('shell');
        setMatrixStoryNodeId(MATRIX_STORY_START);
        return <span className="text-warning">Matrix session terminated. Returning to shell.</span>;
      }

      if (value === 're') {
        setMatrixStoryNodeId(MATRIX_STORY_START);
        return renderMatrixStoryNode(MATRIX_STORY_START);
      }

      const node = MATRIX_STORY_NODES[matrixStoryNodeId];
      if (!node) {
        setMatrixStoryNodeId(MATRIX_STORY_START);
        return renderMatrixStoryNode(MATRIX_STORY_START);
      }

      const selectedIndex = Number.parseInt(value, 10) - 1;
      if (Number.isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= node.choices.length) {
        return (
          <span className="text-destructive">
            Invalid choice. Enter a number between 1 and {node.choices.length}.
          </span>
        );
      }

      const next = node.choices[selectedIndex]?.next || MATRIX_STORY_START;
      if (next === MATRIX_STORY_SHELL) {
        setMode('shell');
        setMatrixStoryNodeId(MATRIX_STORY_START);
        return <span className="text-primary/90">Standard mode activated. Type `help` for commands.</span>;
      }

      if (next === MATRIX_STORY_RESTART) {
        setMatrixStoryNodeId(MATRIX_STORY_START);
        return renderMatrixStoryNode(MATRIX_STORY_START);
      }

      setMatrixStoryNodeId(next);
      return renderMatrixStoryNode(next);
    },
    [matrixStoryNodeId, renderMatrixStoryNode]
  );

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
        setMode('shell');
        appendHistoryEntry({
          input: 'quit',
          prompt: 'agent@portfolio:~$',
          output: <span className="text-warning">Exited Agent Mode.</span>,
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
    isLoading &&
    (latestMessage?.role !== 'assistant' || latestAssistantText.trim().length === 0);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('terminal_ai_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (hasRestoredAiMessagesRef.current) {
      return;
    }

    if (initialAiMessages.length > 0 && messages.length === 0) {
      setMessages(initialAiMessages);
    }

    hasRestoredAiMessagesRef.current = true;
  }, [initialAiMessages, messages.length, setMessages]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [history, messages, mode, snakeState.tick]);

  useEffect(() => {
    if (mode !== 'snakeGame' || typeof window === 'undefined') {
      return;
    }

    const tickMs = shouldReduceMotion ? 170 : 120;
    const intervalId = window.setInterval(() => {
      setSnakeState((prev) => {
        if (prev.isGameOver) {
          return prev;
        }

        const nextHead: SnakePoint = {
          x: prev.snake[0].x + prev.nextDirection.x,
          y: prev.snake[0].y + prev.nextDirection.y,
        };

        const hitWall =
          nextHead.x < 0 ||
          nextHead.y < 0 ||
          nextHead.x >= SNAKE_GRID_SIZE ||
          nextHead.y >= SNAKE_GRID_SIZE;
        const hitSelf = prev.snake.some((segment) => pointsEqual(segment, nextHead));

        if (hitWall || hitSelf) {
          return { ...prev, isGameOver: true, tick: prev.tick + 1 };
        }

        const ateFood = pointsEqual(nextHead, prev.food);
        const nextSnake = [nextHead, ...prev.snake];
        if (!ateFood) {
          nextSnake.pop();
        }

        const nextScore = ateFood ? prev.score + 1 : prev.score;
        if (nextScore > snakeBestScoreRef.current) {
          snakeBestScoreRef.current = nextScore;
          setSnakeBestScore(nextScore);
        }

        return {
          snake: nextSnake,
          direction: prev.nextDirection,
          nextDirection: prev.nextDirection,
          food: ateFood ? randomFood(nextSnake) : prev.food,
          score: nextScore,
          isGameOver: false,
          tick: prev.tick + 1,
        };
      });
    }, tickMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [mode, shouldReduceMotion]);

  useEffect(() => {
    if (mode !== 'snakeGame' || typeof window === 'undefined') {
      return;
    }

    const keyMap: Record<string, SnakePoint> = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 },
      s: { x: 0, y: 1 },
      a: { x: -1, y: 0 },
      d: { x: 1, y: 0 },
      W: { x: 0, y: -1 },
      S: { x: 0, y: 1 },
      A: { x: -1, y: 0 },
      D: { x: 1, y: 0 },
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMode('shell');
        appendSystemOutput(
          <span className="text-warning">Exited snake game mode.</span>,
          'snake@portfolio:game$'
        );
        return;
      }

      const mapped = keyMap[event.key];
      if (!mapped) {
        return;
      }

      event.preventDefault();
      setSnakeState((prev) => {
        if (isOppositeDirection(mapped, prev.direction)) {
          return prev;
        }

        return { ...prev, nextDirection: mapped };
      });
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [appendSystemOutput, mode]);

  const handleContactWizardInput = useCallback(
    async (rawInput: string) => {
      const value = rawInput.trim();
      const lowerValue = value.toLowerCase();

      if (!value) {
        return (
          <span className="text-warning">
            Input required. Type a value or `exit` to cancel the wizard.
          </span>
        );
      }

      if (lowerValue === 'exit' || lowerValue === 'cancel') {
        setMode('shell');
        setContactWizard(CONTACT_WIZARD_INITIAL);
        return <span className="text-warning">Contact wizard closed.</span>;
      }

      if (contactWizard.step === 'name') {
        if (value.length < 2) {
          return <span className="text-destructive">Name must be at least 2 characters.</span>;
        }

        setContactWizard((prev) => ({
          ...prev,
          step: 'email',
          draft: { ...prev.draft, name: value },
        }));

        return (
          <div className="text-primary/90 space-y-1">
            <p>Identity captured: {value}</p>
            <p>Enter your email:</p>
          </div>
        );
      }

      if (contactWizard.step === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return <span className="text-destructive">Invalid email format.</span>;
        }

        setContactWizard((prev) => ({
          ...prev,
          step: 'message',
          draft: { ...prev.draft, email: value },
        }));

        return (
          <div className="text-primary/90 space-y-1">
            <p>Encrypted email accepted.</p>
            <p>Enter your message (min 10 chars):</p>
          </div>
        );
      }

      if (contactWizard.step === 'message') {
        if (value.length < 10) {
          return (
            <span className="text-destructive">
              Message must be at least 10 characters.
            </span>
          );
        }

        setContactWizard((prev) => ({
          ...prev,
          step: 'confirm',
          draft: { ...prev.draft, message: value },
        }));

        return (
          <div className="space-y-2 text-primary/90">
            <p>Message payload staged.</p>
            <p className="text-muted-foreground">
              Type `send` to transmit or `cancel` to abort.
            </p>
          </div>
        );
      }

      if (contactWizard.step === 'confirm') {
        if (lowerValue === 'send') {
          try {
            const response = await fetch('/api/terminal/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(contactWizard.draft),
            });

            const payload = (await response.json()) as ContactApiResponse;
            setMode('shell');
            setContactWizard(CONTACT_WIZARD_INITIAL);

            if (!response.ok || !payload.success) {
              return (
                <span className="text-destructive">
                  Transmission failed: {payload.error || 'Unknown server error'}
                </span>
              );
            }

            return (
              <div className="space-y-1 text-primary/90">
                <p className="text-primary font-semibold">Transmission complete.</p>
                <p>
                  Message from <span className="text-accent">{contactWizard.draft.name}</span>{' '}
                  saved successfully.
                </p>
              </div>
            );
          } catch (error) {
            clientLogger.error('Terminal contact command failed', error, {
              terminalSessionId,
            });
            setMode('shell');
            setContactWizard(CONTACT_WIZARD_INITIAL);
            return (
              <span className="text-destructive">
                Contact gateway unreachable. Try again shortly.
              </span>
            );
          }
        }

        return (
          <span className="text-warning">
            Invalid confirmation. Type `send` or `cancel`.
          </span>
        );
      }

      return <span className="text-destructive">Contact wizard state invalid.</span>;
    },
    [contactWizard, terminalSessionId]
  );

  const handleNewsCategoryInput = useCallback(
    async (rawInput: string) => {
      const value = rawInput.trim().toLowerCase();
      if (!value) {
        return (
          <span className="text-warning">
            Select a category (1-9) or type `exit`.
          </span>
        );
      }

      if (value === 'exit') {
        setMode('shell');
        return <span className="text-warning">Exited news category selection.</span>;
      }

      const category = Number(value);
      if (!Number.isInteger(category) || category < 1 || category > 9) {
        return (
          <span className="text-destructive">
            Invalid category. Enter a number between 1 and 9.
          </span>
        );
      }

      try {
        const response = await fetch(`/api/terminal/news?category=${category}&limit=5`, {
          method: 'GET',
          cache: 'no-store',
        });
        const payload = (await response.json()) as NewsApiResponse;

        if (!response.ok || !payload.success || !payload.articles) {
          return (
            <span className="text-destructive">
              News feed unavailable: {payload.error || 'Unknown error'}
            </span>
          );
        }

        return (
          <div className="space-y-3 text-primary/90">
            <p className="text-accent font-semibold">
              ACCESSING NEWS FEED: {payload.categoryLabel || 'Unknown'}
            </p>
            <div className="space-y-2">
              {payload.articles.map((article, index) => (
                <div key={`${article.link}-${index}`} className="rounded-md border border-primary/20 p-2">
                  <p className="font-semibold text-primary">
                    {index + 1}. {article.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimestamp(article.publishedAt)} | {article.source}
                  </p>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline underline-offset-2 break-all"
                  >
                    {article.link}
                  </a>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Type another category number or `exit`.
            </p>
          </div>
        );
      } catch (error) {
        clientLogger.error('Terminal news command failed', error, { terminalSessionId });
        return <span className="text-destructive">News uplink failed. Please retry.</span>;
      }
    },
    [terminalSessionId]
  );

  const commandDefinitions = useMemo<TerminalCommandDefinition[]>(() => {
    return [
      {
        name: 'help',
        description: 'Show command list',
        handler: () => renderHelp(),
      },
      {
        name: 'agent',
        aliases: ['ai'],
        description: 'Initialize AI Assistant',
        handler: () => {
          setMode('agent');
          setPendingQuit(false);
          pendingQuitRef.current = false;
          return (
            <div className="space-y-1 text-primary">
              <p>Agent link established. Secure relay online.</p>
              <p className="text-xs text-muted-foreground">
                Type `quit` to return to shell.
              </p>
            </div>
          );
        },
      },
      {
        name: 'contact',
        description: 'Send contact message',
        handler: () => {
          setMode('contactWizard');
          setContactWizard(CONTACT_WIZARD_INITIAL);
          return (
            <div className="space-y-1 text-primary/90">
              <p className="text-accent font-semibold">CONTACT WIZARD BOOTED</p>
              <p>Step 1/4: Enter your name.</p>
              <p className="text-xs text-muted-foreground">Type `exit` to cancel.</p>
            </div>
          );
        },
      },
      {
        name: 'clear',
        description: 'Clear terminal',
        handler: () => {
          setHistory([]);
          setMessages([]);
          localStorage.removeItem('terminal_ai_chat_history');
          setMode('shell');
          setMatrixStoryNodeId(MATRIX_STORY_START);
          setHackOverlayStage(0);
          return CLEAR_TERMINAL;
        },
      },
      {
        name: 'snake',
        description: 'Play Snake game',
        handler: () => {
          setSnakeState(createInitialSnakeState());
          setMode('snakeGame');
          return (
            <div className="space-y-1 text-primary/90">
              <p className="text-accent font-semibold">SNAKE ARCADE ONLINE</p>
              <p>Use arrow keys or WASD to move.</p>
              <p className="text-xs text-muted-foreground">
                Type `re` to restart, or `exit` / `Esc` to leave game mode.
              </p>
            </div>
          );
        },
      },
      {
        name: 'matrix',
        description: 'Enter the Matrix',
        handler: () => {
          setMode('matrixStory');
          setMatrixStoryNodeId(MATRIX_STORY_START);
          return renderMatrixStoryNode(MATRIX_STORY_START);
        },
      },
      {
        name: 'hack',
        description: 'Initiate system override',
        handler: () => {
          setHackOverlayStage(1);
          scheduleOutput(() => setHackOverlayStage(2), 260);
          scheduleOutput(() => setHackOverlayStage(3), 1200);
          scheduleOutput(() => setHackOverlayStage(4), 2200);
          scheduleOutput(() => setHackOverlayStage(0), 5200);

          scheduleOutput(
            () =>
              appendSystemOutput(
                <p className="text-red-500">&gt; BREACH SIGNAL DETECTED // escalating privileges...</p>,
                'hack@ops:~$'
              ),
            180
          );
          scheduleOutput(
            () =>
              appendSystemOutput(
                <p className="text-red-500">&gt; ROOT VECTOR INJECTION :: ACTIVE</p>,
                'hack@ops:~$'
              ),
            700
          );
          scheduleOutput(
            () =>
              appendSystemOutput(
                <p className="text-red-400">&gt; CRITICAL THREAT LEVEL: OMEGA // containment failing...</p>,
                'hack@ops:~$'
              ),
            1300
          );
          scheduleOutput(
            () =>
              appendSystemOutput(
                <p className="text-accent">SYSTEM_RECOVERY_COMPLETE... [OK]</p>,
                'hack@ops:~$'
              ),
            2200
          );
          scheduleOutput(
            () =>
              appendSystemOutput(
                <p className="text-primary/90">False alarm. Dramatic simulation complete.</p>,
                'hack@ops:~$'
              ),
            2750
          );

          return (
            <DelayedLineFeed
              feedId={`hack-seq-${Date.now()}`}
              lines={[
                <p key="hack-1" className="text-red-400">
                  INITIATING SYSTEM OVERRIDE...
                </p>,
                <p key="hack-2" className="text-red-300">
                  Scanning exposed ports and escalating privileges.
                </p>,
                <p key="hack-3" className="text-red-300">
                  Brace for impact.
                </p>,
              ]}
              shouldReduceMotion={shouldReduceMotion}
              stepMs={260}
              loadingLabel="Injecting exploit payload..."
            />
          );
        },
      },
      {
        name: 'coffee',
        description: 'Brew coffee',
        handler: () => {
          const roast = ['dark roast', 'neon roast', 'zero-day espresso', 'quantum arabica'];
          const selected = roast[Math.floor(Math.random() * roast.length)];

          scheduleOutput(
            () =>
              appendSystemOutput(
                <p className="text-primary/90">&gt; grinding beans...</p>,
                'brew@cafe:~$'
              ),
            180
          );
          scheduleOutput(
            () =>
              appendSystemOutput(
                <p className="text-primary/90">&gt; pulling shot...</p>,
                'brew@cafe:~$'
              ),
            540
          );
          scheduleOutput(
            () =>
              appendSystemOutput(
                <p className="text-accent">Coffee ready: {selected}.</p>,
                'brew@cafe:~$'
              ),
            920
          );

          return (
            <div className="space-y-1 text-primary/90">
              <p>Brewing cyber-caffeine...</p>
              <pre className="text-accent">{String.raw`   ( (
    ) )
  ........
  |      |]
  \      /
   \____/`}</pre>
            </div>
          );
        },
      },
      {
        name: 'weather',
        description: 'Check system weather',
        supportsArgs: true,
        handler: async (parsed) => {
          const location = parsed.args.length > 0 ? parsed.args.join(' ').trim() : '';
          const geolocationResult =
            location.length === 0 ? await requestBrowserCoordinates() : null;
          const coordinates = geolocationResult?.coordinates ?? null;
          const geolocationReason = geolocationResult?.reason;
          const weatherEndpoints = coordinates
            ? [
                `/api/terminal/weather?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`,
                `/api/terminal/weather?location=${encodeURIComponent('New York')}`,
              ]
            : [`/api/terminal/weather?location=${encodeURIComponent(location || 'New York')}`];

          try {
            let payload: WeatherApiResponse | null = null;
            let hasValidPayload = false;
            let usedFallbackEndpoint = false;

            for (let index = 0; index < weatherEndpoints.length; index += 1) {
              const endpoint = weatherEndpoints[index];
              const response = await fetch(endpoint, { method: 'GET', cache: 'no-store' });
              const nextPayload = (await response.json()) as WeatherApiResponse;
              payload = nextPayload;

              if (response.ok && nextPayload.success && nextPayload.weather) {
                hasValidPayload = true;
                usedFallbackEndpoint = index > 0;
                break;
              }
            }

            if (!hasValidPayload || !payload || !payload.weather) {
              return (
                <span className="text-destructive">
                  Weather feed unavailable: {payload?.error || 'Unknown error'}
                </span>
              );
            }

            const weather = payload.weather;
            const place = weather.location;
            const lines: React.ReactNode[] = [
              <p key="weather-head" className="text-accent font-semibold">
                SYSTEM WEATHER :: {place}
              </p>,
              <p key="weather-main">
                {weather.condition} | {weather.temperatureC} deg C (feels like {weather.feelsLikeC} deg C)
              </p>,
              <p key="weather-meta" className="text-muted-foreground">
                Wind: {weather.windKmph} km/h | Humidity: {weather.humidity}%
              </p>,
            ];

            if (
              typeof weather.latitude === 'number' &&
              typeof weather.longitude === 'number'
            ) {
              lines.push(
                <p key="weather-coords" className="text-xs text-muted-foreground">
                  Coordinates: {weather.latitude.toFixed(4)}, {weather.longitude.toFixed(4)}
                  {weather.timezone ? ` | TZ: ${weather.timezone}` : ''}
                </p>
              );
            }

            if (location.length === 0) {
              if (coordinates) {
                lines.push(
                  <p key="weather-source" className="text-xs text-primary/80">
                    Source: Browser Geolocation API (permission granted)
                  </p>
                );
              } else {
                lines.push(
                  <p key="weather-fallback" className="text-xs text-warning">
                    {getGeolocationFailureMessage(geolocationReason)}
                  </p>
                );
              }
            }

            if (usedFallbackEndpoint) {
              lines.push(
                <p key="weather-fallback-2" className="text-xs text-warning">
                  Live coordinate weather failed temporarily. Fallback city report loaded.
                </p>
              );
            }

            return (
              <DelayedLineFeed
                feedId={`weather-${Date.now()}`}
                lines={lines}
                shouldReduceMotion={shouldReduceMotion}
                stepMs={220}
                loadingLabel="Decoding atmospheric telemetry..."
              />
            );
          } catch (error) {
            clientLogger.error('Terminal weather command failed', error, {
              terminalSessionId,
            });
            return <span className="text-destructive">Weather uplink failed. Try again.</span>;
          }
        },
      },
      {
        name: 'joke',
        description: 'Tell a joke',
        handler: async () => {
          try {
            const response = await fetch('/api/terminal/joke', {
              method: 'GET',
              cache: 'no-store',
            });
            const payload = (await response.json()) as JokeApiResponse;

            if (!response.ok || !payload.success || !payload.joke) {
              return (
                <span className="text-destructive">
                  Joke service unavailable: {payload.error || 'Unknown error'}
                </span>
              );
            }

            return (
              <div className="space-y-1 text-primary/90">
                <p>{payload.joke.setup}</p>
                <p className="text-accent">{payload.joke.punchline}</p>
              </div>
            );
          } catch (error) {
            clientLogger.error('Terminal joke command failed', error, { terminalSessionId });
            return (
              <span className="text-destructive">Humor module crashed. Retry later.</span>
            );
          }
        },
      },
      {
        name: 'news',
        description: 'Get latest news articles',
        handler: () => {
          setMode('newsCategorySelect');
          return renderNewsCategoryMenu();
        },
      },
      {
        name: 'about',
        description: 'Legacy about command',
        hidden: true,
        handler: () => (
          <div className="text-foreground/90">
            <p className="text-primary font-bold mb-1">
              {getStableMessage(CYBERPUNK_MESSAGES.headers.about, 'about')}
            </p>
            <p className="leading-relaxed">
              {heroData.description || aiKnowledge.profile.bio}
            </p>
          </div>
        ),
      },
      {
        name: 'projects',
        description: 'Legacy projects command',
        hidden: true,
        handler: () => (
          <div className="text-foreground/90">
            <p className="text-primary font-bold mb-2">
              {getStableMessage(CYBERPUNK_MESSAGES.headers.projects, 'projects')}
            </p>
            {projects.length > 0 ? (
              <ul className="space-y-2">
                {projects.slice(0, 5).map((project) => (
                  <li key={project.id} className="flex flex-col">
                    <span className="font-bold text-primary">- {project.title}</span>
                    <span className="text-sm text-muted-foreground pl-4">
                      {project.description.substring(0, 60)}...
                    </span>
                  </li>
                ))}
                {projects.length > 5 ? (
                  <li className="text-muted-foreground italic">
                    ...and {projects.length - 5} more
                  </li>
                ) : null}
              </ul>
            ) : (
              <p>No projects found in the database.</p>
            )}
          </div>
        ),
      },
      {
        name: 'skills',
        description: 'Legacy skills command',
        hidden: true,
        handler: () => (
          <div className="text-foreground/90">
            <p className="text-primary font-bold mb-2">
              {getStableMessage(CYBERPUNK_MESSAGES.headers.skills, 'skills')}
            </p>
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 30).map((skill) => (
                  <span
                    key={skill.id}
                    className="px-2 py-1 rounded bg-primary/10 text-primary text-sm border border-primary/20"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {aiKnowledge.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="px-2 py-1 rounded bg-primary/10 text-primary text-sm border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        ),
      },
      {
        name: 'whoami',
        description: 'Runtime profile summary',
        hidden: true,
        handler: () => (
          <div className="space-y-1 text-primary/90">
            <p>
              User: <span className="text-accent">{heroData.name || aiKnowledge.profile.name}</span>
            </p>
            <p>
              Role:{' '}
              <span className="text-muted-foreground">
                {heroData.title || aiKnowledge.profile.role}
              </span>
            </p>
            <p>
              Theme: <span className="text-muted-foreground">{resolvedTheme || 'system'}</span>
            </p>
          </div>
        ),
      },
      {
        name: 'ping',
        description: 'Health check',
        hidden: true,
        handler: async () => {
          try {
            const response = await fetch('/api/health', { method: 'GET', cache: 'no-store' });
            if (!response.ok) {
              return (
                <span className="text-destructive">
                  health endpoint returned {response.status}
                </span>
              );
            }
            return <span className="text-primary/90">pong :: system healthy</span>;
          } catch (error) {
            clientLogger.error('Terminal ping command failed', error, { terminalSessionId });
            return <span className="text-destructive">health endpoint unreachable</span>;
          }
        },
      },
    ];
  }, [
    appendSystemOutput,
    heroData.description,
    heroData.name,
    heroData.title,
    projects,
    renderHelp,
    renderMatrixStoryNode,
    renderNewsCategoryMenu,
    requestBrowserCoordinates,
    resolvedTheme,
    scheduleOutput,
    setMessages,
    shouldReduceMotion,
    skills,
    terminalSessionId,
  ]);

  const commandMap = useMemo(() => {
    const map = new Map<string, TerminalCommandDefinition>();

    for (const command of commandDefinitions) {
      map.set(command.name, command);
      command.aliases?.forEach((alias) => map.set(alias, command));
    }

    return map;
  }, [commandDefinitions]);

  const handleCommand = useCallback(
    async (rawCommand: string) => {
      const trimmedCmd = rawCommand.trim();
      if (!trimmedCmd) return;

      const promptAtExecution = getPromptLabel(mode);
      const lowerCmd = trimmedCmd.toLowerCase();

      clientLogger.info('Terminal command received', {
        terminalSessionId,
        mode,
        commandPreview: truncateForLog(trimmedCmd),
      });

      setCommandHistory((prev) => [...prev, trimmedCmd]);
      setHistoryIndex(-1);

      if (mode === 'agent') {
        if (lowerCmd === 'quit') {
          if (isLoading) {
            setPendingQuit(true);
            pendingQuitRef.current = true;
            appendHistoryEntry({
              input: rawCommand,
              prompt: promptAtExecution,
              output: (
                <span className="text-warning">
                  Agent response in progress. Quit queued.
                </span>
              ),
            });
            return;
          }

          setPendingQuit(false);
          pendingQuitRef.current = false;
          setMode('shell');
          appendHistoryEntry({
            input: rawCommand,
            prompt: promptAtExecution,
            output: <span className="text-warning">Exited Agent Mode.</span>,
          });
          return;
        }

        if (lowerCmd === 'clear') {
          setHistory([]);
          setMessages([]);
          localStorage.removeItem('terminal_ai_chat_history');
          return;
        }

        if (pendingQuitRef.current) {
          appendHistoryEntry({
            input: rawCommand,
            prompt: promptAtExecution,
            output: (
              <span className="text-warning">
                Quit already queued. Waiting for response to finish.
              </span>
            ),
          });
          return;
        }

        try {
          await sendMessage({ text: trimmedCmd });
        } catch (error) {
          clientLogger.error('Failed to send message to AI', error, { terminalSessionId });
          appendHistoryEntry({
            input: rawCommand,
            prompt: promptAtExecution,
            output: (
              <span className="text-destructive">
                Failed to send message to agent backend.
              </span>
            ),
          });
        }
        return;
      }

      if (mode === 'contactWizard') {
        const output = await handleContactWizardInput(trimmedCmd);
        appendHistoryEntry({ input: rawCommand, prompt: promptAtExecution, output });
        return;
      }

      if (mode === 'newsCategorySelect') {
        const output = await handleNewsCategoryInput(trimmedCmd);
        appendHistoryEntry({ input: rawCommand, prompt: promptAtExecution, output });
        return;
      }

      if (mode === 'matrixStory') {
        const output = handleMatrixStoryInput(trimmedCmd);
        appendHistoryEntry({ input: rawCommand, prompt: promptAtExecution, output });
        return;
      }

      if (mode === 'snakeGame') {
        if (lowerCmd === 'exit') {
          setMode('shell');
          appendHistoryEntry({
            input: rawCommand,
            prompt: promptAtExecution,
            output: <span className="text-warning">Exited snake game mode.</span>,
          });
          return;
        }

        if (lowerCmd === 're') {
          setSnakeState(createInitialSnakeState());
          appendHistoryEntry({
            input: rawCommand,
            prompt: promptAtExecution,
            output: <span className="text-primary/90">Snake game restarted.</span>,
          });
          return;
        }

        appendHistoryEntry({
          input: rawCommand,
          prompt: promptAtExecution,
          output: (
            <span className="text-warning">
              Snake mode active. Use controls, `re`, or type `exit`.
            </span>
          ),
        });
        return;
      }

      const parsed = parseCommandInput(trimmedCmd);
      const commandDefinition = commandMap.get(parsed.base);

      if (!commandDefinition) {
        await triggerShake();
        appendHistoryEntry({
          input: rawCommand,
          prompt: promptAtExecution,
          output: (
            <span className="text-destructive">
              Command not found: {parsed.base}. Type `help` for available commands.
            </span>
          ),
        });
        return;
      }

      const output = await commandDefinition.handler(parsed);
      if (output === CLEAR_TERMINAL) {
        return;
      }

      if (output !== null) {
        appendHistoryEntry({ input: rawCommand, prompt: promptAtExecution, output });
      }
    },
    [
      appendHistoryEntry,
      commandMap,
      getPromptLabel,
      handleContactWizardInput,
      handleMatrixStoryInput,
      handleNewsCategoryInput,
      isLoading,
      mode,
      sendMessage,
      setMessages,
      terminalSessionId,
      triggerShake,
    ]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    const command = input;
    setInput('');
    await handleCommand(command);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const canUseHistory = mode === 'shell' || mode === 'agent';
    if (!canUseHistory) {
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
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

  const promptLabel = getPromptLabel(mode);

  return (
    <section className="w-full py-20 bg-background relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, color-mix(in oklab, var(--foreground) 16%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 16%, transparent) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <div className="mb-8 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-primary mb-2 glitch-text"
            data-text="TERMINAL_ACCESS"
          >
            TERMINAL_ACCESS
          </h2>
          <p className="text-muted-foreground text-sm">
            {getStableMessage(CYBERPUNK_MESSAGES.prompts, 'prompts')}
          </p>
        </div>

        <motion.div
          animate={shakeControls}
          className="relative bg-card/85 dark:bg-black/80 border border-primary/30 rounded-lg p-6 min-h-[440px] max-h-[700px] overflow-y-auto shadow-[0_0_30px_color-mix(in_oklab,var(--primary)_22%,transparent)] backdrop-blur-sm scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent font-mono text-sm md:text-base"
          onClick={() => inputRef.current?.focus()}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-lg opacity-30"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, color-mix(in oklab, var(--primary) 12%, transparent) 0px, color-mix(in oklab, var(--primary) 12%, transparent) 1px, transparent 1px, transparent 3px)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-lg"
            style={{
              boxShadow:
                'inset 0 0 28px color-mix(in oklab, var(--primary) 14%, transparent)',
            }}
          />
          {hackOverlayStage > 0 ? (
            <div className="pointer-events-none absolute inset-0 z-20 rounded-lg">
              <div className="absolute inset-0 rounded-lg bg-red-950/20 animate-pulse" />
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background:
                    'repeating-linear-gradient(0deg, rgba(248,113,113,0.12) 0px, rgba(248,113,113,0.12) 2px, transparent 2px, transparent 6px)',
                }}
              />
              <div className="absolute left-4 top-4 rounded-md border border-red-500/80 bg-black/90 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-red-400 shadow-[0_0_24px_rgba(239,68,68,0.45)]">
                THREAT MATRIX: CRITICAL
              </div>
              <div className="absolute top-4 right-4 max-w-[290px] rounded-md border border-red-500/80 bg-black/95 shadow-[0_0_28px_rgba(239,68,68,0.6)]">
                <div className="flex items-center justify-between border-b border-red-500/70 px-3 py-2 text-xs uppercase tracking-[0.16em] text-red-400">
                  <span>Danger Signal</span>
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                </div>
                <div className="px-3 py-2 text-xs text-red-200 space-y-1.5">
                  <p>Stage {hackOverlayStage}/4</p>
                  {hackOverlayStage >= 1 ? <p>Unauthorized ingress detected.</p> : null}
                  {hackOverlayStage >= 2 ? <p>Root daemon responding with hostile packets.</p> : null}
                  {hackOverlayStage >= 3 ? <p>Containment breach imminent.</p> : null}
                  {hackOverlayStage >= 4 ? (
                    <p className="text-red-400">Emergency lockdown engaged. Purging volatile buffers.</p>
                  ) : null}
                </div>
              </div>
              <div className="absolute bottom-6 left-6 rounded-md border border-red-500/80 bg-black/90 px-3 py-2 text-xs uppercase tracking-[0.16em] text-red-400 shadow-[0_0_20px_rgba(220,38,38,0.45)]">
                [ALERT] INTRUSION_SIMULATION_ACTIVE
              </div>
              <div className="absolute bottom-6 right-6 rounded-md border border-red-600/80 bg-black/90 px-3 py-2 text-xs text-red-300 shadow-[0_0_20px_rgba(185,28,28,0.45)]">
                <p className="uppercase tracking-[0.16em] text-red-400">BUFFER_OVERFLOW</p>
                <p>Process terminated unexpectedly.</p>
              </div>
              <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/70 shadow-[0_0_24px_rgba(239,68,68,0.8)] animate-ping" />
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-300" />
              <div className="absolute inset-x-6 top-1/3 rounded border border-red-500/60 bg-black/80 px-3 py-2 text-xs uppercase tracking-[0.16em] text-red-300 animate-pulse">
                SYSTEM OVERRIDE IN PROGRESS...
              </div>
            </div>
          ) : null}
          <div className="relative space-y-4">
            <div className="text-muted-foreground text-xs md:text-sm mb-4 border-b border-primary/10 pb-2">
              Last login: {hasMounted ? lastLoginText : '--'} on ttys000
              <br />
              System: {systemLabel}
              <br />
              Type <span className="text-primary font-bold">`help`</span> to see available commands.
            </div>

            {history.map((entry, index) => (
              <div
                key={`${entry.prompt || 'shell'}-${index}`}
                className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                {entry.input || entry.prompt ? (
                  <div className="flex items-center gap-2">
                    <span className="text-primary/70">
                      {entry.prompt || 'visitor@portfolio:~$'}
                    </span>
                    {entry.input ? (
                      <span className="text-foreground font-medium">{entry.input}</span>
                    ) : null}
                  </div>
                ) : null}
                {entry.output ? (
                  <div className="pl-4 pb-2 border-l-2 border-primary/10 ml-1">
                    {entry.output}
                  </div>
                ) : null}
              </div>
            ))}

            {mode === 'snakeGame' ? (
              <div className="pt-2">
                <SnakePanel snakeState={snakeState} bestScore={snakeBestScore} />
              </div>
            ) : null}

            {isAgentMode ? (
              <div className="mt-4 border-t border-primary/20 pt-4 relative">
                <div className="absolute top-0 right-0 text-[10px] text-primary/50 uppercase tracking-widest">
                  Agent link active
                </div>
                {messages.map((message) => (
                  <div key={message.id} className="mb-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          'text-xs uppercase font-bold',
                          message.role === 'user' ? 'text-primary/70' : 'text-accent'
                        )}
                      >
                        {message.role === 'user' ? 'You' : 'AI_Agent'}
                      </span>
                    </div>
                    <div className="pl-2 border-l-2 border-primary/10 ml-1">
                      {message.role === 'assistant' ? (
                        (() => {
                          const textContent = getTextFromMessageParts(message).trim();
                          const assistantStatus = getAssistantStatusFromMessage(message);

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
                          {getTextFromMessageParts(message)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading ? (
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
                ) : null}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
              <span
                className={cn(
                  'shrink-0 transition-colors',
                  isAgentMode ? 'text-accent' : 'text-primary/70'
                )}
              >
                {promptLabel}
              </span>
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none outline-none text-foreground w-full focus:ring-0 p-0"
                  spellCheck={false}
                  autoComplete="off"
                />
                <motion.span
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [1, 0] }}
                  transition={
                    shouldReduceMotion
                      ? undefined
                      : { repeat: Infinity, duration: 0.8 }
                  }
                  className={cn('w-2 h-5 absolute', isAgentMode ? 'bg-accent' : 'bg-primary')}
                  style={{ left: `${input.length}ch` }}
                />
              </div>
            </form>
            <div ref={bottomRef} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

