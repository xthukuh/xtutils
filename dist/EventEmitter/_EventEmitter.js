"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = void 0;
/**
 * Default max listener count
 */
let DEFAULT_MAX_LISTENERS = 10;
/**
 * Private props `Symbol` key name
 */
const PROPS = Symbol(`__private_props_${Date.now()}__`);
/**
 * @class EventEmitter
 */
class EventEmitter {
    /**
     * EventEmitter global max listeners
     * - warns if exceeded (helps find memory leaks)
     */
    static get max_listeners() {
        return DEFAULT_MAX_LISTENERS;
    }
    static set max_listeners(value) {
        DEFAULT_MAX_LISTENERS = !isNaN(value = parseInt(value)) && Number.isInteger(value) && value >= 1 ? value : 10;
    }
    /**
     * Instance "private" props
     */
    [PROPS] = {};
    /**
     * Max listeners count (default: `undefiend` ~ `EventEmitter.max_listeners`)
     * - Accepts positive integer `number`
     * - Set to zero for unlimited
     */
    get max_listeners() {
        return this[PROPS]._max_listeners;
    }
    set max_listeners(value) {
        this[PROPS]._max_listeners = !isNaN(value = parseInt(value)) && Number.isInteger(value) && value >= 0 ? value : EventEmitter.max_listeners;
    }
    /**
     * Create new instance
     */
    constructor() {
        this[PROPS] = {
            _events: {},
            _max_listeners: undefined,
        };
    }
    /**
     * Get valid event type
     *
     * @param type - event type/name
     * @param throwable - enable throwing error when type is invalid
     * @returns `string` lowercase event name ~ `''` on error
     */
    static type(type, throwable = false) {
        let _type = '';
        if (!('string' === typeof type && (_type = type.trim()))) {
            const error = 'Invalid event type.';
            console.warn(error, { type });
            if (throwable)
                throw new TypeError(error);
        }
        return _type;
    }
    /**
     * Get valid event listener callback function.
     *
     * @param listener - event listener
     * @param throwable - enable throwing error when listener is invalid
     * @returns `(event:IEvent)=>void` event handler | `undefined` on error
     */
    static listener(listener, throwable = false) {
        let _listener;
        if ('function' === typeof listener)
            _listener = listener;
        else {
            const error = 'Invalid event listener callback function.';
            console.warn(error, { listener });
            if (throwable)
                throw new TypeError(error);
        }
        return _listener;
    }
    /**
     * Get event listeners
     *
     * @param type - event type/name
     * @returns `((event:IEvent)=>void)[]` event handlers
     */
    listeners(type) {
        const props = this[PROPS], listeners = [];
        if ((type = EventEmitter.type(type)) && props._events.hasOwnProperty(type)) {
            const listener = props._events[type];
            if ('function' === typeof listener)
                listeners.push(listener);
            else if (Array.isArray(listener) && listener.length) {
                for (const val of listener) {
                    if ('function' === typeof val)
                        listeners.push(val);
                }
            }
        }
        return listeners;
    }
    /**
     * Check if event listener exists
     *
     * @param type - event type/name
     * @param listener - event listener
     * @returns `((event:IEvent)=>void)[]` event handlers
     */
    hasListener(type, listener) {
        return this.listeners(type).findIndex(v => v === listener) > -1;
    }
    /**
     * Emit event
     *
     * @param type - event type/name
     * @param data - event data
     * @returns `boolean` caught
     */
    emit(type, data) {
        const event = { type, data, time: Date.now() };
        const listeners = this.listeners(type = EventEmitter.type(type, true));
        if (listeners.length) {
            for (const fn of listeners)
                fn.call(this, event);
            return true;
        }
        else if (type === 'error') {
            if (data instanceof Error)
                throw data;
            const error = 'Uncaught, unspecified "error" event.';
            console.warn(error, { event });
            throw new Error(error);
        }
        return false;
    }
    /**
     * Add event listener ~ emits 'newListener' event if added (alias `emitter.addListener`)
     *
     * @param type - event type/name
     * @param listener - event listener callback function
     * @param once - one time callback
     * @returns `EventEmitter` - `this` instance
     */
    on(type, listener, once = false) {
        return this.addListener(type, listener, once);
    }
    /**
     * Add one time event listener ~ emits 'newListener' event if added
     *
     * @param type - event type/name
     * @param listener - event listener callback function
     * @returns `EventEmitter` - `this` instance
     */
    once(type, listener) {
        return this.addListener(type, listener, true);
    }
    /**
     * Add event subscriber
     *
     * @param type - event type/name
     * @param listener - event callback handler
     * @returns `(()=>void)` unsubscribe callback
     */
    subscribe(type, listener) {
        type = EventEmitter.type(type, true);
        listener = EventEmitter.listener(listener, true);
        this.addListener(type, listener);
        return () => void this.removeListener(type, listener);
    }
    /**
     * Add event listener ~ emits 'newListener' event if added
     *
     * @param type - event type/name
     * @param listener - event listener callback function
     * @param once - one time callback
     * @returns `EventEmitter` - `this` instance
     */
    addListener(type, listener, once = false) {
        type = EventEmitter.type(type, true);
        let handler = (listener = EventEmitter.listener(listener, true));
        //one time listener
        if (once) {
            let fired = false;
            handler = (event) => {
                if (fired)
                    return;
                fired = true;
                listener.call(this, event);
                this.removeListener(type, handler);
            };
        }
        //Add event listener if new
        const listeners = this.listeners(type);
        if (listeners.findIndex(v => v === handler) < 0) {
            const props = this[PROPS];
            // To avoid recursion in the case that type === "newListener"! Before
            // adding it to the listeners, first emit "newListener".
            if (props._events.newListener)
                this.emit('newListener', { type, handler });
            // Optimize the case of one listener. don't need the extra array object.
            props._events[type] = listeners.length ? [...listeners, handler] : handler;
            // Max listeners leak warning
            if (Array.isArray(props._events[type])) {
                const len = props._events[type].length;
                const max = 'number' === typeof props._max_listeners ? props._max_listeners : EventEmitter.max_listeners;
                if ('number' === typeof max && max > 0 && len > max) {
                    console.error(`EventEmitter possible memory leak detected - ${len} "${type}" event listeners added, max count is ${max}.`);
                }
            }
        }
        else
            console.warn(`This "${type}" event listener is already added.`);
        //result
        return this;
    }
    /**
     * Remove event listener ~ emits 'removeListener' event if removed
     *
     * @param type - event type/name
     * @param listener - event listener callback function
     * @returns `EventEmitter` - `this` instance
     */
    removeListener(type, listener) {
        if (!(type = EventEmitter.type(type)))
            return this;
        const props = this[PROPS];
        if (!(props._events.hasOwnProperty(type)))
            return this;
        let removed = false;
        if (Array.isArray(props._events[type])) {
            const _listeners = props._events[type];
            const index = _listeners.findIndex(v => v === listener);
            _listeners.splice(index, 1);
            removed = true;
        }
        else if (props._events[type] === listener) {
            delete props._events[type];
            removed = true;
        }
        if (removed) {
            if (!this.listeners(type).length)
                delete props._events[type];
            if (props._events.removeListener)
                this.emit('removeListener', { type, listener });
        }
        return this;
    }
    /**
     * Remove all listeners ~ emits 'removeListener' event for each removed listener
     *
     * @param type - event type/name
     * @returns `EventEmitter` - `this` instance
     */
    removeAllListeners(type) {
        if (!(type = EventEmitter.type(type)))
            return this;
        const props = this[PROPS];
        if (!(props._events.hasOwnProperty(type)))
            return this;
        const emit_remove_listener = type !== 'removeListener' && props._events.removeListener;
        const listeners = emit_remove_listener ? this.listeners(type) : [];
        delete props._events[type];
        if (emit_remove_listener && listeners.length) {
            for (const listener of listeners)
                this.emit('removeListener', { type, listener });
        }
        return this;
    }
}
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=_EventEmitter.js.map