/**
 * EventEmitter constructor
 */
export const EventEmitter = function(this: any){
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
} as any;

/**
 * Backwards-compat with node 0.10.x
 */
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

/**
 * By default EventEmitters will print a warning if more than 10 listeners are added to it.
 * This is a useful default which helps finding memory leaks.
 */
EventEmitter.defaultMaxListeners = 10;

/**
 * Set max listeners
 * - Obviously not all Emitters should be limited to 10.
 * - This function allows that to be increased. Set to zero for unlimited.
 * 
 * @param {Number} n  Integer max count
 * @returns {EventEmitter}  Instance
 */
EventEmitter.prototype.setMaxListeners = function(n: number){
	if (!(!isNaN(n) && Number.isInteger(n) && n >= 0)) throw TypeError('Set max listeners value (n) must be a positive integer.');
  this._maxListeners = n;
  return this;
};

/**
 * Emit event
 * 
 * @param {*} type  Event type
 * @param {...*} args  Event handler callback arguments
 * @returns {Boolean}  Dispatched
 */
EventEmitter.prototype.emit = function(type: any){
  let er, handler, len, args, i, listeners;
  if (!this._events) this._events = {};

  //If there is no 'error' event listener then throw.
  if (type === 'error'){
    if (!this._events.error || (isObject(this._events.error) && !this._events.error.length)){
      er = arguments[1];
      if (er instanceof Error) throw er; // Unhandled 'error' event
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }
  handler = this._events[type];
  if (isUndefined(handler)) return false;
  if (isFunction(handler)){
    switch (arguments.length){
      
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;

      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++) args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  }
  else if (isObject(handler)){
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++) args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++) listeners[i].apply(this, args);
  }
  return true;
};

/**
 * Add listener
 * 
 * @param {*} type  Event type
 * @param {Function} listener  Event handler
 * @returns {EventEmitter}  Instance
 */
EventEmitter.prototype.addListener = function(type: any, listener: any){
  if (!isType(type)) throw TypeError('Add event type must not be null or undefined.');
  if (!isFunction(listener)) throw TypeError('Add event listener must be a function.');
  if (!this._events) this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener) this.emit('newListener', type, isFunction(listener.listener) ? listener.listener : listener);
  
  // Optimize the case of one listener. Don't need the extra array object.
  if (!this._events[type]) this._events[type] = listener;
  
  // If we've already got an array, just append.
  else if (isObject(this._events[type])) this._events[type].push(listener);
  
  // Adding the second element, need to change to array.
  else this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned){
    let m = !isUndefined(this._maxListeners) ? this._maxListeners : EventEmitter.defaultMaxListeners;
    if (m && m > 0 && this._events[type].length > m){
      this._events[type].warned = true;
      let err = '(node) warning: possible EventEmitter memory leak detected. '
      + '%d listeners added. Use emitter.setMaxListeners() to increase limit.';
      console.error(err, this._events[type].length);
    }
  }
  return this;
};

/**
 * Add listener
 * 
 * @param {*} type  Event type
 * @param {Function} listener  Event handler
 * @returns {EventEmitter}  Instance
 */
EventEmitter.prototype.on = EventEmitter.prototype.addListener;

/**
 * Add one time listener
 * 
 * @param {*} type  Event type
 * @param {Function} listener  Event handler
 * @returns {EventEmitter}  Instance
 */
EventEmitter.prototype.once = function(type: any, listener: (...args: any)=>void){
  if (!isType(type)) throw TypeError('Once event type must not be null or undefined.');
  if (!isFunction(listener)) throw TypeError('Once event listener must be a function.');
  let fired = false;
  function g(this: any, ...args: any){
    this.removeListener(type, g);
    if (!fired){
      fired = true;
      listener.apply(this, args);
    }
  }
  g.listener = listener;
  this.on(type, g);
  return this;
};

/**
 * Remove listener ~ emits a 'removeListener' event if the listener was removed
 * 
 * @param {*} type  Event type
 * @param {Function} listener  Event handler
 * @returns {EventEmitter}  Instance
 */
