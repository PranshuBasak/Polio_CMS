import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'

// Required by Nextra: merge theme components with local overrides.
export function useMDXComponents(components: Record<string, unknown> = {}) {
  return {
    ...getThemeComponents(),
    ...components
  }
}
