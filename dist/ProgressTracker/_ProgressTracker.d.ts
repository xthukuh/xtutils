/**
 * Progress item status type
 */
export type ProgressTrackerStatus = 'new' | 'running' | 'stopped' | 'failed' | 'done';
/**
 * Item progress interface
 * TODO: implement IProgressTrackerItem, IProgressTracker
 */
export interface IProgressTrackerItem {
    name: string;
    range: {
        min: number;
        max: number;
    };
    value: number;
    progress: number;
    status: ProgressTrackerStatus;
    time: {
        start: number;
        stop: number;
        elapsed: number;
    };
    error: string;
    data: any;
}
/**
 * Item progress interface
 */
export interface IItemProgress {
    name: string;
    total: number;
    value: number;
    progress: number;
    complete: boolean;
    status?: string;
    error?: string;
    total_progress?: number;
    total_complete?: boolean;
    onProgress?: (percent: number) => void;
}
/**
 * Private props `Symbol` key name
 */
declare const PRIVATE: unique symbol;
/**
 * @class Process Tracker
 */
export declare class ProgressTracker {
    /**
     * Private props
     */
    [PRIVATE]: {
        current: {
            [key: string]: number;
        };
        total_progress: number;
        total_complete: boolean;
        update_progress: boolean;
        ITEMS: Map<string, IItemProgress>;
        places: number;
        onItemsProgress: ((percent: number) => void) | undefined;
        _pos_num: (val: any) => number;
        _listener: (fn: any) => ((percent: number) => void) | undefined;
        _update: () => void;
    };
    /**
     * Progress items list
     */
    get list(): Readonly<IItemProgress>[];
    /**
     * Progress items count
     */
    get size(): number;
    /**
     * Create new instance
     *
     * @param onProgress - item progress callback listener `0-100`
     * @param places - decimal places for calculations [default: `2`]
     * @returns object `{get size, add, get, set, update, complete, percent, done}`
     */
    constructor(onProgress: (percent: number) => void, places?: number);
    /**
     * Add progress item
     * - % progress = `(value/total * 100)`
     *
     * @param name - item name
     * @param total - item total value (max value - positive `number`) [default: `100`]
     * @param onProgress - item progress callback listener `0-100`
     * @returns `number` items count
     * @throws `TypeError` on invalid name
     */
    add(name: string, total: number, onProgress?: (percent: number) => void): number;
    /**
     * Get progress item
     * - % progress = `(value/total * 100)`
     *
     * @param name - item name
     * @returns `{name: string, value: number, total: number, progress: number, complete: boolean, total_progress: number, total_complete: boolean}` | `undefined` if name doesn't exist
     * @throws `TypeError` on invalid name
     */
    get(name: string): IItemProgress | undefined;
    /**
     * Set item progress
     * - triggers progress callback
     * - value = `(progress/100 * total)`
     *
     * @param name - item name
     * @param progress - item progress (set current percent - `0-100`)
     * @returns `number` item progress % | `undefined` if name doesn't exist
     */
    set(name: string, progress: number): number | undefined;
    /**
     * Update progress item value
     * - triggers progress callback
     * - progress = `(value/total * 100)`
     *
     * @param name - item name
     * @param value - item value (set current value - positive `number` 0 - total max value)
     * @returns `number` item progress % | `undefined` if name doesn't exist
     */
    update(name: string, value: number): number | undefined;
    /**
     * Set progress as complete
     * - triggers progress callback
     * - completed items ignore future updates
     * - progress = `100`, value = `(progress/100 * total)`
     *
     * @param name - item name (sets all as complete if blank)
     * @returns `number` total progress % | `undefined` if name doesn't exist
     */
    complete(name?: string): number | undefined;
    /**
     * Get progress percentage
     *
     * @param name - item name (returns total progress if blank)
     * @returns `number` item/total progress % | `undefined` if name doesn't exist
     */
    progress(name?: string): number | undefined;
    /**
     * Get progress complete
     *
     * @param name - item name (returns total complete if blank)
     * @returns `boolean` is complete | `undefined` if name doesn't exist
     */
    done(name?: string): boolean | undefined;
}
export {};
