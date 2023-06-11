/**
 * Term format result interface
 */
export interface ITermFormat {
    format: (formats: string | string[], ...args: any[]) => ITermFormat;
    values: (...args: any[]) => any[];
    clear: (...args: any[]) => any[];
    log: (message?: any, ...optionalParams: any[]) => void;
    debug: (message?: any, ...optionalParams: any[]) => void;
    warn: (message?: any, ...optionalParams: any[]) => void;
    error: (message?: any, ...optionalParams: any[]) => void;
    info: (message?: any, ...optionalParams: any[]) => void;
}
/**
 * Term `console.*` logger
 */
export declare class Term {
    /**
     * Disable formats
     */
    static DISABLED: boolean;
    /**
     * Text formats
     */
    static FORMATS: {
        [key: string]: string;
    };
    /**
     * Predefined text formats
     */
    static PREDEFINED_FORMATS: {
        [key: string]: string | string[];
    };
    /**
     * Get standardized text formats
     *
     * @param formats Text format(s)
     * @returns `string[]`
     */
    static getFormats(formats: string | string[]): string[];
    /**
     * Text format log arguments
     *
     * @param formats  Text format(s)
     * @param args  Format values
     * @returns `ITermFormat`
     */
    static format(formats: string | string[], ...args: any): ITermFormat;
    /**
     * Clear text value formatting
     *
     * @param args  Formatted values
     * @returns `any[]` Clear values
     */
    static clear(...args: any[]): any[];
    /**
     * Get formatted text
     *
     * @param value  Text value
     * @param formats  Text format(s)
     * @returns `string` Formatted
     */
    static text(value: string, formats?: string | string[]): string;
    /**
     * Log `console.log` format
     *
     * @param args
     */
    static log(...args: any[]): void;
    /**
     * Debug `console.debug` format
     *
     * @param args
     */
    static debug(...args: any[]): void;
    /**
     * Error `console.error` format
     *
     * @param args
     */
    static error(...args: any[]): void;
    /**
     * Warn `console.warn` format
     *
     * @param args
     */
    static warn(...args: any): void;
    /**
     * Info `console.info` format
     *
     * @param args
     */
    static info(...args: any): void;
    /**
     * Success `console.log` format
     *
     * @param args
     */
    static success(...args: any): void;
    /**
     * Get value list
     *
     * @param value
     * @param _entries
     */
    static list(value: any, _entries?: boolean): [list: any[], type: 'values' | 'entries'];
    /**
     * Custom `console.table` logger
     *
     * @param data
     * @param cellMaxLength
     */
    static table(data: any, cellMaxLength?: number, divider?: boolean): void;
}
