import { _isFunc, _num, _posInt } from '../utils';
import { TEasingFunction, TEasingKey, Easing } from './_easing_functions';
import { requestAnimationFrame, cancelAnimationFrame } from './_polyfill';

/**
 * Options for configuring an animation.
 */
export interface IAnimateOptions {

	/**
	 * Function called to update the animation.
	 *
	 * @param {Object} value - The current state of the animation.
	 * @param {number} value.index - The current frame index of the animation.
	 * @param {number} value.delta - The change in position from the last frame.
	 * @param {number} value.pos - The current position of the animation.
	 * @param {number} value.time - The current time of the animation.
	 * @returns {void|false} - Return false to stop the animation.
	 */
	update: (value: { index: number; delta: number; pos: number; time: number; }) => void | false;

	/**
	 * Function called before the animation starts.
	 *
	 * @param {Object} value - The initial state before the animation starts.
	 * @param {number} value.timestamp - The timestamp when the animation is about to start.
	 * @param {any} value.options - The options provided to the animation.
	 * @param {number} value.then - The initial time offset.
	 * @returns {void|false} - Return false to prevent the animation from starting.
	 */
	before?: (value: { timestamp: number; options: any; then: number; }) => void | false;

	/**
	 * Function called after the animation ends.
	 *
	 * @param {Object} value - The final state after the animation ends.
	 * @param {boolean} value.aborted - Indicates if the animation was aborted.
	 * @param {undefined|'abort'|'update'|'begin'|'timeout'} value.abort_method - The method used to abort the animation, if applicable.
	 * @param {boolean} value.complete - Indicates if the animation completed successfully.
	 * @param {number} value.pause_duration - The total duration of any pauses during the animation.
	 * @param {number} value.total_duration - The total duration of the animation.
	 * @returns {void}
	 */
	after?: (value: { aborted: boolean; abort_method: undefined | 'abort' | 'update' | 'begin' | 'timeout'; complete: boolean; pause_duration: number; total_duration: number; }) => void;

	/**
	 * The easing function or key to use for the animation.
	 */
	easing: TEasingKey | TEasingFunction;

	/**
	 * The duration of the animation in milliseconds.
	 */
	duration: number;

	/**
	 * The delay before the animation starts in milliseconds.
	 */
	delay?: number;

	/**
	 * Indicates if the animation is delayed.
	 */
	delayed?: boolean;

	/**
	 * The initial position of the animation.
	 */
	from?: number;

	/**
	 * The final position of the animation.
	 */
	to?: number;

	/**
	 * The timeout for the animation in milliseconds.
	 */
	timeout?: number;

	/**
	 * Indicates if the animation plays automatically.
	 */
	autoplay?: boolean;
}


/**
 * Interface representing an animation with various control methods and state properties.
 */
export interface IAnimation {

	/**
	 * Indicates whether debug mode is enabled.
	 */
	_debug: boolean;

	/**
	 * Indicates whether the animation has begun.
	 */
	begun: boolean;

	/**
	 * Indicates whether the animation is currently paused.
	 */
	paused: boolean;

	/**
	 * Indicates whether the animation is completed.
	 */
	done: boolean;

	/**
	 * Starts or restarts the animation.
	 *
	 * @param {boolean} [restart=false] - If true, restarts the animation from the beginning.
	 * @returns {boolean} - Returns true if the animation starts successfully.
	 */
	play: (restart?: boolean) => boolean;

	/**
	 * Pauses the animation.
	 *
	 * @param {boolean} [toggle=true] - If true, toggles the pause state.
	 * @returns {boolean} - Returns true if the animation is paused successfully.
	 */
	pause: (toggle?: boolean) => boolean;

	/**
	 * Resumes the animation from a paused state.
	 *
	 * @returns {boolean} - Returns true if the animation resumes successfully.
	 */
	resume: () => boolean;

	/**
	 * Restarts the animation from the beginning.
	 *
	 * @returns {boolean} - Returns true if the animation restarts successfully.
	 */
	restart: () => boolean;

	/**
	 * Reset the animation.
	 *
	 * @returns {boolean} - Returns true if the animation is reset successfully.
	 */
	reset: () => boolean;

	/**
	 * Aborts the animation.
	 *
	 * @returns {boolean} - Returns true if the animation is aborted successfully.
	 */
	abort: () => boolean;
}

/**
 * The default easing function used in animations.
 */
export const ANIMATE_DEFAULT_EASING: TEasingFunction = Easing.linear;

/**
 * The default duration for animations, in milliseconds.
 */
export const ANIMATE_DEFAULT_DURATION: number = 1000;

/**
 * Animates an object based on the provided options.
 * 
 * @param options - `IAnimateOptions` config
 * @param _debug - debug mode _[default: `false`]_
 * @returns `IAnimation` animation control object
 */
