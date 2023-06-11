"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._batchValues = void 0;
/**
 * Split `array` into batches `T[][]` of specified size.
 * - i.e. `_batchValues<number>([1,2,3,4,5,6,7,8], 3)` => `[[1,2,3],[4,5,6],[7,8]]`
 *
 * @param array  Batch values
 * @param batchSize  Batch size `x > 0`.
 * @returns  `T[][]`
 */
const _batchValues = (array, batchSize) => {
    if (!(Number.isInteger(batchSize) && batchSize > 0))
        throw new Error('Invalid batch size.');
    const _array = array.slice(0), _buffer = [];
    while (_array.length)
        _buffer.push(_array.splice(0, batchSize));
    return _buffer;
};
exports._batchValues = _batchValues;
