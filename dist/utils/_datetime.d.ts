/**
 * Date time locales
 */
export declare const DateLocales: {
    monthNames: string[];
    dayNames: string[];
    AM: string;
    PM: string;
};
/**
 * Parse `Date` value ~ does not accept `[undefined, null, 0, '']`
 *
 * @param value - parse date value
 * @returns
 * - `Date` value instance
 * - `undefined` when invalid
 */
export declare const _date: (value: any) => Date | undefined;
/**
 * Get parsed `Date` value time milliseconds (i.e. `date.getTime()`)
 *
 * @param value - parse date value
 * @param min - set `min` timestamp limit ~ enabled when `min` is a valid timestamp integer
 * @param max - set `max` timestamp limit ~ enabled when `max` is a valid timestamp integer
 * @returns
 * - `number` timestamp milliseconds
 * - `undefined` when invalid
 */
export declare const _time: (value: any, min?: number, max?: number) => number | undefined;
/**
 * Validate `Date` instance
 *
 * @param value
 * @returns `boolean`
 */
export declare const _isDate: (value: any) => boolean;
/**
 * Parse `Date` value to `datetime` format (i.e. `2023-05-27 22:11:57` ~ `YYYY-MM-DD HH:mm:ss`)
 *
 * @param value - parse date value
 * @returns
 * - `string` ~ formatted `YYYY-MM-DD HH:mm:ss`
 * - `''` when date value is invalid
 */
export declare const _datetime: (value: any) => string;
/**
 * Parse ISO formatted date value to milliseconds timestamp
 * - borrowed from https://github.com/jquense/yup/blob/1ee9b21c994b4293f3ab338119dc17ab2f4e284c/src/util/parseIsoDate.ts
 *
 * @param value - ISO date `string` (i.e. `'2022-12-19T13:12:42.000+0000'`/`'2022-12-19T13:12:42.000Z'` => `1671455562000`)
 * @returns
 * - `number` milliseconds timestamp
 * - `undefined` when invalid
 */
export declare const _parseIso: (value: string) => number | undefined;