export function _animate(this: any, options: IAnimateOptions, _debug: boolean = false): IAnimation {
	let {
		update: _update,
		before: _before,
		after: _after,
		easing: _easing = ANIMATE_DEFAULT_EASING,
		duration: _duration = 1000,
		delay: _delay,
		delayed: _delayed = false,
		from: _from,
		to: _to,
		timeout: _timeout,
		autoplay: _autoplay = false,
	} = Object(options);
	const self = this;
	const context = 'object' === typeof self && self ? self : null;
	const update = _isFunc(_update) ? _update : undefined;
	const before = _isFunc(_before) ? _before : undefined;
	const after = _isFunc(_after) ? _after : undefined;
	const easing: TEasingFunction = (()=>{
		if ('string' === typeof _easing && Easing.hasOwnProperty(_easing)) _easing = Easing[_easing];
		return 'function' === typeof _easing ? _easing : ANIMATE_DEFAULT_EASING;
	})();
	const duration = _posInt(_duration, 0) ?? ANIMATE_DEFAULT_DURATION;
	const delay = _posInt(_delay, 0) ?? 0;
	const delayed = Boolean(_delayed);
	const autoplay = Boolean(_autoplay);
	const timeout = _posInt(_timeout, 0) ?? 0;
	const from = _num(_from, 0);
	const to = _num(_to, 0);
	const diff = to - from;

	let id: number|undefined = undefined;
	let start: number|undefined = undefined;
	let is_done: number|undefined = undefined;
	let is_paused: boolean|undefined = undefined;
	let prev: number|undefined = undefined;
	let t: number|undefined = undefined;
	let d: number = 0;
	let p: number = 0;
	let pt: number = 0;
	let et: number = 0;
	let elapsed: number = 0;
	let index: number = -1;
	let then: number = Date.now();

	//reset
	const reset = (): boolean => {
		if (t) clearTimeout(t);
		if (id) cancelAnimationFrame(id);
		id = t = start = is_done = is_paused = prev = undefined;
		d = p = et = pt = elapsed = 0;
		index = -1;
		then = new Date().getTime();
		if (_debug) console.debug('[_animate] reset.');
		return !is_done;
	};

	//frame
	const frame = (time: number): void => {
		if (time === prev || is_done) return;
		prev = time;
		index += 1;
		let delta = !duration ? 0 : easing.call(context, time/duration*1)||0;
		let pos = 0;
		if (diff){
			pos = delta * Math.abs(diff);
			pos = from + (pos * (diff < 0 ? -1 : 1));
		}
		let res = 'function' === typeof update ? update.call(context, {index, delta, pos, time}) : undefined;
		if (time >= duration) is_done = 1;
		else if (res === false) is_done = -1;
	};

	//finish
	const finish = (timestamp: number): void => {
		if (t) clearTimeout(t);
		if (pt){
			p += (timestamp - pt);
			pt = 0;
		}
		let pause_duration = p;
		let total_duration = Math.max(Date.now() - then, elapsed + et);
		let abort_method: undefined|'abort'|'update'|'begin'|'timeout';
		let aborted: boolean = false;
		let complete: boolean = !aborted;
		if (is_done && is_done < 0){
			aborted = true;
			switch (is_done) {
				case -1:
					abort_method = 'update';
					break;
				case -2:
					abort_method = 'begin';
					break;
				case -4:
					abort_method = 'timeout';
					break;
				default:
					abort_method = 'abort';
					break;
			}
		}
		if (after) after.call(context, {aborted, abort_method, complete, pause_duration, total_duration});
		id = undefined;
	};

	//begin
	const begin = (timestamp: number): void => {
		if (timeout) t = setTimeout(() => (is_done = -4), timeout) as any;
		if (before){
			let res = before.call(context, {timestamp, options, then});
			if (res === false) is_done = -2;
		}
	};

	//step
	const step = (timestamp: number): void => {
		if (start === undefined) begin(timestamp);
		if (!start) start = timestamp;
		elapsed = (timestamp - start) + et;
		if (is_done) return finish(timestamp);
		if (is_paused){
			id = undefined;
			et = elapsed;
			pt = timestamp;
			start = 0;
			elapsed = 0;
			return;
		}
		else if (pt){
			p += (timestamp - pt);
			pt = 0;
		}
		if (!d || (d - +elapsed.toFixed(2)) <= 0.1){
			if (!(!elapsed && delayed)) frame(Math.min(+elapsed.toFixed(1), d ? d : duration));
			d += delay;
		}
		if (!is_done && elapsed >= duration) is_done = 1;
		if (is_done) return finish(timestamp);
		else id = requestAnimationFrame(step);
	};

	//abort
	const abort = (): boolean => {
		if (is_done) return false;
		is_done = -3;
		return true;
	};

	//play
	const play = (restart: boolean = false): boolean => {
		if (_debug) console.debug(`[_animate] ${is_paused ? 'resume' : 'play'}.`, {restart, is_paused, is_done, duration, from, to, diff, easing});
		if (restart) reset();
		if (is_done) return false;
		is_paused = undefined;
		if (id) cancelAnimationFrame(id);
		id = requestAnimationFrame(step);
		return true;
	};

	//pause
	const pause = (toggle: boolean = true): boolean => {
		if (toggle === null) toggle = !is_paused;
		else toggle = Boolean(toggle);
		if (_debug) console.debug(`[_animate] ${toggle ? 'pause' : 'unpause'}.`, {toggle, is_paused, is_done});
		if (is_done) return false;
		if (toggle === is_paused) return is_paused;
		return toggle ? (is_paused = toggle) : play();
	};

	//resume
	const resume = (): boolean => is_paused ? pause(false) : false;
	
	//restart
	const restart = (): boolean => play(true);

	//autoplay
	if (autoplay) play();
	
	//result - animation
	return {
		get _debug(){
			return _debug;
		},
		get begun(){
			return start !== undefined;
		},
		get paused(){
			return Boolean(is_paused);
		},
		get done(){
			return Boolean(is_done);
		},
		play,
		pause,
		resume,
		restart,
		reset,
		abort,
	};
}