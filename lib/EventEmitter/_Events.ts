import { EventEmitter } from './_EventEmitter';

const em = new EventEmitter();
em.setMaxListeners(0);

/**
 * Global event emitter
 */
export const Events = {
	emit: em.emit,
	addListener: em.addListener,
	on: em.on,
	once: em.once,
	removeListener: em.removeListener,
	removeAllListeners: em.removeAllListeners,
	listeners: em.listeners,
	subscribe: em.subscribe
};