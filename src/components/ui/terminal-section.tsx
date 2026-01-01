'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CYBERPUNK_MESSAGES } from '@/data/cyberpunk-messages';

interface Command {
  input: string;
  output: React.ReactNode;
}

export function TerminalSection() {
  const [history, setHistory] = useState<Command[]>([]);
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    let output: React.ReactNode = '';

    switch (trimmedCmd) {
      case 'help':
        output = (
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
        );
        break;
      case 'about':
        output = (
          <div className="text-primary/90">
            <p>{CYBERPUNK_MESSAGES.headers.about[0]}</p>
            <p className="mt-2">I am a full-stack developer obsessed with building digital experiences that matter.</p>
          </div>
        );
        break;
      case 'projects':
        output = (
          <div className="text-primary/90">
            <p>{CYBERPUNK_MESSAGES.headers.projects[0]}</p>
            <p className="mt-2">Check out the projects section above for a visual feed.</p>
          </div>
        );
        break;
      case 'skills':
        output = (
          <div className="text-primary/90">
            <p>{CYBERPUNK_MESSAGES.headers.skills[0]}</p>
            <p className="mt-2">React, Next.js, Node.js, TypeScript, Tailwind, Supabase...</p>
          </div>
        );
        break;
      case 'contact':
        output = (
          <div className="text-primary/90">
            <p>{CYBERPUNK_MESSAGES.headers.contact[0]}</p>
            <p className="mt-2">Email me at: hello@example.com</p>
          </div>
        );
        break;
      case 'clear':
        setHistory([]);
        return;
      default:
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
    <section className="w-full py-20 bg-black/95 text-green-500 font-mono relative overflow-hidden border-t border-primary/20">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 glitch-text" data-text="TERMINAL_ACCESS">
            TERMINAL_ACCESS
          </h2>
          <p className="text-primary/60 text-sm">{CYBERPUNK_MESSAGES.prompts[0]}</p>
        </div>

        <div 
          className="bg-black/80 border border-primary/30 rounded-lg p-6 min-h-[400px] shadow-[0_0_30px_rgba(var(--primary),0.1)] backdrop-blur-sm"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="space-y-4">
            <div className="text-primary/50 text-sm mb-4">
              Last login: {new Date().toLocaleString()} on ttys000
              <br />
              Type 'help' to see available commands.
            </div>

            {history.map((entry, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-primary/70">visitor@portfolio:~$</span>
                  <span className="text-white">{entry.input}</span>
                </div>
                <div className="pl-4 pb-2">{entry.output}</div>
              </div>
            ))}

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <span className="text-primary/70">visitor@portfolio:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-transparent border-none outline-none text-white flex-1 focus:ring-0 p-0"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="w-2 h-5 bg-primary block"
              />
            </form>
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
