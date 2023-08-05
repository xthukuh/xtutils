/**
 * Emitted event interface
 */
export interface IEventEmitter {
	maxListeners: number;
	listeners: (type: string) => ((event?:IEmittedEvent)=>void)[];
	hasListener: (type: string, listener: ((event?:IEmittedEvent)=>void)) => boolean;
	emit: (type: string, data?: any) => boolean;
	on: (type: string, listener: ((event?:IEmittedEvent)=>void), once: boolean) => EventEmitter;
	once: (type: string, listener: ((event?:IEmittedEvent)=>void)) => EventEmitter;
	subscribe: (type: string, listener: ((event?:IEmittedEvent)=>void)) => ()=>void;
	addListener: (type: string, listener: ((event?:IEmittedEvent)=>void), once: boolean) => EventEmitter;
	removeListener: (type: string, listener: ((event?:IEmittedEvent)=>void)) => EventEmitter;
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
 * Default max listener count
 */
let DEFAULT_MAX_LISTENERS: number = 10;

/**
 * Private props `Symbol` key name
 */
const PROPS = Symbol(`__private_props_${Date.now()}__`);

/**
 * @class EventEmitter
 */
export class EventEmitter implements IEventEmitter
{
	/**
	 * Get/set default max listeners count
	 * - warns if exceeded (helps find memory leaks)
	 */
	static get defaultMaxListeners(): number {
		return DEFAULT_MAX_LISTENERS;
	}
	static set defaultMaxListeners(value: any){
		DEFAULT_MAX_LISTENERS = !isNaN(value = parseInt(value)) && Number.isInteger(value) && value >= 1 ? value : 10;
	}

	/**
	 * Instance "private" props
	 */
	[PROPS]: {
		_events: {[type: string]: any};
		_maxListeners: number;
	} = {} as any;

	/**
	 * Get/set max listeners count (default: `0`)
	 * - Positive integer `number`
	 * - Set to zero for unlimited
	 */
	get maxListeners(): number {
		return this[PROPS]._maxListeners;
	}
	set maxListeners(value: any){
		const val = parseInt(value);
		if (!isNaN(val) && Number.isInteger(val) && val >= 0) this[PROPS]._maxListeners = value;
		else console.warn('Set max listeners value must be a positive integer! Set to zero for unlimited.', {value});
	}

	/**
	 * Create new instance
	 */
	constructor(){
		this[PROPS] = {
			_events: {},
			_maxListeners: 0,
		};
	}

	/**
	 * Get valid event type
	 * 
	 * @param type - event type/name
	 * @param throwable - enable throwing error when type is invalid
	 * @returns `string` lowercase event name ~ `''` on error
	 */
	static type(type: any, throwable: boolean = false): string {
		let _type: string = '';
		if (!('string' === typeof type && (_type = type.trim()))){
			const error = 'Invalid event type.';
			console.warn(error, {type});
			if (throwable) throw new TypeError(error);
		}
		return _type;
	}

	/**
	 * Get valid event listener callback function.
	 * 
	 * @param listener - event listener
	 * @param throwable - enable throwing error when listener is invalid 
	 * @returns `(event?:IEmittedEvent)=>void` event handler | `undefined` on error
	 */
	static listener(listener: ((event?:IEmittedEvent)=>void), throwable: boolean = false): ((event?:IEmittedEvent)=>void)|undefined {
		let _listener: ((event?:IEmittedEvent)=>void)|undefined;
		if ('function' === typeof listener) _listener = listener;
		else {
			const error = 'Invalid event listener callback function.';
			console.warn(error, {listener});
			if (throwable) throw new TypeError(error);
		}
		return _listener;
	}

	/**
	 * Get event listeners
	 * 
	 * @param type - event type/name
	 * @returns `((event?:IEmittedEvent)=>void)[]` event handlers
	 */
	listeners(type: string): ((event?:IEmittedEvent)=>void)[] {
		const props = this[PROPS], listeners: ((event?:IEmittedEvent)=>void)[] = [];
		if (!((type = EventEmitter.type(type)) && props._events.hasOwnProperty(type))){
			const listener: any = props._events[type];
			if ('function' === typeof listener) listeners.push(listener);
			else if (Array.isArray(listener) && listener.length) listeners.push(...listener.filter(v => 'function' === typeof v));
		}
		return listeners;
	}

	/**
	 * Check if event listener exists
	 * 
	 * @param type - event type/name
	 * @param listener - event listener
	 * @returns `((event?:IEmittedEvent)=>void)[]` event handlers
	 */
	hasListener(type: string, listener: ((event?:IEmittedEvent)=>void)): boolean {
		return this.listeners(type).findIndex(v => v === listener) > -1;
	}

