/**
 * Emitted event interface
 */
export interface IEventEmitter {
    maxListeners: number;
    listeners: (type: string) => ((event?: IEmittedEvent) => void)[];
    hasListener: (type: string, listener: ((event?: IEmittedEvent) => void)) => boolean;
    emit: (type: string, data?: any) => boolean;
    on: (type: string, listener: ((event?: IEmittedEvent) => void), once: boolean) => EventEmitter;
    once: (type: string, listener: ((event?: IEmittedEvent) => void)) => EventEmitter;
    subscribe: (type: string, listener: ((event?: IEmittedEvent) => void)) => () => void;
    addListener: (type: string, listener: ((event?: IEmittedEvent) => void), once: boolean) => EventEmitter;
    removeListener: (type: string, listener: ((event?: IEmittedEvent) => void)) => EventEmitter;
    removeAllListeners: (type: string) => EventEmitter;
}
/**
 * Emitted event interface
 */
export interface IEmittedEvent {
    type: string;
    data: any;
    time: number;
}
/**
 * Private props `Symbol` key name
 */
declare const PROPS: unique symbol;
/**
 * @class EventEmitter
 */
export declare class EventEmitter implements IEventEmitter {
    /**
     * Get/set default max listeners count
     * - warns if exceeded (helps find memory leaks)
     */
    static get defaultMaxListeners(): number;
    static set defaultMaxListeners(value: any);
    /**
     * Instance "private" props
     */
    [PROPS]: {
        _events: {
            [type: string]: any;
        };
        _maxListeners: number;
    };
    /**
     * Get/set max listeners count (default: `0`)
     * - Positive integer `number`
     * - Set to zero for unlimited
     */
    get maxListeners(): number;
    set maxListeners(value: any);
    /**
     * Create new instance
     */
    constructor();
    /**
     * Get valid event type
     *
     * @param type - event type/name
     * @param throwable - enable throwing error when type is invalid
     * @returns `string` lowercase event name ~ `''` on error
     */
    static type(type: any, throwable?: boolean): string;
    /**
     * Get valid event listener callback function.
     *
     * @param listener - event listener
     * @param throwable - enable throwing error when listener is invalid
     * @returns `(event?:IEmittedEvent)=>void` event handler | `undefined` on error
     */
    static listener(listener: ((event?: IEmittedEvent) => void), throwable?: boolean): ((event?: IEmittedEvent) => void) | undefined;
    /**
     * Get event listeners
     *
     * @param type - event type/name
     * @returns `((event?:IEmittedEvent)=>void)[]` event handlers
     */
    listeners(type: string): ((event?: IEmittedEvent) => void)[];
    /**
     * Check if event listener exists
     *
     * @param type - event type/name
     * @param listener - event listener
     * @returns `((event?:IEmittedEvent)=>void)[]` event handlers
     */
    hasListener(type: string, listener: ((event?: IEmittedEvent) => void)): boolean;
    /**
     * Emit event
     *
     * @param type - event type/name
     * @param data - event data
     * @returns `boolean` caught
     */
    emit(type: string, data?: any): boolean;
    /**
     * Add event listener ~ emits 'newListener' event if added (alias `emitter.addListener`)
     *
     * @param type - event type/name
     * @param listener - event listener callback function
     * @param once - one time callback
     * @returns `EventEmitter` - `this` instance
     */
    on(type: string, listener: ((event?: IEmittedEvent) => void), once?: boolean): EventEmitter;
    /**
     * Add one time event listener ~ emits 'newListener' event if added
     *
     * @param type - event type/name
     * @param listener - event listener callback function
     * @returns `EventEmitter` - `this` instance
     */
    once(type: string, listener: ((event?: IEmittedEvent) => void)): EventEmitter;
    /**
     * Add event subscriber
     *
     * @param type - event type/name
     * @param listener - event callback handler
     * @returns `(()=>void)` unsubscribe callback
     */
    subscribe(type: string, listener: ((event?: IEmittedEvent) => void)): () => void;
    /**
     * Add event listener ~ emits 'newListener' event if added
     *
     * @param type - event type/name
     * @param listener - event listener callback function
     * @param once - one time callback
     * @returns `EventEmitter` - `this` instance
     */
    addListener(type: string, listener: ((event?: IEmittedEvent) => void), once?: boolean): EventEmitter;
    /**
     * Remove event listener ~ emits 'removeListener' event if removed
     *
     * @param type - event type/name
     * @param listener - event listener callback function
     * @returns `EventEmitter` - `this` instance
     */
    removeListener(type: string, listener: ((event?: IEmittedEvent) => void)): EventEmitter;
    /**
     * Remove all listeners ~ emits 'removeListener' event for each removed listener
     *
     * @param type - event type/name
     * @returns `EventEmitter` - `this` instance
     */
    removeAllListeners(type: string): EventEmitter;
}
export {};