EventEmitter.prototype.removeListener = function(type: any, listener: (...args: any)=>void){
  let list, position, length, i;
	if (!isType(type)) throw TypeError('Remove event type must not be null or undefined.');
  if (!isFunction(listener)) throw TypeError('Remove event listener must be a function.');
  if (!this._events || !this._events[type]) return this;
  list = this._events[type];
  length = list.length;
  position = -1;
  if (list === listener || (isFunction(list.listener) && list.listener === listener)){
    delete this._events[type];
    if (this._events.removeListener) this.emit('removeListener', type, listener);
  }
  else if (isObject(list)){
    for (i = length; i-- > 0;){
      if (list[i] === listener || (list[i].listener && list[i].listener === listener)){
        position = i;
        break;
      }
    }
    if (position < 0) return this;
    if (list.length === 1){
      list.length = 0;
      delete this._events[type];
    }
    else list.splice(position, 1);
    if (this._events.removeListener) this.emit('removeListener', type, listener);
  }
  return this;
};

/**
 * Remove all listeners
 * 
 * @param {*} type  Event type
 * @returns {EventEmitter}  Instance
 */
EventEmitter.prototype.removeAllListeners = function(type: any){
  let key, listeners;
  if (!this._events) return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener){
    if (arguments.length === 0) this._events = {};
    else if (this._events[type]) delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0){
    for (key in this._events){
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }
  listeners = this._events[type];
  if (isFunction(listeners)) this.removeListener(type, listeners);
  else {
    // LIFO order
    while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];
  return this;
};

/**
 * Get event listeners
 * 
 * @param {*} type  Event type
 * @returns {Function[]}  Handlers
 */
EventEmitter.prototype.listeners = function(type: any){
  let ret;
  if (!this._events || !this._events[type]) ret = [];
  else if (isFunction(this._events[type])) ret = [this._events[type]];
  else ret = this._events[type].slice();
  return ret;
};

/**
 * Get event listener count
 * 
 * @param {EventEmitter} emitter  EventEmitter instance
 * @param {*} type  Event type
 * @returns {Number}  Int count (>=0)
 */
EventEmitter.listenerCount = function(emitter: any, type: any){
  let ret;
  if (!emitter._events || !emitter._events[type]) ret = 0;
  else if (isFunction(emitter._events[type])) ret = 1;
  else ret = emitter._events[type].length;
  return ret;
};

/**
 * Add event subscriber
 * 
 * @param {*} type  Event type
 * @param {Function} listener  Event handler
 * @returns {unsubscribe<(()=>void)>}  Unsubscribe function
 */
EventEmitter.prototype.subscribe = function(type: any, listener: (...args: any)=>void){
	if (!isType(type)) throw TypeError('Subscribe event type must not be null or undefined.');
  if (!isFunction(listener)) throw TypeError('Subscribe event listener must be a function.');
	const _type = type;
	const _listener = (...args: any) => listener(...args);
	this.addListener(_type, _listener);
	return () => {
		this.removeListener(_type, _listener);
	};
};

/**
 * Validate type
 * 
 * @param {*} arg
 * @returns {Boolean}
 */
function isType(arg: any): boolean {
  return arg !== null && arg !== undefined;
}

/**
 * Validate function
 * 
 * @param {*} arg
 * @returns {Boolean}
 */
function isFunction(arg: any): boolean {
  return typeof arg === 'function';
}

/**
 * Validate function
 * 
 * @param {*} arg
 * @returns {Boolean}
 */
function isNumber(arg: any): boolean {
  return typeof arg === 'number';
}

/**
 * Validate object
 * 
 * @param {*} arg
 * @returns {Boolean}
 */
function isObject(arg: any): boolean{
  return typeof arg === 'object' && arg !== null;
}

/**
 * Validate undefined
 * 
 * @param {*} arg
 * @returns {Boolean}
 */
function isUndefined(arg: any): boolean{
  return arg === void 0;
}