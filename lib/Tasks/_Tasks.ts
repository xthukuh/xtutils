import { EventEmitter, IEvent } from '../EventEmitter';
import { ITask, Task } from './_Task';

/**
 * Tasks data interface
 */
export interface ITasksData {
	precision: number;
	event_debounce: number;
	updated: boolean;
	size: number;
	progress: number;
	running: boolean;
	started: boolean;
	complete: boolean;
	startTime: number;
	endTime: number;
	elapsedTime: number;
	tasks: {[name: string]: ITask};
}

/**
 * Default event debounce milliseconds
 */
let DEFAULT_EVENT_DEBOUNCE: number = 200;

/**
 * Default precision ~ round decimal places
 */
let DEFAULT_PRECISION: number = 2;

/**
 * Helper - parse positive number
 * 
 * @param val
 * @param _default
 * @param _blank
 * @returns `number`
 */
const _pos_num = (val: any, _default: number = 0, _blank: number = 0): number => {
	if ([undefined, null].includes(val) || 'string' === typeof val && !(val = val.trim())) return _blank;
	if (!isNaN(val = parseFloat(val)) && Number.isFinite(val) && val >= 0) return val;
	return _default;
};

/**
 * Helper - parse positive integer
 * 
 * @param val
 * @param _default
 * @param _blank
 * @returns `number` integer
 */
const _pos_int = (val: any, _default: number = 0, _blank: number = 0): number => parseInt(_pos_num(val, _default, _blank) + '');

/**
 * Helper - round number
 * 
 * @param val - round value
 * @param places - precision decimal places [default: `DEFAULT_PRECISION`]
 * @returns `number` rounded
 */
const _round = (val: number, places?: number): number => {
	const p = 10 ** _pos_int(places, DEFAULT_PRECISION, DEFAULT_PRECISION);
	return Math.round((val + Number.EPSILON) * p) / p;
};

/**
 * Helper - debounced callback
 * 
 * @param callback - callback handler
 * @param timeout - timeout milliseconds
 * @returns `()=>void` debounced callback
 */
const _debounce = (callback: ()=>void, timeout: number = 200): () => void => {
	let timer: any;
	return () => {
		clearTimeout(timer);
		timer = setTimeout(callback, timeout);
	};
};

/**
 * `Symbol` private props key name
 */
const PROPS = Symbol(`__private_props_${Date.now()}__`);

/**
 * @class Tasks
 */
export class Tasks
{
	/**
	 * Tasks global event debounce milliseconds (default: `200`)
	 */
	static get event_debounce(): number {
		return DEFAULT_EVENT_DEBOUNCE;
	}
	static set event_debounce(value: any){
		DEFAULT_EVENT_DEBOUNCE = _pos_int(value, DEFAULT_EVENT_DEBOUNCE, 200);
	}

	/**
	 * Task global precision ~ round decimal places  (default: `2`)
	 */
	static get decimal_precision(): number {
		return DEFAULT_PRECISION;
	}
	static set decimal_precision(value: any){
		DEFAULT_PRECISION = _pos_int(value, DEFAULT_PRECISION, 2);
	}

	/**
	 * Instance "private" props
	 */
	[PROPS]: {
		precision: number;
		event_debounce: number;
		updated: boolean;
		_tasks: Map<string, Task>;
		_unsubscribe: Map<string, ()=>void>;
		_emitter: EventEmitter;
		_debounced_update: ()=>void;
	} = {} as any;

	/**
	 * Tasks count
	 */
	get size(): number {
		return this[PROPS]._tasks.size;
	}
	
	/**
	 * Task precision ~ positive `integer` [default `2`]
	 */
	get precision(): number {
		return this[PROPS].precision;
	}

	/**
	 * Task event debounce milliseconds (default: `Tasks.event_debounce` ~ `200`)
	 */
	get event_debounce(): number {
		return this[PROPS].event_debounce;
	}

	/**
	 * Task updated
	 */
	get updated(): boolean {
		return this[PROPS].updated;
	}

	/**
	 * Create new instance
	 * 
	 * @param precision - decimal places (default: `Tasks.decimal_precision` ~ `2`)
	 * @param event_debounce - event debounce milliseconds (default: `Tasks.event_debounce` ~ `200`)
	 */
	constructor(precision: number = Tasks.decimal_precision, event_debounce: number = Tasks.event_debounce){
		precision = _pos_int(precision, Tasks.decimal_precision, Tasks.decimal_precision);
		event_debounce = _pos_int(event_debounce, Tasks.event_debounce, Tasks.event_debounce);
		this[PROPS] = {
			precision: precision,
			event_debounce: event_debounce,
			updated: false,
			_tasks: new Map(),
			_unsubscribe: new Map(),
			_emitter: new EventEmitter(),
			_debounced_update: _debounce(() => {
				const props = this[PROPS];
				if (!props.updated) props.updated = true;
				props._emitter.emit('update', this.data());
			}, this.event_debounce),
		};
	}

