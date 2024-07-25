"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._batchValues = void 0;
/**
 * Split `array` into batches `T[][]` of specified size.
 *
 * @example
 * _batchValues<number>([1,2,3,4,5,6,7,8], 3) => [[1,2,3],[4,5,6],[7,8]]
 *
 * @param array  Batch values
 * @param batchSize  Batch size `x > 0`.
 * @returns `<T = any>[][]`
 */
const _batchValues = (array, batchSize) => {
    if (!(Number.isInteger(batchSize) && batchSize > 0))
        throw new Error('Invalid batch size.');
    const items = array.slice(0), _buffer = [];
    while (items.length)
        _buffer.push(items.splice(0, batchSize));
    return _buffer;
};
exports._batchValues = _batchValues;
//# sourceMappingURL=_batch.js.map