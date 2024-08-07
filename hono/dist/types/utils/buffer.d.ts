/**
 * @module
 * Buffer utility.
 */
export declare const equal: (a: ArrayBuffer, b: ArrayBuffer) => boolean;
export declare const timingSafeEqual: (a: string | object | boolean, b: string | object | boolean, hashFunction?: Function) => Promise<boolean>;
export declare const bufferToString: (buffer: ArrayBuffer) => string;
export declare const bufferToFormData: (arrayBuffer: ArrayBuffer, contentType: string) => Promise<FormData>;