	/**
	 * Get tasks data
	 * 
	 * @returns `ITasksData` options ~ i.e. `{precision, event_debounce, updated, size, progress, running, started, complete, startTime, endTime, elapsedTime, tasks}`
	 */
	get data(): ()=>ITasksData {
		return (): ITasksData => {
			const props = this[PROPS];
			let size: number = 0;
			let startTime: number = 0;
			let endTime: number = 0;
			let all_progress: number = 0;
			let full_progress: number = 0;
			let has_running: boolean = false;
			let has_started: boolean = false;
			let has_incomplete: boolean = false;

			//tasks data
			const tasks: {[name: string]: ITask} = Object.fromEntries([...props._tasks.values()].map(task => {
				const data = task.data();
				size ++;

				//-- progress
				full_progress += 100;
				all_progress += data.progress;
				
				//-- complete
				if (!has_incomplete && !data.complete) has_incomplete = true;
				
				//-- status = running/started
				if (data.status === 'running'){
					if (!has_running) has_running = true;
					if (!has_started) has_started = true;
				}
				else if (!has_started && ['failed', 'done'].includes(data.status)) has_started = true;

				//-- startTime
				if (data.startTime && (!startTime && data.startTime < startTime)) startTime = data.startTime;
				
				//-- endTime
				if (data.endTime && (!endTime && data.endTime > endTime)) endTime = data.endTime;

				//task entry
				return [task.name, data];
			}));
			
			//calc data
			const progress = (!all_progress || !full_progress) ? 0 : ((all_progress >= full_progress) ? 100 :  _round(all_progress/full_progress * 100, props.precision));
			const running = has_running;
			const started = has_started;
			const complete = started && !has_incomplete;
			let elapsedTime = 0;
			if (endTime && startTime){
				if (endTime < startTime) startTime = endTime;
				elapsedTime = endTime - startTime;
			}

			//data
			return {
				precision: this.precision,
				event_debounce: this.event_debounce,
				updated: this.updated,
				size,
				progress,
				running,
				started,
				complete,
				startTime,
				endTime,
				elapsedTime,
				tasks,
			}
		};
	}

	/**
	 * Update event trigger
	 * 
	 * @returns `Task` instance
	 */
	get update(): ()=>Tasks {
		return (): Tasks => {
			this[PROPS]._debounced_update();
			return this;
		};
	}

	/**
	 * Add update event subscriber ~ `event = {type: 'update', data: ITask}`
	 * 
	 * @param listener - event callback listener
	 * @returns `(()=>void)` unsubscribe callback
	 */
	subscribe(listener: (event:IEvent)=>void): ()=>void {
		return this[PROPS]._emitter.subscribe('update', listener);
	}

	/**
	 * Check if task name exists
	 * 
	 * @param name
	 * @returns `boolean`
	 */
	has(name: string): boolean {
		return this[PROPS]._tasks.has(name);
	}
	
	/**
	 * Add task instance
	 * 
	 * @param task
	 * @returns `Task`
	 */
	task(task: Task): Task {
		if (!(task instanceof Task)) throw new TypeError('Invalid \`Task\` object.'); //check type
		if (this.has(task.name)) console.warn(`Existing task named "${task.name}" has been replaced.`); //warn replaced
		const unsubscribe = task.subscribe((event: IEvent) => {
			console.debug('-- task event', {event}); //TODO: remove task event debug
			this.update(); //task update
		});
		const props = this[PROPS];
		props._tasks.set(task.name, task);
		props._unsubscribe.set(task.name, unsubscribe);
		this.update(); //update
		return task;
	}

	/**
	 * Add new task
	 * 
	 * @param name - task name
	 * @param linked - task value/total/progress linked ~ recalculate on change
	 * @param event_debounce - event debounce milliseconds (default: `Task.event_debounce` ~ `200`)
	 * @returns `Task`
	 */
	add(name: string, linked: boolean = false, event_debounce?: number): Task {
		const props = this[PROPS];
		event_debounce = (event_debounce = _pos_int(event_debounce, -1, -1)) >= 0 ? event_debounce : undefined;
		return this.task(new Task(name, linked, props.precision, event_debounce));
	}

	/**
	 * Create task from existing task data
	 * 
	 * @param options - `ITask` options ~ i.e. `{name, label, linked, precision, event_debounce, progress, total, value, error, status, startTime, endTime, complete, updated, item}`
	 * @param event_debounce - event debounce milliseconds (default: `Task.event_debounce` ~ `200`)
	 * @returns `Task`
	 */
	create(options: ITask, event_debounce?: number): Task {
		const props = this[PROPS];
		event_debounce = (event_debounce = _pos_int(event_debounce, -1, -1)) >= 0 ? event_debounce : undefined;
		return this.task(Task.create(options, props.precision, event_debounce));
	}

	/**
	 * Get task by name
	 * 
	 * @param name
	 * @returns `Task`
	 */
	get(name: string): Task|undefined {
		const props = this[PROPS];
		return props._tasks.get(name);
	}
	
	/**
	 * Remove task by name
	 * 
	 * @param name
	 * @returns `Tasks` instance
	 */
	remove(name: string): Tasks {
		const props = this[PROPS];
		if (!props._tasks.has(name)) return this;
		
		//unsubscribe task listener
		const unsubscribe = props._unsubscribe.get(name);
		if (unsubscribe){
			props._unsubscribe.delete(name);
			unsubscribe();
		}
		
		//remove task - update
		props._tasks.delete(name);
		this.update();
		return this;
	}
}