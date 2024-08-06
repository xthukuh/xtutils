/**
 * Easing function type
 */
export type TEasingFunction = (progress: number) => number;
/**
 * Easing functions dictionary type
 */
export type TEasing = {
    [key: string]: TEasingFunction;
};
/**
 * Easing functions dictionary key type
 */
export type TEasingKey = keyof TEasing;
/**
 * Easing functions dictionary
 */
export declare const Easing: TEasing;
/**
 * Tween easing calculation
 *
 * @example
 * _tween('linear', 200, 0, 1, 1000) //0.2
 *
 * @param name - easing name
 * @param time - current time (or position) of the tween
 * @param begin - beginning value of the property being animated
 * @param change - change in value of the property being animated
 * @param duration - total duration of the tween
 * @returns - calculated value at the current time.
 */
export declare const _tween: (name: TEasingKey, time: number, begin: number, change: number, duration: number) => number;