	/**
	 * Emit event
	 * 
	 * @param type - event type/name
	 * @param data - event data
	 * @returns `boolean` caught
	 */
	emit(type: string, data?: any): boolean {
		const event = {type, data, time: Date.now()};
		const listeners = this.listeners(type = EventEmitter.type(type, true));
		if (listeners.length){
			listeners.forEach(fn => fn.call(this, event));
			return true;
		}
		else if (type === 'error'){
			if (data instanceof Error) throw data;
			const error = 'Uncaught, unspecified "error" event.';
			console.warn(error, {event});
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
	on(type: string, listener: ((event?:IEmittedEvent)=>void), once: boolean = false): EventEmitter {
		return this.addListener(type, listener, once);
	}
	
	/**
	 * Add one time event listener ~ emits 'newListener' event if added
	 * 
	 * @param type - event type/name
	 * @param listener - event listener callback function
	 * @returns `EventEmitter` - `this` instance
	 */
	once(type: string, listener: ((event?:IEmittedEvent)=>void)): EventEmitter {
		return this.addListener(type, listener, true);
	}

	/**
	 * Add event subscriber
	 * 
	 * @param type - event type/name
	 * @param listener - event callback handler
	 * @returns `(()=>void)` unsubscribe callback
	 */
	subscribe(type: string, listener: ((event?:IEmittedEvent)=>void)): ()=>void {
		type = EventEmitter.type(type, true);
		listener = EventEmitter.listener(listener, true) as ((event?:IEmittedEvent)=>void);
		this.addListener(type, listener);
		return (): void => void this.removeListener(type, listener);
	}

	/**
	 * Add event listener ~ emits 'newListener' event if added
	 * 
	 * @param type - event type/name
	 * @param listener - event listener callback function
	 * @param once - one time callback
	 * @returns `EventEmitter` - `this` instance
	 */
	addListener(type: string, listener: ((event?:IEmittedEvent)=>void), once: boolean = false): EventEmitter {
		type = EventEmitter.type(type, true);
		let handler = (listener = EventEmitter.listener(listener, true) as ((event?:IEmittedEvent)=>void));

		//one time listener
		if (once){
			let fired: boolean = false;
			handler = (event?: IEmittedEvent): void => {
				if (fired) return;
				fired = true;
				listener.call(this, event);
				this.removeListener(type, handler);
			};
		}
		
		//Add event listener if new
		const listeners = this.listeners(type);
		if (listeners.findIndex(v => v === handler) < 0){
			const props = this[PROPS];
			
			// To avoid recursion in the case that type === "newListener"! Before
  		// adding it to the listeners, first emit "newListener".
			if (props._events.newListener) this.emit('newListener', {type, handler});

			// Optimize the case of one listener. don't need the extra array object.
			props._events[type] = listeners.length ? [...listeners, handler] : handler;
			
			// Max listeners leak warning
			if (Array.isArray(props._events[type])){
				const len = props._events[type].length;
				const max = 'number' === typeof props._maxListeners ? props._maxListeners : DEFAULT_MAX_LISTENERS;
				if ('number' === typeof max && max > 0 && len > max){
					console.error(`EventEmitter possible memory leak detected - ${len} "${type}" event listeners added, max is ${max}. Use \`emitter.maxListeners = number;\` to increase limit.`);
				}
			}
		}
		
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
	removeListener(type: string, listener: ((event?:IEmittedEvent)=>void)): EventEmitter {
		if (!(type = EventEmitter.type(type))) return this;
		const props = this[PROPS];
		if (!(props._events.hasOwnProperty(type))) return this;
		let removed: boolean = false;
		if (Array.isArray(props._events[type])){
			const _listeners = props._events[type] as ((event?:IEmittedEvent)=>void)[];
			const index = _listeners.findIndex(v => v === listener);
			_listeners.splice(index, 1);
			removed = true;
		}
		else if (props._events[type] === listener){
			delete props._events[type];
			removed = true;
		}
		if (removed){
			if (!this.listeners(type).length) delete props._events[type];
			if (props._events.removeListener) this.emit('removeListener', {type, listener});
		}
		return this;
	}

	/**
	 * Remove all listeners ~ emits 'removeListener' event for each removed listener
	 * 
	 * @param type - event type/name 
	 * @returns `EventEmitter` - `this` instance
	 */
	removeAllListeners(type: string): EventEmitter {
		if (!(type = EventEmitter.type(type))) return this;
		const props = this[PROPS];
		if (!(props._events.hasOwnProperty(type))) return this;
		const emit_remove_listener = type !== 'removeListener' && props._events.removeListener;
		const listeners = emit_remove_listener ? this.listeners(type) : [];
		delete props._events[type];
		if (emit_remove_listener && listeners.length) listeners.forEach(listener => this.emit('removeListener', {type, listener}));
		return this;
	}
}