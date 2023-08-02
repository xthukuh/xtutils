/**
 * Create progress tracker
 *
 * @param onProgress - item progress callback listener `0-100`
 * @param places - decimal places for calculations [default: `2`]
 * @returns object `{get size, add, get, set, update, complete, percent, done}`
 */
export declare const _progressTracker: (onProgress: (percent: number) => void, places?: number) => {
    /**
     * Getter - progress items count
     */
    size: number;
    /**
     * Add progress item
     * - % progress = `(value/total * 100)`
     *
     * @param name - item name
     * @param total - item total value (max value - positive `number`) [default: `100`]
     * @param onProgress - item progress callback listener `0-100`
     * @returns `number` items count
     * @throws Invalid name `Error`
     */
    add: (name: string, total: number, onProgress?: ((percent: number) => void) | undefined) => number;
    /**
     * Get progress item
     * - % progress = `(value/total * 100)`
     *
     * @param name - item name
     * @returns `{name: string, value: number, total: number, progress: number, complete: boolean, total_progress: number, total_complete: boolean}` | `undefined` if name doesn't exist
     * @throws Invalid name `Error`
     */
    get: (name: string) => {
        name: string;
        value: number;
        total: number;
        progress: number;
        complete: boolean;
        total_progress: number;
        total_complete: boolean;
    } | undefined;
    /**
     * Set item progress
     * - triggers progress callback
     * - value = `(progress/100 * total)`
     *
     * @param name - item name
     * @param progress - item progress (set current percent - `0-100`)
     * @returns `number` item progress % | `undefined` if name doesn't exist
     */
    set: (name: string, progress: number) => number | undefined;
    /**
     * Update progress item value
     * - triggers progress callback
     * - progress = `(value/total * 100)`
     *
     * @param name - item name
     * @param value - item value (set current value - positive `number` 0 - total max value)
     * @returns `number` item progress % | `undefined` if name doesn't exist
     */
    update: (name: string, value: number) => number | undefined;
    /**
     * Set progress as complete
     * - triggers progress callback
     * - completed items ignore future updates
     * - progress = `100`, value = `(progress/100 * total)`
     *
     * @param name - item name (sets all as complete if blank)
     * @returns `number` total progress % | `undefined` if name doesn't exist
     */
    complete: (name?: string) => number | undefined;
    /**
     * Get progress percentage
     *
     * @param name - item name (returns total progress if blank)
     * @returns `number` item/total progress % | `undefined` if name doesn't exist
     */
    progress: (name?: string) => number | undefined;
    /**
     * Get progress complete
     *
     * @param name - item name (returns total complete if blank)
     * @returns `boolean` is complete | `undefined` if name doesn't exist
     */
    done: (name?: string) => boolean | undefined;
};
