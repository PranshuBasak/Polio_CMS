import AnimatedShaderBackground from '@/components/ui/animated-shader-background';

const DemoOne = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <AnimatedShaderBackground className="opacity-65 dark:opacity-45" />
      <div className="relative z-10 flex h-full items-center justify-center">
        <p className="rounded-lg border border-border/60 bg-background/70 px-5 py-3 text-sm text-foreground backdrop-blur">
          Shader background demo
        </p>
      </div>
    </div>
  );
};

export { DemoOne };
