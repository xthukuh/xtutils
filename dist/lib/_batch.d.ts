/**
 * Split `array` into batches `T[][]` of specified size.
 * - i.e. `_batchValues<number>([1,2,3,4,5,6,7,8], 3)` => `[[1,2,3],[4,5,6],[7,8]]`
 *
 * @param array  Batch values
 * @param batchSize  Batch size `x > 0`.
 * @returns  `T[][]`
 */
export declare const _batchValues: <T extends unknown>(array: T[], batchSize: number) => T[][];
