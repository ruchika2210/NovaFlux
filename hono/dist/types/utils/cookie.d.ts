/**
 * @module
 * Cookie utility.
 */
export type Cookie = Record<string, string>;
export type SignedCookie = Record<string, string | false>;
type PartitionCookieConstraint = {
    partition: true;
    secure: true;
} | {
    partition?: boolean;
    secure?: boolean;
};
type SecureCookieConstraint = {
    secure: true;
};
type HostCookieConstraint = {
    secure: true;
    path: '/';
    domain?: undefined;
};
export type CookieOptions = {
    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    secure?: boolean;
    signingSecret?: string;
    sameSite?: 'Strict' | 'Lax' | 'None' | 'strict' | 'lax' | 'none';
    partitioned?: boolean;
    prefix?: CookiePrefixOptions;
} & PartitionCookieConstraint;
export type CookiePrefixOptions = 'host' | 'secure';
export type CookieConstraint<Name> = Name extends `__Secure-${string}` ? CookieOptions & SecureCookieConstraint : Name extends `__Host-${string}` ? CookieOptions & HostCookieConstraint : CookieOptions;
export declare const parse: (cookie: string, name?: string) => Cookie;
export declare const parseSigned: (cookie: string, secret: string | BufferSource, name?: string) => Promise<SignedCookie>;
export declare const serialize: <Name extends string>(name: Name, value: string, opt?: CookieConstraint<Name> | undefined) => string;
export declare const serializeSigned: (name: string, value: string, secret: string | BufferSource, opt?: CookieOptions) => Promise<string>;
export {};
