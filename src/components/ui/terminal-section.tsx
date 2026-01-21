'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CYBERPUNK_MESSAGES } from '@/data/cyberpunk-messages';
import { useHeroStore } from '@/lib/stores/hero-store';
import { useProjectsStore } from '@/lib/stores/projects-store';
import { useSkillsStore } from '@/lib/stores/skills-store';
import { useSiteSettingsStore } from '@/lib/stores/site-settings-store';
import { useTheme } from 'next-themes';

interface Command {
  input: string;
  output: React.ReactNode;
}

export function TerminalSection() {
  const [history, setHistory] = useState<Command[]>([]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const { heroData } = useHeroStore();
  const { projects } = useProjectsStore();
  const { skills } = useSkillsStore();
  const { settings } = useSiteSettingsStore();
  const { resolvedTheme } = useTheme();

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [history]);

  // Helper to get random message
  const getRandomMessage = (messages: string[]) => {
    const index = Math.floor(Math.random() * messages.length);
    return messages[index];
  };

  // Dynamic Command Registry
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
            <li><span className="text-primary font-bold">clear</span> - Clear terminal</li>
          </ul>
        </div>
      ),
      about: () => (
        <div className="text-foreground/90">
          <p className="text-primary font-bold mb-1">{getRandomMessage(CYBERPUNK_MESSAGES.headers.about)}</p>
          <p className="leading-relaxed">{heroData.description || "I am a full-stack developer obsessed with building digital experiences that matter."}</p>
        </div>
      ),
      projects: () => (
        <div className="text-foreground/90">
          <p className="text-primary font-bold mb-2">{getRandomMessage(CYBERPUNK_MESSAGES.headers.projects)}</p>
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
          <p className="text-primary font-bold mb-2">{getRandomMessage(CYBERPUNK_MESSAGES.headers.skills)}</p>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="px-2 py-1 rounded bg-primary/10 text-primary text-sm border border-primary/20">
                  {skill.name}
                </span>
              ))}
            </div>
          ) : (
            <p>No skills found in the database.</p>
          )}
        </div>
      ),
      contact: () => (
        <div className="text-foreground/90">
          <p className="text-primary font-bold mb-2">{getRandomMessage(CYBERPUNK_MESSAGES.headers.contact)}</p>
          <div className="space-y-1">
            <p>📧 Email: <a href={`mailto:${settings.social.email}`} className="hover:text-primary transition-colors">{settings.social.email}</a></p>
            <p>🐙 GitHub: <a href={settings.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{settings.social.github}</a></p>
            <p>💼 LinkedIn: <a href={settings.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{settings.social.linkedin}</a></p>
          </div>
        </div>
      ),
      clear: () => {
        setHistory([]);
        return null;
      }
    };
  }, [heroData, projects, skills, settings]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (!trimmedCmd) return;

    let output: React.ReactNode = null;

    if (trimmedCmd in commands) {
      // @ts-ignore - we know it exists
      output = commands[trimmedCmd as keyof typeof commands]();
      // If output is null (like for clear), we don't add to history in the same way or we handle it inside the function
      if (trimmedCmd === 'clear') return; 
    } else {
      output = <span className="text-red-500">Command not found: {cmd}. Type 'help' for available commands.</span>;
    }

    setHistory((prev) => [...prev, { input: cmd, output }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput('');
  };

  return (
    <section className="w-full py-20 bg-background relative overflow-hidden">
      {/* Background Grid - Transparent but visible */}
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
          <p className="text-muted-foreground text-sm">{getRandomMessage(CYBERPUNK_MESSAGES.prompts)}</p>
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
              Type <span className="text-primary font-bold">'help'</span> to see available commands.
            </div>

            {history.map((entry, i) => (
              <div key={i} className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2">
                  <span className="text-primary/70">visitor@portfolio:~$</span>
                  <span className="text-foreground font-medium">{entry.input}</span>
                </div>
                {entry.output && (
                  <div className="pl-4 pb-2 border-l-2 border-primary/10 ml-1">
                    {entry.output}
                  </div>
                )}
              </div>
            ))}

            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
              <span className="text-primary/70 shrink-0">visitor@portfolio:~$</span>
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-transparent border-none outline-none text-foreground w-full focus:ring-0 p-0"
                  spellCheck={false}
                  autoComplete="off"
                  autoFocus
                />
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-2 h-5 bg-primary absolute"
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
