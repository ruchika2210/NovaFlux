/**
 * @module
 * Concurrent utility.
 */
export interface Pool {
    run<T>(fn: () => T): Promise<T>;
}
export declare const createPool: ({ concurrency, interval, }?: {
    concurrency?: number | undefined;
    interval?: number | undefined;
}) => Pool;
