/**
 * Color Utils - [ported from color-string](https://github.com/Qix-/color-string)
 */
/**
 * Color value type
 */
export type TColorValue = [number, number, number, number];
/**
 * Color model type
 */
type TColorFormat = 'rgb' | 'hsl' | 'hwb';
/**
 * Color to converter interface
 */
export interface IColorTo {
    hex: () => string;
    hexl: () => string;
    rgb: () => string;
    rgba: () => string;
    rgb_percent: () => string;
    rgba_percent: () => string;
    hsl: () => string;
    hsla: () => string;
    hwb: () => string;
    hwba: () => string;
    keyword: () => string;
}
/**
 * Static color to converter interface
 */
export interface IStaticColorTo {
    hex: (...args: any[]) => string;
    hexl: (...args: any[]) => string;
    rgb: (...args: any[]) => string;
    rgba: (...args: any[]) => string;
    rgb_percent: (...args: any[]) => string;
    rgba_percent: (...args: any[]) => string;
    hsl: (...args: any[]) => string;
    hsla: (...args: any[]) => string;
    hwb: (...args: any[]) => string;
    hwba: (...args: any[]) => string;
    keyword: (...args: any[]) => string;
}
/**
 * Color class interface
 */
export interface IColor {
    value: TColorValue;
    format: TColorFormat;
    to: IColorTo;
    normalizeAlpha: () => IColor;
    toString: () => string;
}
/**
 * Color parse from interface
 */
export interface IStaticColorFrom {
    rgb: (str: string) => IColor | null;
    hsl: (str: string) => IColor | null;
    hwb: (str: string) => IColor | null;
    value: (...args: any[]) => IColor | null;
}
/**
 * `Color` props symbol
 */
declare const _props: unique symbol;
/**
 * @class Color parser and converter
 */
export declare class Color implements IColor {
    /**
     * Color parser props
     */
    [_props]: {
        value: TColorValue;
        format: TColorFormat;
    };
    /**
     * Parsed color array value
     */
    get value(): TColorValue;
    /**
     * Parsed color format
     */
    get format(): TColorFormat;
    /**
     * Create new color parser instance
     *
     * @param value - parse value
     * @param format - parse format
     * @returns `IColor` ~ `Color` instance
     * @throws `TypeError`
     */
    constructor(value: any, format?: TColorFormat);
    /**
     * Normalize alpha value
     */
    normalizeAlpha(): IColor;
    /**
     * Convert color to `string` (RGB)
     */
    toString(): string;
    /**
     * Color to converter
     */
    get to(): IColorTo;
    /**
     * Static color value to converter
     */
    static get to(): IStaticColorTo;
    /**
     * Parse color value from
     */
    static get from(): IStaticColorFrom;
    /**
     * Parse color value
     *
     * @param value - parse value ~ accepts `string` or `array` _(i.e. `TColorValue`)_ color value
     * @param format - parse format (default: `rgb`)
     * @returns `IColor` ~ `Color` instance or `null`
     */
    static parse(value: any, format?: TColorFormat): IColor | null;
}
/**
 * `Color<IColor>` class constructor interface
 */
export interface IColorConstructor {
    parse: (value: any, format?: TColorFormat) => IColor | null;
    from: IStaticColorFrom;
    to: IStaticColorTo;
}
export {};
