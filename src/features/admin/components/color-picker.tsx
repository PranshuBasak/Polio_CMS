'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [color, setColor] = useState(value || '#000000');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setColor(value);
  }, [value]);

  const handleChange = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };

  const presetColors = [
    '#000000',
    '#ffffff',
    '#f44336',
    '#e91e63',
    '#9c27b0',
    '#673ab7',
    '#3f51b5',
    '#2196f3',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    '#ffeb3b',
    '#ffc107',
    '#ff9800',
    '#ff5722',
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-10 h-10 p-0 border-2"
          style={{ backgroundColor: color }}
        >
          <span className="sr-only">Pick a color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-4">
        <div className="space-y-4">
          <div className="flex justify-between gap-2">
            <div
              className="w-12 h-12 rounded-md border-2"
              style={{ backgroundColor: color }}
            />
            <Input
              ref={inputRef}
              value={color}
              onChange={(e) => handleChange(e.target.value)}
              className="w-32"
            />
          </div>
          <div>
            <div className="grid grid-cols-6 gap-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  className="w-6 h-6 rounded-md border"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handleChange(presetColor)}
                  aria-label={`Select color ${presetColor}`}
                />
              ))}
            </div>
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full h-8"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
