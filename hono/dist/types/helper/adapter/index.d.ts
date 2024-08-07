/**
 * @module
 * Adapter Helper for Hono.
 */
import type { Context } from '../../context';
export type Runtime = 'node' | 'deno' | 'bun' | 'workerd' | 'fastly' | 'edge-light' | 'other';
export declare const env: <T extends Record<string, unknown>, C extends Context<any, any, {}> = Context<{}, any, {}>>(c: C, runtime?: Runtime) => T & C["env"];
export declare const knownUserAgents: Partial<Record<Runtime, string>>;
export declare const getRuntimeKey: () => Runtime;
export declare const checkUserAgentEquals: (platform: string) => boolean;
