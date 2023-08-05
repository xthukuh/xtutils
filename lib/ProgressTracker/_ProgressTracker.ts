import { Exception } from '../Exception';
import { _isFunc, _str, _num, _round } from '../utils';

/**
 * Progress item status type
 */
export type ProgressTrackerStatus = 'new' | 'running' | 'stopped' | 'failed' | 'done';

/**
 * Item progress interface
 * TODO: implement IProgressTrackerItem, IProgressTracker
 */
export interface IProgressTrackerItem {
	name: string;
	range: {min: number, max: number};
	value: number;
	progress: number;
	status: ProgressTrackerStatus;
	time: {start: number, stop: number, elapsed: number},
	error: string;
	data: any;
}

/**
 * Item progress interface
 */
export interface IItemProgress {
	name: string;
	total: number;
	value: number;
	progress: number;
	complete: boolean;
	
	status?: string;
	error?: string;

	total_progress?: number;
	total_complete?: boolean;
	onProgress?: (percent:number)=>void;
}

// /**
//  * Progress item interface
//  */
// interface IProgressItem {
// 	name: string;
// 	total: number;
// 	value: number;
// 	progress: number;
// 	complete: boolean;
// 	onProgress?: (percent:number)=>void;
// }

/**
 * Private props `Symbol` key name
 */
const PRIVATE = Symbol(`__private_props_${Date.now()}__`);

/**
 * @class Process Tracker
 */
export class ProgressTracker
{
	/**
	 * Private props
	 */
	[PRIVATE]: {
		current: {[key: string]: number};
		total_progress: number;
		total_complete: boolean;
		update_progress: boolean;
		ITEMS: Map<string, IItemProgress>;
		places: number;
		onItemsProgress: ((percent:number) => void)|undefined;
		_pos_num: (val: any) => number;
		_listener: (fn: any) => ((percent:number)=>void)|undefined;
		_update: () => void;
	} = {} as any;

	/**
	 * Progress items list
	 */
	get list(): Readonly<IItemProgress>[] {
		return [...this[PRIVATE].ITEMS.values()].map(v => Object.freeze(v));
	}

	/**
	 * Progress items count
	 */
	get size(): number {
		return this[PRIVATE].ITEMS.size;
	}

	/**
	 * Create new instance
	 * 
	 * @param onProgress - item progress callback listener `0-100`
	 * @param places - decimal places for calculations [default: `2`]
	 * @returns object `{get size, add, get, set, update, complete, percent, done}`
	 */
	constructor(onProgress: (percent:number)=>void, places: number = 2){
		const _pos_num = (val: any) => (val = _num(val, 0)) >= 0 ? val : 0;
		const _listener = (fn: any): ((percent:number)=>void)|undefined => fn && _isFunc(fn) ? fn : undefined;
		const _update = (): void => {
			const props = this[PRIVATE];
			if (!props.update_progress) props.update_progress = true;
			let progress_value: number = 0;
			let progress_total: number = 0;
			[...props.ITEMS.entries()].forEach(v => {
				const item = v[1];
				const onItemProgress = _listener(item.onProgress);
				let progress = !item.value ? 0 : item.value === item.total ? 100 : _round(item.value/item.total * 100, props.places);
				if (progress < item.progress && item.complete){
					item.value = item.total;
					progress = 100;
				}
				item.progress = progress;
				item.complete = progress >= 100;
				progress_value += progress;
				progress_total += 100;
				if (props.current[item.name] !== progress){
					props.current[item.name] = progress;
					if (onItemProgress) onItemProgress(progress);
				}
			});
			const progress = progress_value >= progress_total ? 100 : _round(progress_value/progress_total * 100, props.places);
			props.total_complete = progress >= 100;
			if (props.total_progress !== progress){
				props.total_progress = progress;
				if (props.onItemsProgress) props.onItemsProgress(progress);
			}
		};
		this[PRIVATE] = {
			current: {},
			total_progress: 0,
			total_complete: false,
			update_progress: false,
			ITEMS: new Map(),
			places,
			onItemsProgress: _listener(onProgress),
			_pos_num,
			_listener,
			_update,
		};
	}

