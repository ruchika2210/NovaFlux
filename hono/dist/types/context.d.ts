import type { HonoRequest } from './request';
import type { Env, FetchEventLike, Input, NotFoundHandler, TypedResponse } from './types';
import type { RedirectStatusCode, StatusCode } from './utils/http-status';
import type { IsAny, JSONParsed, JSONValue, SimplifyDeepArray } from './utils/types';
type HeaderRecord = Record<string, string | string[]>;
/**
 * Data type can be a string, ArrayBuffer, or ReadableStream.
 */
export type Data = string | ArrayBuffer | ReadableStream;
/**
 * Interface for the execution context in a web worker or similar environment.
 */
export interface ExecutionContext {
    /**
     * Extends the lifetime of the event callback until the promise is settled.
     *
     * @param promise - A promise to wait for.
     */
    waitUntil(promise: Promise<unknown>): void;
    /**
     * Allows the event to be passed through to subsequent event listeners.
     */
    passThroughOnException(): void;
}
/**
 * Interface for context variable mapping.
 */
export interface ContextVariableMap {
}
/**
 * Interface for context renderer.
 */
export interface ContextRenderer {
}
/**
 * Interface representing a renderer for content.
 *
 * @interface DefaultRenderer
 * @param {string | Promise<string>} content - The content to be rendered, which can be either a string or a Promise resolving to a string.
 * @returns {Response | Promise<Response>} - The response after rendering the content, which can be either a Response or a Promise resolving to a Response.
 */
interface DefaultRenderer {
    (content: string | Promise<string>): Response | Promise<Response>;
}
/**
 * Renderer type which can either be a ContextRenderer or DefaultRenderer.
 */
export type Renderer = ContextRenderer extends Function ? ContextRenderer : DefaultRenderer;
/**
 * Extracts the props for the renderer.
 */
export type PropsForRenderer = [...Required<Parameters<Renderer>>] extends [unknown, infer Props] ? Props : unknown;
export type Layout<T = Record<string, any>> = (props: T) => any;
/**
 * Interface for getting context variables.
 *
 * @template E - Environment type.
 */
interface Get<E extends Env> {
    <Key extends keyof E['Variables']>(key: Key): E['Variables'][Key];
    <Key extends keyof ContextVariableMap>(key: Key): ContextVariableMap[Key];
}
/**
 * Interface for setting context variables.
 *
 * @template E - Environment type.
 */
interface Set<E extends Env> {
    <Key extends keyof E['Variables']>(key: Key, value: E['Variables'][Key]): void;
    <Key extends keyof ContextVariableMap>(key: Key, value: ContextVariableMap[Key]): void;
}
/**
 * Interface for creating a new response.
 */
interface NewResponse {
    (data: Data | null, status?: StatusCode, headers?: HeaderRecord): Response;
    (data: Data | null, init?: ResponseInit): Response;
}
/**
 * Interface for responding with a body.
 */
interface BodyRespond extends NewResponse {
}
/**
 * Interface for responding with text.
 *
 * @interface TextRespond
 * @template T - The type of the text content.
 * @template U - The type of the status code.
 *
 * @param {T} text - The text content to be included in the response.
 * @param {U} [status] - An optional status code for the response.
 * @param {HeaderRecord} [headers] - An optional record of headers to include in the response.
 *
 * @returns {Response & TypedResponse<T, U, 'text'>} - The response after rendering the text content, typed with the provided text and status code types.
 */
interface TextRespond {
    <T extends string, U extends StatusCode = StatusCode>(text: T, status?: U, headers?: HeaderRecord): Response & TypedResponse<T, U, 'text'>;
    <T extends string, U extends StatusCode = StatusCode>(text: T, init?: ResponseInit): Response & TypedResponse<T, U, 'text'>;
}
/**
 * Interface for responding with JSON.
 *
 * @interface JSONRespond
 * @template T - The type of the JSON value or simplified unknown type.
 * @template U - The type of the status code.
 *
 * @param {T} object - The JSON object to be included in the response.
 * @param {U} [status] - An optional status code for the response.
 * @param {HeaderRecord} [headers] - An optional record of headers to include in the response.
 *
 * @returns {JSONRespondReturn<T, U>} - The response after rendering the JSON object, typed with the provided object and status code types.
 */
