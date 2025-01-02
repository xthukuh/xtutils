/// <reference types="node" />
/**
 * RC4 encrypt/decrypt text value
 *
 * @param text - parse text
 * @param key - cypher key (default: `'alohomora'`)
 * @returns `string`
 */
export declare function _rc4(input: any, pass?: string): Buffer | string;
