/**
 * @module
 * Types utility.
 */
export type Expect<T extends true> = T;
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
export type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true;
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type RemoveBlankRecord<T> = T extends Record<infer K, unknown> ? K extends string ? T : never : never;
export type IfAnyThenEmptyObject<T> = 0 extends 1 & T ? {} : T;
export type JSONPrimitive = string | boolean | number | null | undefined;
export type JSONArray = (JSONPrimitive | JSONObject | JSONArray)[];
export type JSONObject = {
    [key: string]: JSONPrimitive | JSONArray | JSONObject | object;
};
export type JSONValue = JSONObject | JSONArray | JSONPrimitive;
export type JSONParsed<T> = T extends {
    toJSON(): infer J;
} ? (() => J) extends () => JSONObject ? J : JSONParsed<J> : T extends JSONPrimitive ? T : T extends Array<infer U> ? Array<JSONParsed<U>> : T extends object ? {
    [K in keyof T]: JSONParsed<T[K]>;
} : never;
/**
 * Useful to flatten the type output to improve type hints shown in editors. And also to transform an interface into a type to aide with assignability.
 * @copyright from sindresorhus/type-fest
 */
export type Simplify<T> = {
    [KeyType in keyof T]: T[KeyType];
} & {};
/**
 * A simple extension of Simplify that will deeply traverse array elements.
 */
export type SimplifyDeepArray<T> = T extends any[] ? {
    [E in keyof T]: SimplifyDeepArray<T[E]>;
} : Simplify<T>;
export type InterfaceToType<T> = T extends Function ? T : {
    [K in keyof T]: InterfaceToType<T[K]>;
};
export type RequiredKeysOf<BaseType extends object> = Exclude<{
    [Key in keyof BaseType]: BaseType extends Record<Key, BaseType[Key]> ? Key : never;
}[keyof BaseType], undefined>;
export type HasRequiredKeys<BaseType extends object> = RequiredKeysOf<BaseType> extends never ? false : true;
export type IsAny<T> = boolean extends (T extends never ? true : false) ? true : false;
