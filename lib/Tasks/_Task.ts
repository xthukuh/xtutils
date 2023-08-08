import { EventEmitter, IEvent } from '../EventEmitter';

/**
 * Task status type
 */
export type TaskStatus = 'new' | 'running' | 'stopped' | 'failed' | 'done';

/**
 * Task statuses list
 */
export const TASK_STATUSES: TaskStatus[] = ['new', 'running', 'stopped', 'failed', 'done'];

/**
 * Task interface
 */
export interface ITask {
	name: string;
	label: string;
	linked: boolean;
	precision: number;
	event_debounce: number;
	progress: number;
	total: number;
	value: number;
	error: string;
	status: TaskStatus;
	startTime: number;
	endTime: number;
	elapsedTime: number;
	complete: boolean;
	updated: boolean;
	item: any;
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
 * Helper - custom `JSON.stringify` which ignores self references ~ returns `'null'` for `undefined` value
 * 
 * @param value
 * @returns `string` json
 */
const _json_str = (value: any): string => {
	if (value === undefined) value = null;
	const seen: any[] = [];
	return JSON.stringify(value, function(_, val){
		if (val && 'object' === typeof val){
			if (seen.indexOf(val) > -1) return;
			seen.push(val);
		}
		return val;
	});
};

/**
 * Helper - parse normalized string value
 * 
 * @param val
 * @returns `string` normalized and trimmed
 */
const _get_str = (val: any): string => {
	if ([undefined, null].includes(val)) return '';
	let value: string = '';
	try {
		if (Object(val) === val && val[Symbol.iterator]) val = _json_str([...val]);
		value = String(val);
	}
	catch (e){
		value = '';
	}
	if (Object(val) === val && (!value || /\[object \w+\]/.test(value))) value = _json_str(val).replace(/^"|"$/g, '');
	return value.trim();
};

/**
 * Helper - parse normalized error value
 * 
 * @param val
 * @returns `string` error
 */
const _get_error = (val: any): string => {
	if (Object(val) === val && !(val instanceof Error)){
		if (val.error instanceof Error || 'string' === typeof val.error && !!val.error.trim()) val = val.error;
		else if (val.reason instanceof Error || 'string' === typeof val.reason && !!val.reason.trim()) val = val.error;
		else if ('string' === typeof val.message && !!val.message.trim()) val = val.message;
	}
	return _get_str(val);
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
 * @class Task
 */
export class Task implements ITask
{
	/**
	 * Task global event debounce milliseconds (default: `200`)
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
		name: string;
		label: string;
		linked: boolean;
		precision: number;
		event_debounce: number;
		progress: number;
		total: number;
		value: number;
		error: string;
		status: TaskStatus;
		startTime: number;
		endTime: number;
		complete: boolean;
		updated: boolean;
		item: any;
		_round: (val: number) => number;
		_emitter: EventEmitter;
		_debounced_update: ()=>void;
	} = {} as any;

	/**
	 * Task name
	 */
	get name(): string {
		return this[PROPS].name;
	}

	/**
	 * Task label
	 */
	get label(): string {
		return this[PROPS].label;
	}

	/**
	 * Task linked - value/total/progress (recalculate on change)
	 */
	get linked(): boolean {
		return this[PROPS].linked;
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
	 * Task progress
	 */
	get progress(): number {
		return this[PROPS].progress;
	}

	/**
	 * Task total
	 */
	get total(): number {
		return this[PROPS].total;
	}

	/**
	 * Task value
	 */
	get value(): number {
		return this[PROPS].value;
	}

	/**
	 * Task error
	 */
	get error(): string {
		return this[PROPS].error;
	}

	/**
	 * Task status
	 */
	get status(): TaskStatus {
		return this[PROPS].status;
	}

	/**
	 * Task startTime - timestamp milliseconds (i.e. `Date.now()`)
	 */
	get startTime(): number {
		return this[PROPS].startTime;
	}

	/**
	 * Task endTime - timestamp milliseconds (i.e. `Date.now()`)
	 */
	get endTime(): number {
		return this[PROPS].endTime;
	}

	/**
	 * Task elapsedTime - millisecond timestamps difference (i.e. `endTime - startTime`)
	 */
	get elapsedTime(): number {
		return this.endTime ? this.endTime - this.startTime : 0;
	}

	/**
	 * Task complete
	 */
	get complete(): boolean {
		return this[PROPS].complete;
	}
	
	/**
	 * Task updated
	 */
	get updated(): boolean {
		return this[PROPS].updated;
	}
	
	/**
	 * Task item
	 */
	get item(): any {
		return this[PROPS].item;
	}

	/**
	 * Create new instance
	 * 
	 * @param name - task name
	 * @param linked - task value/total/progress linked ~ recalculate on change
	 * @param precision - decimal places (default: `Task.decimal_precision` ~ `2`)
	 * @param event_debounce - event debounce milliseconds (default: `Task.event_debounce` ~ `200`)
	 */
	constructor(name: string, linked: boolean = false, precision: number = Task.decimal_precision, event_debounce: number = Task.event_debounce){
		if (!(name = _get_str(name))) throw new TypeError('Invalid new task name.');
		precision = _pos_int(precision, Task.decimal_precision, Task.decimal_precision);
		event_debounce = _pos_int(event_debounce, Task.event_debounce, Task.event_debounce);
		this[PROPS] = {
			name,
			label: '',
			linked,
			precision,
			event_debounce,
			progress: 0,
			total: 0,
			value: 0,
			error: '',
			status: 'new',
			startTime: 0,
			endTime: 0,
			complete: false,
			item: undefined,
			updated: false,
			_round: (val: number): number => _round(val, this[PROPS].precision),
			_emitter: new EventEmitter(),
			_debounced_update: _debounce(() => {
				const props = this[PROPS];
				if (!props.updated) props.updated = true;
				props._emitter.emit('update', this.data());
			}, this.event_debounce),
		};
	}

	/**
	 * Get task data
	 * 
	 * @returns `ITask` options ~ i.e. `{name, label, linked, precision, event_debounce, progress, total, value, error, status, startTime, endTime, complete, updated, item}`
	 */
	get data(): ()=>ITask {
		return (): ITask => {
			const { name, label, linked, precision, event_debounce, progress, total, value, error, status, startTime, endTime, elapsedTime, complete, updated, item } = this;
			return {name, label, linked, precision, event_debounce, progress, total, value, error, status, startTime, endTime, elapsedTime, complete, updated, item};
		};
	}

	/**
	 * Update event trigger
	 * 
	 * @returns `Task` instance
	 */
	get update(): ()=>Task {
		return (): Task => {
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
	 * Task start
	 * 
	 * @returns `Task` instance
	 */
	start(restart: boolean = false): Task {
		const props = this[PROPS];
		let changes = 0;

		//restart check
		if (props.complete && !restart){
			console.warn('Task start ignored because task is complete. Try using `task.start(restart=true)` to override.');
			return this;
		}
		
		//-- complete = false
		if (props.complete){
			changes ++;
			props.complete = false;
		}
		
		//-- status = running
		if (props.status !== 'running'){
			changes ++;
			props.status = 'running';
		}

		//-- startTime
		if (!props.startTime || restart){
			changes ++;
			props.startTime = Date.now();
		}

		//-- endTime
		if (props.endTime){
			changes ++;
			props.endTime = 0;
		}
		
		//-- error
		if (props.error){
			changes ++;
			props.error = '';
		}

		//changes - update
		if (changes) this.update();
		return this;
	}

	/**
	 * Task stop
	 * 
	 * @returns `Task` instance
	 */
	stop(): Task {
		const props = this[PROPS];
		let changes = 0;

		//-- status = stopped
		if (props.status === 'running'){
			changes ++;
			props.status = 'stopped';
		}

		//-- endTime, startTime
		if (!props.endTime){
			changes ++;
			props.endTime = Date.now();
			if (!props.startTime) props.startTime = props.endTime;
		}

		//changes - update
		if (changes) this.update();
		return this;
	}

	/**
	 * Task failed
	 * 
	 * @returns `Task` instance
	 */
	failure(error?: any): Task {
		error = (error = _get_error(error)) ? error : 'Unknown task error.';
		const props = this[PROPS];
		let changes = 0;
		
		//-- error
		if (props.error !== error){
			changes ++;
			props.error = error;
		}

		//-- status
		if (props.status !== 'failed'){
			changes ++;
			props.status = 'failed';
		}

		//-- endTime, startTime
		if (!props.endTime){
			changes ++;
			props.endTime = Date.now();
			if (!props.startTime) props.startTime = props.endTime;
		}

		//changes - update
		if (changes) this.update();
		return this;
	}

	/**
	 * Task done
	 * 
	 * @param fullProgress - [default: `true`] set `progress` to `100`% (linked default) //TODO: test fullProgress = true/false
	 * @returns `Task` instance
	 */
	done(fullProgress: boolean = true): Task {
		const props = this[PROPS];
		let changes = 0;

		//-- complete = true
		if (!props.complete){
			changes ++;
			props.complete = true;
		}

		//-- status = done|failed
		const status = props.error ? 'failed' : 'done';
		if (props.status !== status){
			changes ++;
			props.status = status;
		}

		//-- progress = 100 (linked/fullProgress)
		if (props.linked || fullProgress){
			let progress = 100;
			if (progress !== props.progress){
				changes ++;
				props.progress = progress;
			}
		}

		//-- value = total (linked)
		if (props.linked && props.total){
			if (props.value !== props.total){
				changes ++;
				props.value = props.total;
			}
		}

		//-- startTime, endTime = now
		if (!props.endTime){
			changes ++;
			props.endTime = Date.now();
			if (!props.startTime) props.startTime = props.endTime;
		}

		//changes - update
		if (changes) this.update();
		return this;
	}

	/**
	 * Set progress
	 * 
	 * @param progress - task percentage progress (`0-100`)
	 * @param _value - unlinked task `value` update ~ ignores `undefined`
	 * @param _total - unlinked task `total` update ~ ignores `undefined`
	 * @returns `Task` instance
	 */
	setProgress(progress: number, _value?: number, _total?: number): Task {
		const props = this[PROPS];

		//ignore if not running
		if (props.status !== 'running'){
			console.warn(`Set task progress cancelled because current status is "${props.status}".`);
			return this;
		}

		//parse progress/adjust
		let tmp: number = _pos_num(progress, -1, -1);
		if (tmp < 0) throw new TypeError(`Invalid set task \`progress\` value (${progress}).`);
		if ((progress = props._round(tmp)) > 100){
			console.warn(`Set task \`progress\` value (${progress}) must be a percentage within range (0 - 100). Using 100 instead.`);
			progress = 100;
		}

		//total/value - unlinked update/linked recalculate
		let value = props.value;
		let total = props.total;
		if (!props.linked){
			if ((_total = _pos_num(_total, -1, -1)) >= 0) total = props._round(_total);
			if ((_value = _pos_num(_value, -1, -1)) >= 0) value = props._round(_value);
		}
		else if (total){
			if (progress === 100) value = total;
			else value = props._round(progress/100 * total);
		}
		
		//changes - update
		let changes = 0;
		if (progress !== props.progress){
			changes ++;
			props.progress = progress;
		}
		if (value !== props.value){
			changes ++;
			props.value = value;
		}
		if (total !== props.total){
			changes ++;
			props.total = total;
		}
		if (changes) this.update();
		return this;
	}
	
	/**
	 * Set total
	 * 
	 * @param total
	 * @returns `Task` instance
	 */
	setTotal(total: number): Task {
		const props = this[PROPS];

		//ignore if not running
		if (props.status !== 'running'){
			console.warn(`Set task total cancelled because current status is "${props.status}".`);
			return this;
		}

		//parse total/adjust
		let tmp: number = _pos_num(total, -1, -1);
		if (tmp < 0) throw new TypeError(`Invalid set task \`total\` value (${total}).`);
		total = props._round(tmp);

		//linked - recalculate value/progress
		let progress = props.progress;
		let value = props.value;
		if (props.linked){
			if (!total){
				value = 0;
				progress = 0;
			}
			else if (value){
				if (value >= total){
					value = total;
					progress = 100;
				}
				else progress = props._round(value/total * 100);
			}
			else if (progress) value = props._round(progress/100 * total);
		}

		//changes - update
		let changes = 0;
		if (progress !== props.progress){
			changes ++;
			props.progress = progress;
		}
		if (value !== props.value){
			changes ++;
			props.value = value;
		}
		if (total !== props.total){
			changes ++;
			props.total = total;
		}
		if (changes) this.update();
		return this;
	}

	/**
	 * Set value
	 * 
	 * @param value
	 * @returns `Task` instance
	 */
	setValue(value: number): Task {
		const props = this[PROPS];
		
		//ignore if not running
		if (props.status !== 'running'){
			console.warn(`Set task value cancelled because current status is "${props.status}".`);
			return this;
		}

		//parse value/adjust
		let tmp: number = _pos_num(value, -1, -1);
		if (tmp < 0) throw new TypeError(`Invalid set task \`value\` value (${value}).`);
		value = props._round(tmp);

		//linked - recalculate progress
		let total = props.total;
		let progress = props.progress;
		if (props.linked){
			if (!value) progress = 0;
			else if (total){
				if (value > total){
					total = value;
					progress = 100;
				}
				else progress = props._round(value/total * 100);
			}
			else if (progress) total = props._round(100/progress * value);
		}

		//changes - update
		let changes = 0;
		if (progress !== props.progress){
			changes ++;
			props.progress = progress;
		}
		if (value !== props.value){
			changes ++;
			props.value = value;
		}
		if (total !== props.total){
			changes ++;
			props.total = total;
		}
		if (changes) this.update();
		return this;
	}

	/**
	 * Set item
	 * 
	 * @param item
	 * @returns `Task` instance
	 */
	setItem(item: any): Task {
		this[PROPS].item = item;
		return this;
	}

	/**
	 * Create instance from existing task options
	 * 
	 * @param options - `ITask` options ~ i.e. `{name, label, linked, precision, event_debounce, progress, total, value, error, status, startTime, endTime, complete, updated, item}`
	 * @param precision - decimal places (default: `Task.decimal_precision` ~ `2`)
	 * @param event_debounce - event debounce milliseconds (default: `Task.event_debounce` ~ `200`)
	 * @returns `Task` instance
	 * @throws validation `Error`
	 */
	static create(options: ITask, precision?: number, event_debounce?: number): Task {
		let {
			name,
			label,
			linked,
			precision: _precision,
			event_debounce: _event_debounce,
			progress,
			total,
			value,
			error,
			status,
			startTime,
			endTime,
			complete,
			updated,
			item,
		} = Object(options);
		try {
			
			//parse options
			let tmp: any;
			if (!(tmp = _get_str(name))) throw new TypeError('Invalid task `name` value.');
			name = tmp;
			label = _get_str(label);
			linked = !!linked;
			
			//-- precision
			tmp = _pos_int(_precision, -1, Task.decimal_precision);
			if ((tmp = _pos_int(precision, -1, tmp)) < 0){
				console.warn(`Task math \`precision\` (${precision}) is invalid. Using default precision ${Task.decimal_precision}.`);
				precision = Task.decimal_precision;
			}
			else precision = tmp;

			//-- event_debounce
			tmp = _pos_int(_event_debounce, -1, Task.event_debounce);
			if ((tmp = _pos_int(event_debounce, -1, tmp)) < 0){
				console.warn(`Task \`event_debounce\` (${event_debounce}) is invalid. Using default event_debounce ${Task.event_debounce}.`);
				event_debounce = Task.event_debounce;
			}
			else event_debounce = tmp;

			//-- precision round
			const _round_p = (val: number): number => _round(val, precision);

			//-- parse/adjust: progress, total, value
			if ((tmp = _pos_num(progress, -1)) < 0) throw new TypeError('Invalid task `progress` value.');
			if ((progress = _round_p(tmp)) > 100){
				console.warn(`Task \`progress\` value (${progress}) must be a percentage within range (0 - 100) - changed to max percent 100 instead.`);
				progress = 100;
			}
			if ((tmp = _pos_num(total, -1)) < 0) throw new TypeError('Invalid task `total` value.');
			total = _round_p(tmp);
			if ((tmp = _pos_num(value, -1)) < 0) throw new TypeError('Invalid task `value` value.');
			value = _round_p(tmp);
			if (linked){
				if (!value){
					if (progress) console.warn(`Task linked \`progress\` (${progress}) changed to 0 because current value is 0.`);
					progress = 0;
				}
				else if (total){
					if (value > total){
						console.warn(`Task linked \`value\` (${value}) is greater than \`total\` (${total}). Using value as new total${progress !== 100 ? ' - updating progress' : ''}.`);
						total = value;
						progress = 100;
					}
					else {
						const prog = _round_p(value/total * 100);
						if (progress !== prog){
							if (progress) console.warn(`Task linked \`progress\` (${progress}) recalculated to (${prog}) using current value/total (${value}/${total}) %.`);
							progress = prog;
						}
					}
				}
				else if (progress) total = _round_p(100/progress * value);
			}

			//-- parse/adjust: error, status, startTime, endTime, complete
			complete = !!complete;
			error = _get_error(error);
			if (!(status = _get_str(status).toLowerCase())) status = 'new';
			else if (!TASK_STATUSES.includes(status)){
				console.warn(`Task \`status\` (${status}) must be one of [${TASK_STATUSES.map(v => `'${v}'`).join(', ')}]. Using 'new' status.`);
				status = 'new';
			}
			if ((tmp = _pos_int(startTime, -1)) < 0) throw new TypeError('Invalid task \`startTime\` value.');
			startTime = tmp;
			if ((tmp = _pos_int(endTime, -1)) < 0) throw new TypeError('Invalid task `endTime` value.');
			endTime = tmp;
			if (!(['stopped', 'failed', 'done'].includes(status) && startTime && endTime && startTime < endTime)){
				status = 'new';
				startTime = 0;
				endTime = 0;
				error = '';
				complete = false;
			}
			else if (error && status !== 'failed') status = 'failed';
			else if (status === 'done' && !complete) complete = true;
			if (!TASK_STATUSES.includes(status)) throw new TypeError('Invalid task \`status\` value.');

			//create task
			const t = new Task(name, linked, precision, event_debounce);
			const props = t[PROPS];
			props.name = name;
			props.label = label;
			props.linked = linked;
			props.precision = precision as number;
			props.event_debounce = event_debounce as number;
			props.progress = progress;
			props.total = total;
			props.value = value;
			props.error = error;
			props.status = status;
			props.startTime = startTime;
			props.endTime = endTime;
			props.complete = complete;
			props.updated = !!updated;
			props.item = item; //-- item
			return t;
		}
		catch (e: any){
			const error = `Create Task Failure! ${e instanceof Error ? e.message : e}`.trim();
			const _options = {name, label, linked, precision, event_debounce, progress, total, value, error, status, startTime, endTime, complete, updated, item};
			console.warn(error, {_options});
			if (e.name === 'TypeError') throw new TypeError(error);
			else throw new Error(error);
		}
	}
}