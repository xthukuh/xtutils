/**
 * Exception error interface
 */
export interface IExceptionError {
    /**
     * Error message (default: `'Unspecified exception message.'`)
     */
    message: string;
    /**
     * Error name (default: `'Exception'`)
     */
    name: string;
    /**
     * Error code - `string` | finite/parsed `integer` (default: `0`)
     */
    code: string | number;
    /**
     * Error data
     */
    data: any;
    /**
     * Get error string
     *
     * @returns `{name}: {message}` | `{name}[{code}]: {message}`
     */
    toString: () => string;
}
/**
 * `Symbol` private props key name
 */
declare const PRIVATE: unique symbol;
/**
 * `Exception` extends `Error` ~ like `DOMException`
 *
 * - message: `string`
 * - name: `string`
 * - code: `number`
 * - toString: `()=>string`
 */
export declare class Exception extends Error implements IExceptionError {
    /**
     * Private props
     */
    [PRIVATE]: {
        message: string;
        name: string;
        code: string | number;
        data: any;
    };
    /**
     * Error message (default: `'Unspecified exception message.'`)
     */
    get message(): string;
    /**
     * Error name (default: `'Exception'`)
     */
    get name(): string;
    /**
     * Error code - `string` | finite/parsed `integer` (default: `0`)
     */
    get code(): string | number;
    /**
     * Error data
     */
    get data(): any;
    /**
     * New `IExceptionError` instance
     *
     * @param message  Error message (default: `'Unspecified exception message.'`)
     * @param name  Error name (default: `'Exception'`)
     * @param code  Error code - `string` | finite/parsed `integer` (default: `0`)
     * @param data  Error data
     */
    constructor(message?: string, name?: string, code?: string | number, data?: any);
    /**
     * Get error `string`
     */
    toString(): string;
    /**
     * Create new `IExceptionError` instance
     *
     * @param message  Error message (default: `'Unspecified exception message.'`)
     * @param name  Error name (default: `'Exception'`)
     * @param code  Error code - `string` | finite/parsed `integer` (default: `0`)
     * @param data  Error data
     */
    static error(message?: string, name?: string, code?: number, data?: any): IExceptionError;
}
export {};
