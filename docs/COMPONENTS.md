# UI Components Library

Complete reference for all UI components in DynamicFolio CMS.

## Table of Contents
- [Overview](#overview)
- [Base Components (Shadcn UI)](#base-components-shadcn-ui)
- [Custom Components](#custom-components)
- [Animation Components](#animation-components)
- [Layout Components](#layout-components)
- [Usage Examples](#usage-examples)

---

## Overview

DynamicFolio CMS uses a combination of:
- **Shadcn UI** - Accessible, customizable Radix-based components
- **Custom Components** - Project-specific UI elements
- **Framer Motion** - Animation wrappers

All components are located in `src/components/`.

### Component Organization

```
src/components/
├── ui/                    # Base UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── providers/             # Context providers
│   ├── theme-provider.tsx
│   └── data-provider.tsx
└── analytics/             # Analytics components
```

---

## Base Components (Shadcn UI)

### Button

```typescript
import { Button } from '@/components/ui/button';

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### Card

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
    <CardDescription>Short description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dialog

```typescript
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Project</DialogTitle>
      <DialogDescription>Make changes to your project.</DialogDescription>
    </DialogHeader>
    {/* Form content */}
    <DialogFooter>
      <Button type="submit">Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Tabs

```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

<Tabs defaultValue="bio">
  <TabsList>
    <TabsTrigger value="bio">Biography</TabsTrigger>
    <TabsTrigger value="journey">Journey</TabsTrigger>
    <TabsTrigger value="values">Values</TabsTrigger>
  </TabsList>
  <TabsContent value="bio">Bio content</TabsContent>
  <TabsContent value="journey">Journey content</TabsContent>
  <TabsContent value="values">Values content</TabsContent>
</Tabs>
```

### Select

```typescript
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

<Select value={category} onValueChange={setCategory}>
  <SelectTrigger>
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="frontend">Frontend</SelectItem>
    <SelectItem value="backend">Backend</SelectItem>
    <SelectItem value="devops">DevOps</SelectItem>
  </SelectContent>
</Select>
```

### Input & Textarea

```typescript
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="title">Title</Label>
  <Input id="title" placeholder="Enter title" />
</div>

<div className="space-y-2">
  <Label htmlFor="description">Description</Label>
  <Textarea id="description" placeholder="Enter description" />
</div>
```

### Toast (Sonner)

```typescript
import { toast } from 'sonner';

// Success
toast.success('Project saved successfully');

// Error
toast.error('Failed to save project');

// With description
toast.success('Saved', {
  description: 'Your changes have been saved.',
});

// Loading
const id = toast.loading('Saving...');
// Later:
toast.dismiss(id);
toast.success('Saved!');
```

---

## Custom Components

### CLI Loader

Cyberpunk-themed CLI loading animation.

**File**: `src/components/ui/cli-loader.tsx`

```typescript
import { CliLoader } from '@/components/ui/cli-loader';

<CliLoader onComplete={() => setLoaded(true)} />
```

**Props**:
- `onComplete: () => void` - Callback when animation completes

---

### Dot Loader

Simple dot animation loader.

**File**: `src/components/ui/dot-loader.tsx`

```typescript
import { DotLoader } from '@/components/ui/dot-loader';

<DotLoader size="sm" />  // 4px dots
<DotLoader size="md" />  // 6px dots
<DotLoader size="lg" />  // 8px dots
```

---

### Skeleton Loader

Shimmer skeleton for loading states.

**File**: `src/components/ui/skeleton-loader.tsx`

```typescript
import { SkeletonCard, SkeletonText, SkeletonAvatar } from '@/components/ui/skeleton-loader';

// Loading card
<SkeletonCard />

// Loading text lines
<SkeletonText lines={3} />

// Loading avatar
<SkeletonAvatar size="lg" />
```

---

### Typewriter

Animated typewriter effect.

**File**: `src/components/ui/typewriter.tsx`

```typescript
import { Typewriter } from '@/components/ui/typewriter';

<Typewriter
  words={['Developer', 'Designer', 'Architect']}
  delay={100}
  cursor
  cursorColor="var(--primary)"
/>
```

**Props**:
- `words: string[]` - Words to type
- `delay?: number` - Delay between characters (ms)
- `cursor?: boolean` - Show blinking cursor
- `cursorColor?: string` - Cursor color

---

### Smooth Cursor

Custom smooth-following cursor.

**File**: `src/components/ui/smooth-cursor.tsx`

```typescript
import { SmoothCursor } from '@/components/ui/smooth-cursor';

// In layout or root component
<SmoothCursor />
```

---

### Placeholder Image

SVG placeholder for missing images.

**File**: `src/components/ui/placeholder-image.tsx`

```typescript
import { PlaceholderImage } from '@/components/ui/placeholder-image';

<PlaceholderImage 
  width={400} 
  height={300} 
  text="Project Image" 
/>
```

---

### Progress

Skill proficiency progress bar.

**File**: `src/components/ui/progress.tsx`

```typescript
import { Progress } from '@/components/ui/progress';

<Progress value={85} className="h-2" />
```

---

## Animation Components

### Wave Background

Animated wave gradient background.

**File**: `src/components/ui/wave-background.tsx`

```typescript
import { WaveBackground } from '@/components/ui/wave-background';

<div className="relative">
  <WaveBackground />
  <div className="relative z-10">{children}</div>
</div>
```

---

### Matrix Background

Matrix-style falling characters.

**File**: `src/components/ui/matrix-background.tsx`

```typescript
import { MatrixBackground } from '@/components/ui/matrix-background';

<MatrixBackground opacity={0.1} />
```

---

### Liquid Glass

Glassmorphism effect container.

**File**: `src/components/ui/liquid-glass.tsx`

```typescript
import { LiquidGlass } from '@/components/ui/liquid-glass';

<LiquidGlass blur="md" opacity={0.1}>
  <Card>{content}</Card>
</LiquidGlass>
```

---

## Layout Components

### Terminal Section

Terminal-style section wrapper.

**File**: `src/components/ui/terminal-section.tsx`

```typescript
import { TerminalSection } from '@/components/ui/terminal-section';

<TerminalSection title="projects.ts">
  <ProjectsList />
</TerminalSection>
```

---

### Mock Browser Window

Browser window frame for demos.

**File**: `src/components/ui/mock-browser-window.tsx`

```typescript
import { MockBrowserWindow } from '@/components/ui/mock-browser-window';

<MockBrowserWindow url="https://example.com">
  <Image src="/screenshot.png" />
</MockBrowserWindow>
```

---

## Provider Components

### Theme Provider

Dark/light theme switching.

**File**: `src/components/providers/theme-provider.tsx`

```typescript
// In layout.tsx
import { ThemeProvider } from '@/components/providers/theme-provider';

<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

### Data Provider

Initializes stores and fetches initial data.

**File**: `src/components/providers/data-provider.tsx`

```typescript
import { DataProvider } from '@/components/providers/data-provider';

<DataProvider>
  {children}
</DataProvider>
```

---

## Usage Examples

### Complete Form

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

function ProjectForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Project</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Project title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Describe your project" />
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Project</Button>
      </CardFooter>
    </Card>
  );
}
```

### Loading State

```typescript
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

function ProjectCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-48 w-full" /> {/* Image */}
        <Skeleton className="h-6 w-3/4" />   {/* Title */}
        <Skeleton className="h-4 w-full" />  {/* Description */}
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  );
}
```

---

## Styling Guidelines

### Using cn() Utility

Merge Tailwind classes conditionally:

```typescript
import { cn } from '@/lib/utils';

<Button className={cn(
  "default-classes",
  isActive && "active-classes",
  disabled && "disabled-classes"
)} />
```

### Theming

All components respect CSS variables for theming:

```css
/* src/app/globals.css */
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 96%;
  /* ... */
}

.dark {
  --primary: 210 40% 98%;
  /* ... */
}
```

---

## Adding New Components

1. Create component in `src/components/ui/`
2. Use `cn()` utility for class merging
3. Export from component file
4. Add documentation here

Template:

```typescript
import * as React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary';
}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'base-classes',
          variant === 'secondary' && 'secondary-classes',
          className
        )}
        {...props}
      />
    );
  }
);
Component.displayName = 'Component';

export { Component };
```

---

## Additional Resources

- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
