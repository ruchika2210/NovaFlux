/**
 * @module
 * This module contains some type definitions for the Hono modules.
 */
import type { Context } from './context';
import type { Hono } from './hono';
import type { StatusCode } from './utils/http-status';
import type { IfAnyThenEmptyObject, IsAny, JSONValue, RemoveBlankRecord, Simplify, UnionToIntersection } from './utils/types';
export type Bindings = Record<string, unknown>;
export type Variables = Record<string, unknown>;
export type BlankEnv = {};
export type Env = {
    Bindings?: Bindings;
    Variables?: Variables;
};
export type Next = () => Promise<void>;
export type ExtractInput<I extends Input | Input['in']> = I extends Input ? unknown extends I['in'] ? {} : I['in'] : I;
export type Input = {
    in?: {};
    out?: {};
    outputFormat?: ResponseFormat;
};
export type BlankSchema = {};
export type BlankInput = {};
export interface RouterRoute {
    path: string;
    method: string;
    handler: H;
}
export type HandlerResponse<O> = Response | TypedResponse<O> | Promise<Response | TypedResponse<O>>;
export type Handler<E extends Env = any, P extends string = any, I extends Input = BlankInput, R extends HandlerResponse<any> = any> = (c: Context<E, P, I>, next: Next) => R;
export type MiddlewareHandler<E extends Env = any, P extends string = string, I extends Input = {}> = (c: Context<E, P, I>, next: Next) => Promise<Response | void>;
export type H<E extends Env = any, P extends string = any, I extends Input = BlankInput, R extends HandlerResponse<any> = any> = Handler<E, P, I, R> | MiddlewareHandler<E, P, I>;
export type NotFoundHandler<E extends Env = any> = (c: Context<E>) => Response | Promise<Response>;
export interface HTTPResponseError extends Error {
    getResponse: () => Response;
}
export type ErrorHandler<E extends Env = any> = (err: Error | HTTPResponseError, c: Context<E>) => Response | Promise<Response>;
export interface HandlerInterface<E extends Env = Env, M extends string = string, S extends Schema = BlankSchema, BasePath extends string = '/'> {
    <P extends string = ExtractKey<S> extends never ? BasePath : ExtractKey<S>, I extends Input = BlankInput, R extends HandlerResponse<any> = any, E2 extends Env = E>(handler: H<E2, P, I, R>): Hono<IntersectNonAnyTypes<[E, E2]>, S & ToSchema<M, P, I, MergeTypedResponse<R>>, BasePath>;
    <P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, E2 extends Env = E>(path: P, handler: H<E2, MergedPath, I, R>): Hono<IntersectNonAnyTypes<[E, E2]>, S & ToSchema<M, MergePath<BasePath, P>, I, MergeTypedResponse<R>>, BasePath>;
    <P extends string = ExtractKey<S> extends never ? BasePath : ExtractKey<S>, I extends Input = BlankInput, I2 extends Input = I, R extends HandlerResponse<any> = any, E2 extends Env = E, E3 extends Env = IntersectNonAnyTypes<[E, E2]>>(...handlers: [H<E2, P, I>, H<E3, P, I2, R>]): Hono<IntersectNonAnyTypes<[E, E2, E3]>, S & ToSchema<M, P, I2, MergeTypedResponse<R>>, BasePath>;
    <P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, E2 extends Env = E, E3 extends Env = IntersectNonAnyTypes<[E, E2]>>(path: P, ...handlers: [H<E2, MergedPath, I>, H<E3, MergedPath, I2, R>]): Hono<IntersectNonAnyTypes<[E, E2, E3]>, S & ToSchema<M, MergePath<BasePath, P>, I2, MergeTypedResponse<R>>, BasePath>;
    <P extends string = ExtractKey<S> extends never ? BasePath : ExtractKey<S>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, E2 extends Env = E, E3 extends Env = E, E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>>(...handlers: [H<E2, P, I>, H<E3, P, I2>, H<E4, P, I3, R>]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4]>, S & ToSchema<M, P, I3, MergeTypedResponse<R>>, BasePath>;
    <P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, E2 extends Env = E, E3 extends Env = E, E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>>(path: P, ...handlers: [H<E2, MergedPath, I>, H<E3, MergedPath, I2>, H<E4, MergedPath, I3, R>]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4]>, S & ToSchema<M, MergePath<BasePath, P>, I3, MergeTypedResponse<R>>, BasePath>;
    <P extends string = ExtractKey<S> extends never ? BasePath : ExtractKey<S>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>>(...handlers: [H<E2, P, I>, H<E3, P, I2>, H<E4, P, I3>, H<E5, P, I4, R>]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5]>, S & ToSchema<M, P, I4, MergeTypedResponse<R>>, BasePath>;
    <P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>>(path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5]>, S & ToSchema<M, MergePath<BasePath, P>, I4, MergeTypedResponse<R>>, BasePath>;
    <P extends string = ExtractKey<S> extends never ? BasePath : ExtractKey<S>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>>(...handlers: [H<E2, P, I>, H<E3, P, I2>, H<E4, P, I3>, H<E5, P, I4>, H<E6, P, I5, R>]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>, S & ToSchema<M, P, I5, MergeTypedResponse<R>>, BasePath>;
    <P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>>(path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>, S & ToSchema<M, MergePath<BasePath, P>, I5, MergeTypedResponse<R>>, BasePath>;
    <P extends string = ExtractKey<S> extends never ? BasePath : ExtractKey<S>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>>(...handlers: [
        H<E2, P, I>,
        H<E3, P, I2>,
        H<E4, P, I3>,
        H<E5, P, I4>,
        H<E6, P, I5>,
        H<E7, P, I6, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>, S & ToSchema<M, P, I6, MergeTypedResponse<R>>, BasePath>;
    <P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>>(path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5>,
        H<E7, MergedPath, I6, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>, S & ToSchema<M, MergePath<BasePath, P>, I6, MergeTypedResponse<R>>, BasePath>;
    <P extends string = ExtractKey<S> extends never ? BasePath : ExtractKey<S>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, I7 extends Input = I & I2 & I3 & I4 & I5 & I6, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>>(...handlers: [
        H<E2, P, I>,
        H<E3, P, I2>,
        H<E4, P, I3>,
        H<E5, P, I4>,
        H<E6, P, I5>,
        H<E7, P, I6>,
        H<E8, P, I7, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>, S & ToSchema<M, P, I7, MergeTypedResponse<R>>, BasePath>;
    <P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, I7 extends Input = I & I2 & I3 & I4 & I5 & I6, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>>(path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5>,
        H<E7, MergedPath, I6>,
        H<E8, MergedPath, I7, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>, S & ToSchema<M, MergePath<BasePath, P>, I7, MergeTypedResponse<R>>, BasePath>;
    <P extends string = ExtractKey<S> extends never ? BasePath : ExtractKey<S>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, I7 extends Input = I & I2 & I3 & I4 & I5 & I6, I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = E, E9 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>>(...handlers: [
        H<E2, P, I>,
        H<E3, P, I2>,
        H<E4, P, I3>,
        H<E5, P, I4>,
        H<E6, P, I5>,
        H<E7, P, I6>,
        H<E8, P, I7>,
        H<E9, P, I8, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>, S & ToSchema<M, P, I8, MergeTypedResponse<R>>, BasePath>;
    <P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, I7 extends Input = I & I2 & I3 & I4 & I5 & I6, I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = E, E9 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>>(path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5>,
        H<E7, MergedPath, I6>,
        H<E8, MergedPath, I7>,
        H<E9, MergedPath, I8, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>, S & ToSchema<M, MergePath<BasePath, P>, I8, MergeTypedResponse<R>>, BasePath>;
    <P extends string = ExtractKey<S> extends never ? BasePath : ExtractKey<S>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, I7 extends Input = I & I2 & I3 & I4 & I5 & I6, I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7, I9 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = E, E9 extends Env = E, E10 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>>(...handlers: [
        H<E2, P, I>,
        H<E3, P, I2>,
        H<E4, P, I3>,
        H<E5, P, I4>,
        H<E6, P, I5>,
        H<E7, P, I6>,
        H<E8, P, I7>,
        H<E9, P, I8>,
        H<E10, P, I9, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>, S & ToSchema<M, P, I9, MergeTypedResponse<R>>, BasePath>;
    <P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, I7 extends Input = I & I2 & I3 & I4 & I5 & I6, I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7, I9 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = E, E9 extends Env = E, E10 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>>(path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5>,
        H<E7, MergedPath, I6>,
        H<E8, MergedPath, I7>,
        H<E9, MergedPath, I8>,
        H<E10, MergedPath, I9, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>, S & ToSchema<M, MergePath<BasePath, P>, I9, MergeTypedResponse<R>>, BasePath>;
    <P extends string = ExtractKey<S> extends never ? BasePath : ExtractKey<S>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, I7 extends Input = I & I2 & I3 & I4 & I5 & I6, I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7, I9 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8, I10 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8 & I9, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = E, E9 extends Env = E, E10 extends Env = E, E11 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>>(...handlers: [
        H<E2, P, I>,
        H<E3, P, I2>,
        H<E4, P, I3>,
        H<E5, P, I4>,
        H<E6, P, I5>,
        H<E7, P, I6>,
        H<E8, P, I7>,
        H<E9, P, I8>,
        H<E10, P, I9>,
        H<E11, P, I10, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11]>, S & ToSchema<M, P, I10, MergeTypedResponse<R>>, BasePath>;
    <P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, I7 extends Input = I & I2 & I3 & I4 & I5 & I6, I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7, I9 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8, I10 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8 & I9, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = E, E9 extends Env = E, E10 extends Env = E, E11 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>>(path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5>,
        H<E7, MergedPath, I6>,
        H<E8, MergedPath, I7>,
        H<E9, MergedPath, I8>,
        H<E10, MergedPath, I9>,
        H<E11, MergedPath, I10, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11]>, S & ToSchema<M, MergePath<BasePath, P>, I10, MergeTypedResponse<R>>, BasePath>;
    <P extends string = ExtractKey<S> extends never ? BasePath : ExtractKey<S>, I extends Input = BlankInput, R extends HandlerResponse<any> = any>(...handlers: H<E, P, I, R>[]): Hono<E, S & ToSchema<M, P, I, MergeTypedResponse<R>>, BasePath>;
    <P extends string, I extends Input = BlankInput, R extends HandlerResponse<any> = any>(path: P, ...handlers: H<E, MergePath<BasePath, P>, I, R>[]): Hono<E, S & ToSchema<M, MergePath<BasePath, P>, I, MergeTypedResponse<R>>, BasePath>;
    <P extends string, R extends HandlerResponse<any> = any, I extends Input = BlankInput>(path: P): Hono<E, S & ToSchema<M, MergePath<BasePath, P>, I, MergeTypedResponse<R>>, BasePath>;
}
export interface MiddlewareHandlerInterface<E extends Env = Env, S extends Schema = BlankSchema, BasePath extends string = '/'> {
    <E2 extends Env = E>(...handlers: MiddlewareHandler<E2, MergePath<BasePath, ExtractKey<S>>>[]): Hono<IntersectNonAnyTypes<[E, E2]>, S, BasePath>;
    <E2 extends Env = E>(handler: MiddlewareHandler<E2, MergePath<BasePath, ExtractKey<S>>>): Hono<IntersectNonAnyTypes<[E, E2]>, S, BasePath>;
    <E2 extends Env = E, E3 extends Env = IntersectNonAnyTypes<[E, E2]>, P extends string = MergePath<BasePath, ExtractKey<S>>>(...handlers: [MiddlewareHandler<E2, P>, MiddlewareHandler<E3, P>]): Hono<IntersectNonAnyTypes<[E, E2, E3]>, S, BasePath>;
    <E2 extends Env = E, E3 extends Env = E, E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>, P extends string = MergePath<BasePath, ExtractKey<S>>>(...handlers: [MiddlewareHandler<E2, P>, MiddlewareHandler<E3, P>, MiddlewareHandler<E4, P>]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4]>, S, BasePath>;
    <E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>, P extends string = MergePath<BasePath, ExtractKey<S>>>(...handlers: [
        MiddlewareHandler<E2, P>,
        MiddlewareHandler<E3, P>,
        MiddlewareHandler<E4, P>,
        MiddlewareHandler<E5, P>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5]>, S, BasePath>;
    <E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>, P extends string = MergePath<BasePath, ExtractKey<S>>>(...handlers: [
        MiddlewareHandler<E2, P>,
        MiddlewareHandler<E3, P>,
        MiddlewareHandler<E4, P>,
        MiddlewareHandler<E5, P>,
        MiddlewareHandler<E6, P>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>, S, BasePath>;
    <E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>, P extends string = MergePath<BasePath, ExtractKey<S>>>(...handlers: [
        MiddlewareHandler<E2, P>,
        MiddlewareHandler<E3, P>,
        MiddlewareHandler<E4, P>,
        MiddlewareHandler<E5, P>,
        MiddlewareHandler<E6, P>,
        MiddlewareHandler<E7, P>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>, S, BasePath>;
    <E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>, P extends string = MergePath<BasePath, ExtractKey<S>>>(...handlers: [
        MiddlewareHandler<E2, P>,
        MiddlewareHandler<E3, P>,
        MiddlewareHandler<E4, P>,
        MiddlewareHandler<E5, P>,
        MiddlewareHandler<E6, P>,
        MiddlewareHandler<E7, P>,
        MiddlewareHandler<E8, P>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>, S, BasePath>;
    <E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = E, E9 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>, P extends string = MergePath<BasePath, ExtractKey<S>>>(...handlers: [
        MiddlewareHandler<E2, P>,
        MiddlewareHandler<E3, P>,
        MiddlewareHandler<E4, P>,
        MiddlewareHandler<E5, P>,
        MiddlewareHandler<E6, P>,
        MiddlewareHandler<E7, P>,
        MiddlewareHandler<E8, P>,
        MiddlewareHandler<E9, P>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>, S, BasePath>;
    <E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = E, E9 extends Env = E, E10 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>, P extends string = MergePath<BasePath, ExtractKey<S>>>(...handlers: [
        MiddlewareHandler<E2, P>,
        MiddlewareHandler<E3, P>,
        MiddlewareHandler<E4, P>,
        MiddlewareHandler<E5, P>,
        MiddlewareHandler<E6, P>,
        MiddlewareHandler<E7, P>,
        MiddlewareHandler<E8, P>,
        MiddlewareHandler<E9, P>,
        MiddlewareHandler<E10, P>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>, S, BasePath>;
    <E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = E, E9 extends Env = E, E10 extends Env = E, E11 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>, P extends string = MergePath<BasePath, ExtractKey<S>>>(...handlers: [
        MiddlewareHandler<E2, P>,
        MiddlewareHandler<E3, P>,
        MiddlewareHandler<E4, P>,
        MiddlewareHandler<E5, P>,
        MiddlewareHandler<E6, P>,
        MiddlewareHandler<E7, P>,
        MiddlewareHandler<E8, P>,
        MiddlewareHandler<E9, P>,
        MiddlewareHandler<E10, P>,
        MiddlewareHandler<E11, P>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11]>, S, BasePath>;
    <P extends string, E2 extends Env = E>(path: P, ...handlers: MiddlewareHandler<E2, MergePath<BasePath, P>>[]): Hono<E, S, BasePath>;
}
export interface OnHandlerInterface<E extends Env = Env, S extends Schema = BlankSchema, BasePath extends string = '/'> {
    <M extends string, P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, E2 extends Env = E>(method: M, path: P, handler: H<E2, MergedPath, I, R>): Hono<IntersectNonAnyTypes<[E, E2]>, S & ToSchema<M, MergePath<BasePath, P>, I, MergeTypedResponse<R>>, BasePath>;
    <M extends string, P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, E2 extends Env = E, E3 extends Env = IntersectNonAnyTypes<[E, E2]>>(method: M, path: P, ...handlers: [H<E2, MergedPath, I>, H<E3, MergedPath, I2, R>]): Hono<IntersectNonAnyTypes<[E, E2, E3]>, S & ToSchema<M, MergePath<BasePath, P>, I2, MergeTypedResponse<R>>, BasePath>;
    <M extends string, P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, E2 extends Env = E, E3 extends Env = E, E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>>(method: M, path: P, ...handlers: [H<E2, MergedPath, I>, H<E3, MergedPath, I2>, H<E4, MergedPath, I3, R>]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4]>, S & ToSchema<M, MergePath<BasePath, P>, I3, MergeTypedResponse<R>>, BasePath>;
    <M extends string, P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>>(method: M, path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5]>, S & ToSchema<M, MergePath<BasePath, P>, I4, MergeTypedResponse<R>>, BasePath>;
    <M extends string, P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>>(method: M, path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>, S & ToSchema<M, MergePath<BasePath, P>, I5, MergeTypedResponse<R>>, BasePath>;
    <M extends string, P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>>(method: M, path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5>,
        H<E7, MergedPath, I6, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>, S & ToSchema<M, MergePath<BasePath, P>, I6, MergeTypedResponse<R>>, BasePath>;
    <M extends string, P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, I7 extends Input = I & I2 & I3 & I4 & I5 & I6, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>>(method: M, path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5>,
        H<E7, MergedPath, I6>,
        H<E8, MergedPath, I7, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>, S & ToSchema<M, MergePath<BasePath, P>, I7, MergeTypedResponse<R>>, BasePath>;
    <M extends string, P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, I7 extends Input = I & I2 & I3 & I4 & I5 & I6, I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = E, E9 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>>(method: M, path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5>,
        H<E7, MergedPath, I6>,
        H<E8, MergedPath, I7>,
        H<E9, MergedPath, I8, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>, S & ToSchema<M, MergePath<BasePath, P>, I8, MergeTypedResponse<R>>, BasePath>;
    <M extends string, P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, I7 extends Input = I & I2 & I3 & I4 & I5 & I6, I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7, I9 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = E, E9 extends Env = E, E10 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>>(method: M, path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5>,
        H<E7, MergedPath, I6>,
        H<E8, MergedPath, I7>,
        H<E9, MergedPath, I8>,
        H<E10, MergedPath, I9, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>, S & ToSchema<M, MergePath<BasePath, P>, I9, MergeTypedResponse<R>>, BasePath>;
    <M extends string, P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, I7 extends Input = I & I2 & I3 & I4 & I5 & I6, I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7, I9 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8, I10 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8 & I9, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = E, E9 extends Env = E, E10 extends Env = E, E11 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>>(method: M, path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5>,
        H<E7, MergedPath, I6>,
        H<E8, MergedPath, I7>,
        H<E9, MergedPath, I8>,
        H<E10, MergedPath, I9>,
        H<E11, MergedPath, I10>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11]>, S & ToSchema<M, MergePath<BasePath, P>, I10, MergeTypedResponse<HandlerResponse<any>>>, BasePath>;
    <M extends string, P extends string, R extends HandlerResponse<any> = any, I extends Input = BlankInput>(method: M, path: P, ...handlers: H<E, MergePath<BasePath, P>, I, R>[]): Hono<E, S & ToSchema<M, MergePath<BasePath, P>, I, MergeTypedResponse<R>>, BasePath>;
    <Ms extends string[], P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, E2 extends Env = E>(methods: Ms, path: P, handler: H<E2, MergedPath, I, R>): Hono<IntersectNonAnyTypes<[E, E2]>, S & ToSchema<Ms[number], MergePath<BasePath, P>, I, MergeTypedResponse<R>>, BasePath>;
    <Ms extends string[], P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, E2 extends Env = E, E3 extends Env = IntersectNonAnyTypes<[E, E2]>>(methods: Ms, path: P, ...handlers: [H<E2, MergedPath, I>, H<E3, MergedPath, I2, R>]): Hono<IntersectNonAnyTypes<[E, E2, E3]>, S & ToSchema<Ms[number], MergePath<BasePath, P>, I2, MergeTypedResponse<R>>, BasePath>;
    <Ms extends string[], P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, E2 extends Env = E, E3 extends Env = E, E4 extends Env = IntersectNonAnyTypes<[E, E2, E3]>>(methods: Ms, path: P, ...handlers: [H<E2, MergedPath, I>, H<E3, MergedPath, I2>, H<E4, MergedPath, I3, R>]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4]>, S & ToSchema<Ms[number], MergePath<BasePath, P>, I3, MergeTypedResponse<R>>, BasePath>;
    <Ms extends string[], P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4]>>(methods: Ms, path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5]>, S & ToSchema<Ms[number], MergePath<BasePath, P>, I4, MergeTypedResponse<R>>, BasePath>;
    <Ms extends string[], P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5]>>(methods: Ms, path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>, S & ToSchema<Ms[number], MergePath<BasePath, P>, I5, MergeTypedResponse<R>>, BasePath>;
    <Ms extends string[], P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6]>>(methods: Ms, path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5>,
        H<E7, MergedPath, I6, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>, S & ToSchema<Ms[number], MergePath<BasePath, P>, I6, MergeTypedResponse<R>>, BasePath>;
    <Ms extends string[], P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, I7 extends Input = I & I2 & I3 & I4 & I5 & I6, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7]>>(methods: Ms, path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5>,
        H<E7, MergedPath, I6>,
        H<E8, MergedPath, I7, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>, S & ToSchema<Ms[number], MergePath<BasePath, P>, I7, MergeTypedResponse<R>>, BasePath>;
    <Ms extends string[], P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, R extends HandlerResponse<any> = any, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, I7 extends Input = I & I2 & I3 & I4 & I5 & I6, I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = E, E9 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8]>>(methods: Ms, path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5>,
        H<E7, MergedPath, I6>,
        H<E8, MergedPath, I7>,
        H<E9, MergedPath, I8, R>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>, S & ToSchema<Ms[number], MergePath<BasePath, P>, I8, MergeTypedResponse<R>>, BasePath>;
    <Ms extends string[], P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, I7 extends Input = I & I2 & I3 & I4 & I5 & I6, I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7, I9 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = E, E9 extends Env = E, E10 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9]>>(methods: Ms, path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5>,
        H<E7, MergedPath, I6>,
        H<E8, MergedPath, I7>,
        H<E9, MergedPath, I8>,
        H<E10, MergedPath, I9>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>, S & ToSchema<Ms[number], MergePath<BasePath, P>, I9, MergeTypedResponse<HandlerResponse<any>>>, BasePath>;
    <Ms extends string[], P extends string, MergedPath extends MergePath<BasePath, P> = MergePath<BasePath, P>, I extends Input = BlankInput, I2 extends Input = I, I3 extends Input = I & I2, I4 extends Input = I & I2 & I3, I5 extends Input = I & I2 & I3 & I4, I6 extends Input = I & I2 & I3 & I4 & I5, I7 extends Input = I & I2 & I3 & I4 & I5 & I6, I8 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7, I9 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8, I10 extends Input = I & I2 & I3 & I4 & I5 & I6 & I7 & I8 & I9, E2 extends Env = E, E3 extends Env = E, E4 extends Env = E, E5 extends Env = E, E6 extends Env = E, E7 extends Env = E, E8 extends Env = E, E9 extends Env = E, E10 extends Env = E, E11 extends Env = IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10]>>(methods: Ms, path: P, ...handlers: [
        H<E2, MergedPath, I>,
        H<E3, MergedPath, I2>,
        H<E4, MergedPath, I3>,
        H<E5, MergedPath, I4>,
        H<E6, MergedPath, I5>,
        H<E7, MergedPath, I6>,
        H<E8, MergedPath, I7>,
        H<E9, MergedPath, I8>,
        H<E10, MergedPath, I9>,
        H<E11, MergedPath, I10>
    ]): Hono<IntersectNonAnyTypes<[E, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11]>, S & ToSchema<Ms[number], MergePath<BasePath, P>, I10, MergeTypedResponse<HandlerResponse<any>>>, BasePath>;
    <P extends string, R extends HandlerResponse<any> = any, I extends Input = BlankInput>(methods: string[], path: P, ...handlers: H<E, MergePath<BasePath, P>, I, R>[]): Hono<E, S & ToSchema<string, MergePath<BasePath, P>, I, MergeTypedResponse<R>>, BasePath>;
    <I extends Input = BlankInput, R extends HandlerResponse<any> = any>(methods: string | string[], paths: string[], ...handlers: H<E, any, I, R>[]): Hono<E, S & ToSchema<string, string, I, MergeTypedResponse<R>>, BasePath>;
}
type ExtractKey<S> = S extends Record<infer Key, unknown> ? Key extends string ? Key : never : string;
export type ToSchema<M extends string, P extends string, I extends Input | Input['in'], RorO> = Simplify<{
    [K in P]: {
        [K2 in M as AddDollar<K2>]: Simplify<{
            input: AddParam<ExtractInput<I>, P>;
        } & (IsAny<RorO> extends true ? {
            output: {};
            outputFormat: ResponseFormat;
            status: StatusCode;
        } : RorO extends TypedResponse<infer T, infer U, infer F> ? {
            output: unknown extends T ? {} : T;
            outputFormat: I extends {
                outputFormat: string;
            } ? I['outputFormat'] : F;
            status: U;
        } : {
            output: unknown extends RorO ? {} : RorO;
            outputFormat: unknown extends RorO ? 'json' : I extends {
                outputFormat: string;
            } ? I['outputFormat'] : 'json';
            status: StatusCode;
        })>;
    };
}>;
export type Schema = {
    [Path: string]: {
        [Method: `$${Lowercase<string>}`]: Endpoint;
    };
};
export type Endpoint = {
    input: Partial<ValidationTargets>;
    output: any;
    outputFormat: ResponseFormat;
    status: StatusCode;
};
type ExtractParams<Path extends string> = string extends Path ? Record<string, string> : Path extends `${infer _Start}:${infer Param}/${infer Rest}` ? {
    [K in Param | keyof ExtractParams<`/${Rest}`>]: string;
} : Path extends `${infer _Start}:${infer Param}` ? {
    [K in Param]: string;
} : never;
type FlattenIfIntersect<T> = T extends infer O ? {
    [K in keyof O]: O[K];
} : never;
export type MergeSchemaPath<OrigSchema extends Schema, SubPath extends string> = Simplify<{
    [P in keyof OrigSchema as MergePath<SubPath, P & string>]: {
        [M in keyof OrigSchema[P]]: MergeEndpointParamsWithPath<OrigSchema[P][M], SubPath>;
    };
}>;
type MergeEndpointParamsWithPath<T, SubPath extends string> = T extends {
    input: infer Input;
    output: infer Output;
    outputFormat: infer OutputFormat;
    status: infer Status;
} ? {
    input: Input extends {
        param: infer _;
    } ? ExtractParams<SubPath> extends never ? Input : FlattenIfIntersect<Input & {
        param: {
            [K in keyof ExtractParams<SubPath> as K extends `${infer Prefix}{${infer _}}` ? Prefix : K]: string;
        };
    }> : RemoveBlankRecord<ExtractParams<SubPath>> extends never ? Input : Input & {
        param: {
            [K in keyof ExtractParams<SubPath> as K extends `${infer Prefix}{${infer _}}` ? Prefix : K]: string;
        };
    };
    output: Output;
    outputFormat: OutputFormat;
    status: Status;
} : never;
export type AddParam<I, P extends string> = ParamKeys<P> extends never ? I : I extends {
    param: infer _;
} ? I : I & {
    param: UnionToIntersection<ParamKeyToRecord<ParamKeys<P>>>;
};
type AddDollar<T extends string> = `$${Lowercase<T>}`;
export type MergePath<A extends string, B extends string> = B extends '' ? MergePath<A, '/'> : A extends '' ? B : A extends '/' ? B : A extends `${infer P}/` ? B extends `/${infer Q}` ? `${P}/${Q}` : `${P}/${B}` : B extends `/${infer Q}` ? Q extends '' ? A : `${A}/${Q}` : `${A}/${B}`;
export type KnownResponseFormat = 'json' | 'text' | 'redirect';
export type ResponseFormat = KnownResponseFormat | string;
export type TypedResponse<T = unknown, U extends StatusCode = StatusCode, F extends ResponseFormat = T extends string ? 'text' : T extends JSONValue ? 'json' : ResponseFormat> = {
    _data: T;
    _status: U;
    _format: F;
};
type MergeTypedResponse<T> = T extends Promise<infer T2> ? T2 extends TypedResponse ? T2 : TypedResponse : T extends TypedResponse ? T : TypedResponse;
export type ValidationTargets = {
    json: any;
    form: Record<string, string | File>;
    query: Record<string, string | string[]>;
    param: Record<string, string> | Record<string, string | undefined>;
    header: Record<string, string>;
    cookie: Record<string, string>;
};
type ParamKeyName<NameWithPattern> = NameWithPattern extends `${infer Name}{${infer Rest}` ? Rest extends `${infer _Pattern}?` ? `${Name}?` : Name : NameWithPattern;
type ParamKey<Component> = Component extends `:${infer NameWithPattern}` ? ParamKeyName<NameWithPattern> : never;
export type ParamKeys<Path> = Path extends `${infer Component}/${infer Rest}` ? ParamKey<Component> | ParamKeys<Rest> : ParamKey<Path>;
export type ParamKeyToRecord<T extends string> = T extends `${infer R}?` ? Record<R, string | undefined> : {
    [K in T]: string;
};
export type InputToDataByTarget<T extends Input['out'], Target extends keyof ValidationTargets> = T extends {
    [K in Target]: infer R;
} ? R : never;
export type RemoveQuestion<T> = T extends `${infer R}?` ? R : T;
export type ExtractSchema<T> = UnionToIntersection<T extends Hono<infer _, infer S, any> ? S : never>;
type EnvOrEmpty<T> = T extends Env ? (Env extends T ? {} : T) : T;
type IntersectNonAnyTypes<T extends any[]> = T extends [infer Head, ...infer Rest] ? IfAnyThenEmptyObject<EnvOrEmpty<Head>> & IntersectNonAnyTypes<Rest> : {};
export declare abstract class FetchEventLike {
    abstract readonly request: Request;
    abstract respondWith(promise: Response | Promise<Response>): void;
    abstract passThroughOnException(): void;
    abstract waitUntil(promise: Promise<void>): void;
}
export {};
