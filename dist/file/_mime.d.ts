/**
 * File extension mime types
 */
export declare const EXT_MIMES: {
    [ext: string]: string;
};
/**
 * Mime type object interface
 */
export interface IMimeType {
    value: any;
    type: string;
    ext: string;
    error: string;
    /**
     * Get mime text
     *
     * @param prop - text value prop
     * @returns `string`
     */
    toString: (
    /**
     * Specify text value prop (default `'type'`)
     */
    prop?: 'type' | 'ext' | 'error') => string;
}
/**
 * Basename error interface
 */
export interface IMimeTypeError extends Error {
    name: string;
    item: IMimeType;
}
/**
 * Get normalized file mime type (i.e. 'application/json; charset=utf-8' => 'application/json')
 *
 * @param  string	$value	- Parse value (mime|ext|file-path)
 * @param  string	$ext		- ByRef file extension (i.e. 'txt', 'png')
 * @param  string	$error	- ByRef error message
 * @return string|false
 */
export declare const _mime: (value: any, _failure?: 0 | 1 | 2) => IMimeType;