interface JSONRespond {
    <T extends JSONValue | SimplifyDeepArray<unknown>, U extends StatusCode = StatusCode>(object: T, status?: U, headers?: HeaderRecord): JSONRespondReturn<T, U>;
    <T extends JSONValue | SimplifyDeepArray<unknown>, U extends StatusCode = StatusCode>(object: T, init?: ResponseInit): JSONRespondReturn<T, U>;
}
/**
 * @template T - The type of the JSON value or simplified unknown type.
 * @template U - The type of the status code.
 *
 * @returns {Response & TypedResponse<SimplifyDeepArray<T> extends JSONValue ? (JSONValue extends SimplifyDeepArray<T> ? never : JSONParsed<T>) : never, U, 'json'>} - The response after rendering the JSON object, typed with the provided object and status code types.
 */
type JSONRespondReturn<T extends JSONValue | SimplifyDeepArray<unknown>, U extends StatusCode> = Response & TypedResponse<SimplifyDeepArray<T> extends JSONValue ? JSONValue extends SimplifyDeepArray<T> ? never : JSONParsed<T> : never, U, 'json'>;
/**
 * Interface representing a function that responds with HTML content.
 *
 * @param html - The HTML content to respond with, which can be a string or a Promise that resolves to a string.
 * @param status - (Optional) The HTTP status code for the response.
 * @param headers - (Optional) A record of headers to include in the response.
 * @param init - (Optional) The response initialization object.
 *
 * @returns A Response object or a Promise that resolves to a Response object.
 */
interface HTMLRespond {
    <T extends string | Promise<string>>(html: T, status?: StatusCode, headers?: HeaderRecord): T extends string ? Response : Promise<Response>;
    <T extends string | Promise<string>>(html: T, init?: ResponseInit): T extends string ? Response : Promise<Response>;
}
/**
 * Options for configuring the context.
 *
 * @template E - Environment type.
 */
