import { bool } from '../types';
/**
 * Check if value is numeric
 *
 * @param value  Parse value
 * @param booleans  Pass `boolean` values as numeric
 * @param blanks  Pass empty `string` values (because `!isNaN('') === true`)
 * @returns `boolean` is numeric
 */
export declare const _isNum: (value: any, booleans?: bool, blanks?: bool) => boolean;
/**
 * Convert value to normalized number
 *
 * - Blank trimmed `string` value is considered `NaN` (i.e. "")
 *
 * @param value  Parse value
 * @param _default  [default: `NaN`] Default result when parse result is `NaN`
 * @param fixFloat  [default: `true`] Whether to fix float zeros (i.e. `1.1/100` = `0.011000000000000001` => `0.011`)
 * @returns `number` parsed
 */
export declare const _toNum: (value: any, _default?: number, fixFloat?: bool) => number;
/**
 * Parse value to number (shorthand)
 *
 * @param value  Parse value
 * @param _default  [default: `NaN`] Default result when parse result is `NaN`
 * @returns `number` parsed
 */
export declare const _num: (value: any, _default?: number) => number;
/**
 * Parse value to integer
 *
 * @param value  Parse value
 * @param _default  [default: `NaN`] Default result when parse result is `NaN`
 * @returns `number` integer
 */
export declare const _int: (value: any, _default?: number) => number;
/**
 * Round number to decimal places
 *
 * @param value  Parse value
 * @param places  [default: `2`] Decimal places
 * @returns `number` rounded
 */
export declare const _round: (value: number, places?: number) => number;
/**
 * Convert numeric value to comma thousand delimited string (i.e. `1000.4567` => `'1,000.45'`)
 *
 * @param value  Parse value
 * @param places  [default: `2`] Round decimal places
 * @param zeros  Enable trailing `'0'` decimal places (i.e. `1000` => `'1,000.00'`)
 * @returns `string` Comma thousand delimited number (returns `""` if parsed `value` is `NaN`)
 */
export declare const _commas: (value: any, places?: number, zeros?: bool) => string;
/**
 * Generate random `integer` number.
 *
 * @param min  Min `integer`
 * @param max  Max `integer`
 * @returns  `number` Random `integer`
 */
export declare const _rand: (min: number, max: number) => number;
/**
 * Convert px to rem (or reverse)
 *
 * @param val - convert value [default: `1`]
 * @param reverse - convert rem to px
 * @param base - root px [default: `16`]
 * @returns `number`
 */
export declare const _px2rem: (val?: number, reverse?: boolean, base?: number) => number;