	/**
	 * Add progress item
	 * - % progress = `(value/total * 100)`
	 * 
	 * @param name - item name
	 * @param total - item total value (max value - positive `number`) [default: `100`]
	 * @param onProgress - item progress callback listener `0-100`
	 * @returns `number` items count
	 * @throws `TypeError` on invalid name
	 */
	add(name: string, total: number, onProgress?: (percent:number)=>void): number {
		if (!(name = _str(name, true))) throw new TypeError('Invalid item name.');
		const props = this[PRIVATE];
		props.ITEMS.set(name, {
			name,
			total: (total = props._pos_num(total)) > 0 ? total : 100,
			value: 0,
			progress: 0,
			complete: false,
			onProgress,
		});
		props.current[name] = 0;
		if (props.update_progress) props._update();
		return props.ITEMS.size;
	}
	 
	/**
	 * Get progress item
	 * - % progress = `(value/total * 100)`
	 * 
	 * @param name - item name
	 * @returns `{name: string, value: number, total: number, progress: number, complete: boolean, total_progress: number, total_complete: boolean}` | `undefined` if name doesn't exist
	 * @throws `TypeError` on invalid name
	 */
	get(name: string): IItemProgress|undefined {
		if (!(name = _str(name, true))) throw new TypeError('Invalid item name.');
		const props = this[PRIVATE];
		const item = props.ITEMS.get(name);
		if (!item) return;
		const {name: _name, value, total, progress, complete} = item;
		return {
			name: _name,
			value,
			total, 
			progress,
			complete,
			total_progress: props.total_progress,
			total_complete: props.total_complete,
		};
	}
	
	/**
	 * Set item progress
	 * - triggers progress callback
	 * - value = `(progress/100 * total)`
	 * 
	 * @param name - item name
	 * @param progress - item progress (set current percent - `0-100`)
	 * @returns `number` item progress % | `undefined` if name doesn't exist
	 */
	set(name: string, progress: number): number|undefined {
		if (!(name = _str(name, true))) return;
		//TODO: if (!(name = _str(name, true))) throw new TypeError('Invalid item name.');
		const props = this[PRIVATE];
		const item = props.ITEMS.get(name);
		if (!item) return;
		progress = props._pos_num(progress);
		item.value = progress >= 100 ? item.total : _round(progress/100 * item.total, props.places);
		props._update();
		return item.progress;
	}
	
	/**
	 * Update progress item value
	 * - triggers progress callback
	 * - progress = `(value/total * 100)`
	 * 
	 * @param name - item name
	 * @param value - item value (set current value - positive `number` 0 - total max value)
	 * @returns `number` item progress % | `undefined` if name doesn't exist
	 */
	update(name: string, value: number): number|undefined {
		if (!(name = _str(name, true))) return;
		const props = this[PRIVATE];
		const item = props.ITEMS.get(name);
		if (!item) return;
		item.value = (value = props._pos_num(value)) >= item.total ? item.total : value;
		props._update();
		return item.progress;
	}

	/**
	 * Set progress as complete
	 * - triggers progress callback
	 * - completed items ignore future updates
	 * - progress = `100`, value = `(progress/100 * total)`
	 * 
	 * @param name - item name (sets all as complete if blank)
	 * @returns `number` total progress % | `undefined` if name doesn't exist
	 */
	complete(name?: string): number|undefined {
		name = _str(name, true);
		const props = this[PRIVATE];
		[...props.ITEMS.entries()]
		.filter(v => name ? v[0] === name : 1)
		.forEach(v => {
			const item = v[1];
			item.value = item.total;
		});
		props._update();
		return props.total_progress;
	}
	
	/**
	 * Get progress percentage
	 * 
	 * @param name - item name (returns total progress if blank)
	 * @returns `number` item/total progress % | `undefined` if name doesn't exist
	 */
	progress(name?: string): number|undefined {
		const props = this[PRIVATE];
		if (!(name = _str(name, true))) return props.total_progress;
		return props.ITEMS.get(name)?.progress;
	}
	
	/**
	 * Get progress complete
	 * 
	 * @param name - item name (returns total complete if blank)
	 * @returns `boolean` is complete | `undefined` if name doesn't exist
	 */
	done(name?: string): boolean|undefined {
		const props = this[PRIVATE];
		if (!(name = _str(name, true))) return props.total_complete;
		return props.ITEMS.get(name)?.complete;
	}
}