# Next.js Config

Configuration in `next.config.ts`.

## Image Optimization

We configure `remotePatterns` to allow images from common sources.

```typescript
images: {
  remotePatterns: [
    { hostname: 'cdn.simpleicons.org' },
    { hostname: 'images.unsplash.com' },
    { hostname: 'media.licdn.com' },
  ],
  dangerouslyAllowSVG: true, // For SimpleIcons
  unoptimized: true, // Disabled optimization for static export/performance
}
```

## Security Headers

Content Security Policy (CSP) is set to restrict script sources.

```typescript
contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
```

## React Compiler

Enabled for automatic memoization (React 19 feature).

```typescript
reactCompiler: true
```
