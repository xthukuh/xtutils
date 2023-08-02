import { Exception } from '../Exception';
import { _num, _round } from './_number';
import { _isFunc } from './_objects';
import { _str } from './_string';

/**
 * Create progress tracker
 * 
 * @param onProgress - item progress callback listener `0-100`
 * @param places - decimal places for calculations [default: `2`]
 * @returns object `{get size, add, get, set, update, complete, percent, done}`
 */
export const _progressTracker = (onProgress: (percent:number)=>void, places: number = 2): {
	
	/**
	 * Getter - progress items count
	 */
	size: number;
	
	/**
	 * Add progress item
	 * - % progress = `(value/total * 100)`
	 * 
	 * @param name - item name
	 * @param total - item total value (max value - positive `number`) [default: `100`]
	 * @param onProgress - item progress callback listener `0-100`
	 * @returns `number` items count
	 * @throws Invalid name `Error`
	 */
	add: (name: string, total: number, onProgress?: (percent:number)=>void) => number;
	
	/**
	 * Get progress item
	 * - % progress = `(value/total * 100)`
	 * 
	 * @param name - item name
	 * @returns `{name: string, value: number, total: number, progress: number, complete: boolean, total_progress: number, total_complete: boolean}` | `undefined` if name doesn't exist
	 * @throws Invalid name `Error`
	 */
	get: (name: string) => {name: string; value: number; total: number; progress: number; complete: boolean; total_progress: number; total_complete: boolean;}|undefined;
	
	/**
	 * Set item progress
	 * - triggers progress callback
	 * - value = `(progress/100 * total)`
	 * 
	 * @param name - item name
	 * @param progress - item progress (set current percent - `0-100`)
	 * @returns `number` item progress % | `undefined` if name doesn't exist
	 */
	set: (name: string, progress: number) => number|undefined;
	
	/**
	 * Update progress item value
	 * - triggers progress callback
	 * - progress = `(value/total * 100)`
	 * 
	 * @param name - item name
	 * @param value - item value (set current value - positive `number` 0 - total max value)
	 * @returns `number` item progress % | `undefined` if name doesn't exist
	 */
	update: (name: string, value: number) => number|undefined;

	/**
	 * Set progress as complete
	 * - triggers progress callback
	 * - completed items ignore future updates
	 * - progress = `100`, value = `(progress/100 * total)`
	 * 
	 * @param name - item name (sets all as complete if blank)
	 * @returns `number` total progress % | `undefined` if name doesn't exist
	 */
	complete: (name?: string) => number|undefined;
	
	/**
	 * Get progress percentage
	 * 
	 * @param name - item name (returns total progress if blank)
	 * @returns `number` item/total progress % | `undefined` if name doesn't exist
	 */
	 progress: (name?: string) => number|undefined;
	
	/**
	 * Get progress complete
	 * 
	 * @param name - item name (returns total complete if blank)
	 * @returns `boolean` is complete | `undefined` if name doesn't exist
	 */
	done: (name?: string) => boolean|undefined;
} => {
	const _pos_num = (val: any): number => (val = _num(val, 0)) >= 0 ? val : 0;
	const _listener = (fn: any): ((percent:number)=>void)|undefined => fn && _isFunc(fn) ? fn : undefined;
	interface IProgressItem {
		name: string;
		total: number;
		value: number;
		progress: number;
		complete: boolean;
		onProgress?: (percent:number)=>void;
	}
	let current: {[key: string]: number} = {};
	let total_progress: number = 0;
	let total_complete: boolean = false;
	let update_progress: boolean = false;
	const ITEMS: Map<string, IProgressItem> = new Map();
	const onItemsProgress = _listener(onProgress);
	const __update = (): void => {
		if (!update_progress) update_progress = true;
		let progress_value: number = 0;
		let progress_total: number = 0;
		[...ITEMS.entries()].forEach(v => {
			const item = v[1];
			const onItemProgress = _listener(item.onProgress);
			let progress = !item.value ? 0 : item.value === item.total ? 100 : _round(item.value/item.total * 100, places);
			if (progress < item.progress && item.complete){
				item.value = item.total;
				progress = 100;
			}
			item.progress = progress;
			item.complete = progress >= 100;
			progress_value += progress;
			progress_total += 100;
			if (current[item.name] !== progress){
				current[item.name] = progress;
				if (onItemProgress) onItemProgress(progress);
			}
		});
		const progress = progress_value >= progress_total ? 100 : _round(progress_value/progress_total * 100, places);
		total_complete = progress >= 100;
		if (total_progress !== progress){
			total_progress = progress;
			if (onItemsProgress) onItemsProgress(progress);
		}
	};
	const add = (name: string, total: number, onProgress?: (percent:number)=>void): number => {
		if (!(name = _str(name, true))) throw new Exception('Invalid progress item name.', 'Error', '_itemsProgress.add');
		ITEMS.set(name, {
			name,
			total: (total = _pos_num(total)) > 0 ? total : 100,
			value: 0,
			progress: 0,
			complete: false,
			onProgress,
		});
		current[name] = 0;
		if (update_progress) __update();
		return ITEMS.size;
	};
	const get = (name: string): {
		name: string;
		value: number;
		total: number;
		progress: number;
		complete: boolean;
		total_progress: number;
		total_complete: boolean;
	}|undefined => {
		if (!(name = _str(name, true))) throw new Exception('Invalid progress item name.', 'Error', '_itemsProgress.add');
		const item = ITEMS.get(name);
		if (!item) return;
		const {name: _name, value, total, progress, complete} = item;
		return {name: _name, value, total, progress, complete, total_progress, total_complete};
	};
	const set = (name: string, progress: number): number|undefined => {
		if (!(name = _str(name, true))) return;
		const item = ITEMS.get(name);
		if (!item) return;
		progress = _pos_num(progress);
		item.value = progress >= 100 ? item.total : _round(progress/100 * item.total, places);
		__update();
		return item.progress;
	};
	const update = (name: string, value: number): number|undefined => {
		if (!(name = _str(name, true))) return;
		const item = ITEMS.get(name);
		if (!item) return;
		item.value = (value = _pos_num(value)) >= item.total ? item.total : value;
		__update();
		return item.progress;
	};
	const complete = (name?: string): number|undefined => {
		name = _str(name, true);
		[...ITEMS.entries()]
		.filter(v => name ? v[0] === name : 1)
		.forEach(v => {
			const item = v[1];
			item.value = item.total;
		});
		__update();
		return total_progress;
	};
	const progress = (name?: string): number|undefined => {
		if (!(name = _str(name, true))) return total_progress;
		return ITEMS.get(name)?.progress;
	};
	const done = (name?: string): boolean|undefined => {
		if (!(name = _str(name, true))) return total_complete;
		return ITEMS.get(name)?.complete;
	};
	return {
		get size(){
			return ITEMS.size;
		},
		add,
		get,
		set,
		update,
		complete,
		progress,
		done,
	};
};