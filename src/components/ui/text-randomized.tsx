'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const RANDOM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

type RandomizedTextEffectProps = {
  text: string;
  className?: string;
  frameMs?: number;
};

function randomChar() {
  return RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
}

export function RandomizedTextEffect({
  text,
  className,
  frameMs = 26,
}: RandomizedTextEffectProps) {
  const [displayText, setDisplayText] = useState(text);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (!timerRef.current) return;
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const runAnimation = useCallback(() => {
    stop();
    let frame = 0;
    const totalFrames = Math.max(text.length * 3, 1);

    timerRef.current = setInterval(() => {
      const revealCount = Math.floor(frame / 3);
      const nextText = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < revealCount) return char;
          return randomChar();
        })
        .join('');

      setDisplayText(nextText);
      frame += 1;

      if (frame > totalFrames) {
        setDisplayText(text);
        stop();
      }
    }, frameMs);
  }, [frameMs, stop, text]);

  useEffect(() => {
    runAnimation();
    return stop;
  }, [runAnimation, stop]);

  return (
    <span
      aria-label={text}
      onMouseEnter={runAnimation}
      className={className}
      suppressHydrationWarning
    >
      {displayText}
    </span>
  );
}

