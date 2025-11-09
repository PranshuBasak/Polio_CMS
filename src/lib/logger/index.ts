/**
 * Unified Logger Export
 * Use serverLogger for Server Components/API Routes
 * Use clientLogger for Client Components
 */

export { clientLogger } from './client-logger';
export { serverLogger } from './server-logger';

// Type exports
export type { default as ClientLogger } from './client-logger';
