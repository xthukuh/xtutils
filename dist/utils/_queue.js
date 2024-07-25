"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._queue = void 0;
/**
 * Create queue object
 *
 * @returns `IQueue`
 */
const _queue = () => {
    const items = {};
    let head = 0;
    let tail = 0;
    return {
        get count() {
            return tail;
        },
        get length() {
            return tail - head;
        },
        get isEmpty() {
            return this.length === 0;
        },
        enqueue(value) {
            items[tail] = value;
            tail++;
        },
        dequeue() {
            const item = items[head];
            delete items[head];
            head++;
            return item;
        },
        peek() {
            return items[head];
        },
        values() {
            return Object.values(items);
        },
    };
};
exports._queue = _queue;
//# sourceMappingURL=_queue.js.map