type ContextOptions<E extends Env> = {
    /**
     * Bindings for the environment.
     */
    env: E['Bindings'];
    /**
     * Execution context for the request.
     */
    executionCtx?: FetchEventLike | ExecutionContext | undefined;
    /**
     * Handler for not found responses.
     */
    notFoundHandler?: NotFoundHandler<E>;
};
export declare const TEXT_PLAIN = "text/plain; charset=UTF-8";
export declare class Context<E extends Env = any, P extends string = any, I extends Input = {}> {
    #private;
    /**
     * `.req` is the instance of {@link HonoRequest}.
     */
    req: HonoRequest<P, I['out']>;
    /**
     * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
     *
     * @see {@link https://hono.dev/api/context#env}
     *
     * @example
     * ```ts
     * // Environment object for Cloudflare Workers
     * app.get('*', async c => {
     *   const counter = c.env.COUNTER
     * })
     * ```
     */
    env: E['Bindings'];
    private _var;
    finalized: boolean;
    /**
     * `.error` can get the error object from the middleware if the Handler throws an error.
     *
     * @see {@link https://hono.dev/api/context#error}
     *
     * @example
     * ```ts
     * app.use('*', async (c, next) => {
     *   await next()
     *   if (c.error) {
     *     // do something...
     *   }
     * })
     * ```
     */
    error: Error | undefined;
    private layout;
    private renderer;
    private notFoundHandler;
    /**
     * Creates an instance of the Context class.
     *
     * @param req - The HonoRequest object.
     * @param options - Optional configuration options for the context.
     */
    constructor(req: HonoRequest<P, I['out']>, options?: ContextOptions<E>);
    /**
     * @see {@link https://hono.dev/api/context#event}
     * The FetchEvent associated with the current request.
     *
     * @throws Will throw an error if the context does not have a FetchEvent.
     */
    get event(): FetchEventLike;
    /**
     * @see {@link https://hono.dev/api/context#executionctx}
     * The ExecutionContext associated with the current request.
     *
     * @throws Will throw an error if the context does not have an ExecutionContext.
     */
    get executionCtx(): ExecutionContext;
    /**
     * @see {@link https://hono.dev/api/context#res}
     * The Response object for the current request.
     */
    get res(): Response;
    /**
     * Sets the Response object for the current request.
     *
     * @param _res - The Response object to set.
     */
    set res(_res: Response | undefined);
    /**
     * `.render()` can create a response within a layout.
     *
     * @see {@link https://hono.dev/api/context#render-setrenderer}
     *
     * @example
     * ```ts
     * app.get('/', (c) => {
     *   return c.render('Hello!')
     * })
     * ```
     */
    render: Renderer;
    /**
     * Sets the layout for the response.
     *
     * @param layout - The layout to set.
     * @returns The layout function.
     */
    setLayout: (layout: Layout<PropsForRenderer & {
        Layout: Layout;
    }>) => Layout<PropsForRenderer & {
        Layout: Layout;
    }>;
    /**
     * Gets the current layout for the response.
     *
     * @returns The current layout function.
     */
    getLayout: () => Layout<{
        Layout: Layout;
    }> | undefined;
    /**
     * `.setRenderer()` can set the layout in the custom middleware.
     *
     * @see {@link https://hono.dev/api/context#render-setrenderer}
     *
     * @example
     * ```tsx
     * app.use('*', async (c, next) => {
     *   c.setRenderer((content) => {
     *     return c.html(
     *       <html>
     *         <body>
     *           <p>{content}</p>
     *         </body>
     *       </html>
     *     )
     *   })
     *   await next()
     * })
     * ```
     */
    setRenderer: (renderer: Renderer) => void;
    /**
     * `.header()` can set headers.
     *
     * @see {@link https://hono.dev/api/context#body}
     *
     * @example
     * ```ts
     * app.get('/welcome', (c) => {
     *   // Set headers
     *   c.header('X-Message', 'Hello!')
     *   c.header('Content-Type', 'text/plain')
     *
     *   return c.body('Thank you for coming')
     * })
     * ```
     */
    header: (name: string, value: string | undefined, options?: {
        append?: boolean;
    }) => void;
    status: (status: StatusCode) => void;
    /**
     * `.set()` can set the value specified by the key.
     *
     * @see {@link https://hono.dev/api/context#set-get}
     *
     * @example
     * ```ts
     * app.use('*', async (c, next) => {
     *   c.set('message', 'Hono is cool!!')
     *   await next()
     * })
     * ```
  ```
     */
    set: Set<E>;
    /**
     * `.get()` can use the value specified by the key.
     *
     * @see {@link https://hono.dev/api/context#set-get}
     *
     * @example
     * ```ts
     * app.get('/', (c) => {
     *   const message = c.get('message')
     *   return c.text(`The message is "${message}"`)
     * })
     * ```
     */
    get: Get<E>;
    /**
     * `.var` can access the value of a variable.
     *
     * @see {@link https://hono.dev/api/context#var}
     *
     * @example
     * ```ts
     * const result = c.var.client.oneMethod()
     * ```
     */
    get var(): Readonly<ContextVariableMap & (IsAny<E['Variables']> extends true ? Record<string, any> : E['Variables'])>;
    newResponse: NewResponse;
    /**
     * `.body()` can return the HTTP response.
     * You can set headers with `.header()` and set HTTP status code with `.status`.
     * This can also be set in `.text()`, `.json()` and so on.
     *
     * @see {@link https://hono.dev/api/context#body}
     *
     * @example
     * ```ts
     * app.get('/welcome', (c) => {
     *   // Set headers
     *   c.header('X-Message', 'Hello!')
     *   c.header('Content-Type', 'text/plain')
     *   // Set HTTP status code
     *   c.status(201)
     *
     *   // Return the response body
     *   return c.body('Thank you for coming')
     * })
     * ```
     */
    body: BodyRespond;
    /**
     * `.text()` can render text as `Content-Type:text/plain`.
     *
     * @see {@link https://hono.dev/api/context#text}
     *
     * @example
     * ```ts
     * app.get('/say', (c) => {
     *   return c.text('Hello!')
     * })
     * ```
     */
    text: TextRespond;
    /**
     * `.json()` can render JSON as `Content-Type:application/json`.
     *
     * @see {@link https://hono.dev/api/context#json}
     *
     * @example
     * ```ts
     * app.get('/api', (c) => {
     *   return c.json({ message: 'Hello!' })
     * })
     * ```
     */
    json: JSONRespond;
    html: HTMLRespond;
    /**
     * `.redirect()` can Redirect, default status code is 302.
     *
     * @see {@link https://hono.dev/api/context#redirect}
     *
     * @example
     * ```ts
     * app.get('/redirect', (c) => {
     *   return c.redirect('/')
     * })
     * app.get('/redirect-permanently', (c) => {
     *   return c.redirect('/', 301)
     * })
     * ```
     */
    redirect: <T extends RedirectStatusCode = 302>(location: string, status?: T | undefined) => Response & TypedResponse<undefined, T, "redirect">;
    /**
     * `.notFound()` can return the Not Found Response.
     *
     * @see {@link https://hono.dev/api/context#notfound}
     *
     * @example
     * ```ts
     * app.get('/notfound', (c) => {
     *   return c.notFound()
     * })
     * ```
     */
    notFound: () => Response | Promise<Response>;
}
export {};
