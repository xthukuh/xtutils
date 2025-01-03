"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._clone = void 0;
/**
 * Clone value
 *
 * @param value
 * @returns copy
 */
const _clone = (value) => clone(value, new Map());
exports._clone = _clone;
/**
 * Nano clone (https://github.com/Kelin2025/nanoclone.git)
 *
 * @param src
 * @param seen
 */
function clone(src, seen) {
    // Immutable things - null, undefined, functions, symbols, etc.
    if (!src || typeof src !== 'object')
        return src;
    // Things we've seen already (circular refs)
    if (seen.has(src))
        return seen.get(src);
    // Basic pattern for cloning something below here is:
    // 1. Create copy
    // 2. Add it to `seen` immediately, so we recognize it if we see it in
    //    subordinate members
    // 3. clone subordinate members
    let copy;
    // DOM Node
    if (src.nodeType && 'cloneNode' in src) {
        copy = src.cloneNode(true);
        seen.set(src, copy);
    }
    // Date
    else if (src instanceof Date) {
        copy = new Date(src.getTime());
        seen.set(src, copy);
    }
    // RegExp
    else if (src instanceof RegExp) {
        copy = new RegExp(src);
        seen.set(src, copy);
    }
    // Array
    else if (Array.isArray(src)) {
        copy = new Array(src.length);
        seen.set(src, copy);
        for (let i = 0; i < src.length; i++)
            copy[i] = clone(src[i], seen);
    }
    // Map
    else if (src instanceof Map) {
        copy = new Map();
        seen.set(src, copy);
        for (const [k, v] of src.entries())
            copy.set(k, clone(v, seen));
    }
    // Set
    else if (src instanceof Set) {
        copy = new Set();
        seen.set(src, copy);
        for (const v of src)
            copy.add(clone(v, new Map()));
    }
    // Object
    else if (src instanceof Object) {
        copy = {};
        seen.set(src, copy);
        for (const [k, v] of Object.entries(src))
            copy[k] = clone(v, seen);
    }
    // Unrecognized thing.  It's better to throw here than to return `src`, as
    // we don't know whether src needs to be deep-copied here.
    else {
        const error = `Unable to clone ${src}`;
        console.warn('[_clone] Error: ' + error, src);
        throw Error(error);
    }
    //result
    return copy;
}
//# sourceMappingURL=_clone.js.map