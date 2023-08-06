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
	progress: number;
	total: number;
	value: number;
	error: string;
	status: TaskStatus;
	startTime: number;
	endTime: number;
	elapsedTime: number;
	data: any;
}

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
 * Helper - round number to `x` decimal places
 * 
 * @param val
 * @param places
 * @returns `number` rounded
 */
const _round = (val: number, places?: number): number => {
	const p = 10 ** _pos_int(places, 2, 2);
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
 * Helper - parse status value ~ adjusted to task progress/error/started state
 * 
 * @param val - status value 
 * @param progress - current progress
 * @param error - current error
 * @param started - task was started
 * @param warning - whether to console.warn on any adjustments
 * @returns `TaskStatus`
 */
const _get_status = (val: any, progress: number, error: string, started: boolean = false, warning: boolean = true): TaskStatus => {
	
	//parse status value
	let status: any = _get_str(val).toLowerCase();
	if (!TASK_STATUSES.includes(status)) status = '';
	
	//get actual status
	let _status: string = '';
	if (!!error){
		_status = 'failed';
		if (warning && status && status !== _status) console.warn(`Task \`status\` changed from '${status}' to '${_status}' because of an error ("${error}").`);
		status = _status;
	}
	else if (progress === 0){
		_status = 'new';
		if (warning && status && status !== _status) console.warn(`Task \`status\` changed from '${status}' to '${_status}' because progress is 0%.`);
		status = _status;
	}
	else if (progress === 100){
		_status = 'done';
		if (warning && status && status !== _status) console.warn(`Task \`status\` changed from '${status}' to '${_status}' because progress is 100%.`);
		status = _status;
	}
	else if (started){
		_status = 'running';
		if (warning && status && status !== _status) console.warn(`Task \`status\` changed from '${status}' to '${_status}' because started incomplete progress is ${progress}%.`);
		status = _status;
	}
	else {
		_status = 'stopped';
		if (warning && status && status !== _status) console.warn(`Task \`status\` changed from '${status}' to '${_status}' because restored incomplete progress is ${progress}% pending restart.`);
		status = _status;
	}

	//result
	const res: TaskStatus = TASK_STATUSES.includes(status) ? status : 'new';
	return res;
};

/**
 * Task default decimal places
 */
let DEFAULT_DECIMAL_PLACES: number = 2;

/**
 * `Symbol` private props key name
 */
const PROPS = Symbol(`__private_props_${Date.now()}__`);

/**
 * @class Task
 */
class Task implements ITask
{
	/**
	 * Get/set default max listeners count
	 * - warns if exceeded (helps find memory leaks)
	 */
	static get decimalPlaces(): number {
		return DEFAULT_DECIMAL_PLACES;
	}
	static set decimalPlaces(value: any){
		DEFAULT_DECIMAL_PLACES = (value = _pos_int(value, 0, -1)) > 0 ? value : 2;
	}

	/**
	 * Instance "private" props
	 */
	[PROPS]: {
		name: string;
		label: string;
		progress: number;
		total: number;
		value: number;
		error: string;
		status: TaskStatus;
		startTime: number;
		endTime: number;
		elapsedTime: number;
		data: any;
		_running: boolean;
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
	 * Task startTime
	 */
	get startTime(): number {
		return this[PROPS].startTime;
	}

	/**
	 * Task endTime
	 */
	get endTime(): number {
		return this[PROPS].endTime;
	}

	/**
	 * Task elapsedTime (endTime - startTime)
	 */
	get elapsedTime(): number {
		return this.endTime ? this.endTime - this.startTime : 0;
	}

	/**
	 * Task data
	 */
	get data(): any {
		return this[PROPS].data;
	}

	/**
	 * Create new instance
	 * 
	 * @param name - task name
	 */
	constructor(name?: string){
		this[PROPS] = {
			name: (name = _get_str(name)) ? name : 'task_' + Date.now(),
			label: '',
			progress: 0,
			total: 0,
			value: 0,
			error: '',
			status: 'new',
			startTime: 0,
			endTime: 0,
			elapsedTime: 0,
			data: undefined,
			_running: false,
		};
	}

	/**
	 * Update changes ~ triggers event
	 * 
	 * @returns `ITask` `this` instance
	 */
	update(): ITask {
		const props = this[PROPS];
		if (!props._running) return this; //ignore if not running
		//TODO: emit event
		//..
		return this;
	}

	/**
	 * Task start
	 * 
	 * @returns `ITask` `this` instance
	 */
	start(): ITask {
		const props = this[PROPS];
		if (props._running) return this; //ignore already running
		if (props.status === 'done'){ //ignore done
			console.warn(`Task start cancelled because status is "${props.status}".`);
			return this;
		}
		props._running = true;
		props.status = 'running';
		props.error = '';
		if (!props.startTime) props.startTime = Date.now();
		props.endTime = 0;
		this.update();
		return this;
	}

	/**
	 * Task stop
	 * 
	 * @returns `ITask` `this` instance
	 */
	stop(): ITask {
		const props = this[PROPS];
		if (!props._running) return this; //ignore already stopped
		if (props.status !== 'running'){ //ignore status not 'running'
			console.warn(`Task stop cancelled because status is "${props.status}".`);
			return this;
		}
		props.status = 'stopped';
		props.endTime = Date.now();
		this.update();
		return this;
	}

	/**
	 * Task failed
	 * 
	 * @returns `ITask` `this` instance
	 */
	fail(error?: string): ITask {
		const props = this[PROPS];
		if (props.status === 'done'){ //ignore status done
			console.warn(`Task fail cancelled because status is "${props.status}".`);
			return this;
		}
		props._running = false;
		props.error = (error = _get_error(error)) ? error : 'Unspecified task error.';
		props.status = 'failed';
		props.endTime = Date.now();
		if (!props.startTime) props.startTime = props.endTime;
		this.update();
		return this;
	}

	/**
	 * Task done
	 * 
	 * @returns `ITask` `this` instance
	 */
	done(): ITask {
		const props = this[PROPS];
		if (props.status === 'done'){ //ignore status done
			console.warn(`Task done cancelled because status is "${props.status}".`);
			return this;
		}
		if (props.total) props.value = props.total = _round(props.total, Task.decimalPlaces);
		props._running = false;
		props.progress = 100;
		props.status = _get_status('done', props.progress, props.error, true);
		props.endTime = Date.now();
		if (!props.startTime) props.startTime = props.endTime;
		this.update();
		return this;
	}

	/**
	 * Set progress percentage ~ updates current value (% total)
	 * - if `progress > 100` - progress is set to 100%. (i.e. `progress = 100`)
	 * - if `total > 0 && progress === 100` - value is set to total value. (i.e. `value = total`)
	 * - if `total > 0` - value is set to progress % of total. (i.e.  `value = progress/100 * total`)
	 * 
	 * @param progress
	 * @returns `ITask` `this` instance
	 */
	setProgress(progress: number): ITask {
		const props = this[PROPS];

		//not running - cancel updates
		if (['failed', 'stopped', 'done'].includes(props.status)){
			console.warn(`Set task progress cancelled because current status is "${props.status}".`);
			return this;
		}

		//set progress adjustments
		let tmp: any = progress;
		if ((progress = _pos_num(progress, -1, -1)) < 0) throw new TypeError(`Invalid set task \`progress\` value (${tmp}).`);
		progress = _round(progress, Task.decimalPlaces);
		if (progress > 100){
			console.warn(`Set task \`progress\` value (${progress}) must be a percentage within range (0 - 100) - changed to max percent 100 instead.`);
			progress = 100;
		}
		if (props.total){
			props.total = _round(props.total, Task.decimalPlaces);
			props.value = _round(progress/100 * props.total, Task.decimalPlaces);
		}

		//trigger update
		if (props.progress !== progress){
			props.progress = progress;
			this.update();
		}
		return this;
	}
	
	/**
	 * Set total value ~ updates current progress/value
	 * - if `total > 0 && total < value` - value is set to total and progress set to 100. (i.e `value = total; progress = 100`) 
	 * - if `total > 0 && value > 0 && value < total` - progress % is recalculated. (i.e.  `progress = value/total * 100`)
	 * 
	 * @param total
	 * @returns `ITask` `this` instance
	 */
	setTotal(total: number): ITask {
		const props = this[PROPS];

		//not running - cancel updates
		if (['failed', 'stopped', 'done'].includes(props.status)){
			console.warn(`Set task total cancelled because current status is "${props.status}".`);
			return this;
		}

		//set total adjustments
		let tmp: any = total;
		if ((total = _pos_num(total, -1, -1)) < 0) throw new TypeError(`Invalid set task \`total\` value (${tmp}).`);
		total = _round(total, Task.decimalPlaces);
		let progress = _round(props.progress, Task.decimalPlaces);
		let value = _round(props.value, Task.decimalPlaces);
		if (total && value){
			if (value > total){
				value = total;
				progress = 100;
			}
			else progress = _round(value/total * 100, Task.decimalPlaces);
		}
		props.value = value;
		props.total = total

		//trigger update
		if (props.progress !== progress){
			props.progress = progress;
			this.update();
		}
		return this;
	}

	/**
	 * Set current value (out of total) ~ updates progress
	 * - if `total > 0 && total < value` - value is set to total and progress set to 100. (i.e `value = total; progress = 100`) 
	 * - if `total > 0 && value > 0 && value < total` - progress % is recalculated. (i.e.  `progress = value/total * 100`)
	 * 
	 * @param value
	 * @returns `ITask` `this` instance
	 */
	setValue(value: number): ITask {
		const props = this[PROPS];

		//not running - cancel updates
		if (['failed', 'stopped', 'done'].includes(props.status)){
			console.warn(`Set task value cancelled because current status is "${props.status}".`);
			return this;
		}

		//set value adjustments
		let tmp: any = value;
		if ((value = _pos_num(value, -1, -1)) < 0) throw new TypeError(`Invalid set task \`value\` value (${tmp}).`);
		value = _round(value, Task.decimalPlaces);
		const total = _round(props.total, Task.decimalPlaces);
		let progress = _round(props.progress, Task.decimalPlaces);
		if (total && value){
			if (value > total){
				console.warn(`Set task \`value\` (${value}) must not be greater than current total value (${total}) - changed to max value ${total} instead${progress !== 100 ? ' (progress also changed from ' + progress + ' to 100%)' : ''}.`);
				value = total;
				progress = 100;
			}
			else progress = _round(value/total * 100, Task.decimalPlaces);
		}
		props.value = value;
		props.total = total

		//trigger update
		if (props.progress !== progress){
			props.progress = progress;
			this.update();
		}
		return this;
	}

	/**
	 * Create instance from existing task
	 * 
	 * @param options
	 * @returns `Task`
	 * @throws `Error` on parse failure
	 */
	static restore(options: any): ITask {
		let {
			name,
			label,
			progress,
			total,
			value,
			error,
			status: _status,
			startTime,
			endTime,
			data,
		} = Object(options);
		try {
			
			//parse name
			if (!(name = _get_str(name))) throw new TypeError('Invalid task `name` value.');
			
			//parse label
			label = _get_str(label);

			//parse progress/adjustments
			if ((progress = _pos_num(progress, -1)) < 0) throw new TypeError('Invalid task `progress` value.');
			progress = _round(progress, Task.decimalPlaces);
			if (progress > 100){
				console.warn(`Task \`progress\` value (${progress}) must be a percentage within range (0 - 100) - changed to max percent 100 instead.`);
				progress = 100;
			}

			//parse total
			total = _pos_num(total, 0);
			total = _round(total, Task.decimalPlaces);
			
			//parse value/adjustments
			value = _pos_num(value, 0);
			value = _round(value, Task.decimalPlaces);
			if (total && value){
				if (progress === 100 && value !== total){
					console.warn(`Task \`value\` (${value}) changed to match total value (${total}) because progress is 100%`);
					value = total;
				}
				else if (progress > 0){
					const value_progress = _round(value/total * 100, Task.decimalPlaces);
					if (progress !== value_progress){
						const progress_value = _round(progress/100 * total, Task.decimalPlaces);
						console.warn(`Task \`value\` (${value} - ${value_progress}%) changed to (${progress_value}) to match current progress ${progress}% of total value (${total}).`);
						value = progress_value;
					}
				}
				else if (value > total){
					console.warn(`Task \`value\` (${value}) must not be greater than total value (${total}) - changed to max value ${total} instead${progress !== 100 ? ' (progress also changed from ' + progress + ' to 100%)' : ''}.`);
					value = total;
					if (progress !== 100) progress = 100;
				}
			}

			//error
			error = _get_error(error);

			//status
			let status: TaskStatus = _get_status(_status, progress, error, false);
			
			//startTime
			if ((startTime = _pos_int(startTime, -1)) < 0) throw new TypeError('Invalid task `startTime` value.');
			
			//endTime/adjustments
			if ((endTime = _pos_int(endTime, -1)) < 0) throw new TypeError('Invalid task `endTime` value.');
			if (endTime < startTime) throw new TypeError(`Task \`endTime\` value (${endTime}) must not be less than \`startTime\` value (${startTime}).`);
			if (['done', 'stopped'].includes(status) && !endTime){
				const now = Date.now();
				let warning = `Task \`endTime\` changed from ${endTime} to now (${now}) because status is '${status}'.`;
				if (!startTime){
					warning += ` Task \`startTime\` also changed from ${startTime} to the same timestamp (${now}).`;
					startTime = now;
				}
				endTime = now;
				console.warn(warning);
			}

			//Create new task
			const t = new Task(name);
			const props = t[PROPS];
			props.name = name;
			props.label = label;
			props.progress = progress;
			props.total = total;
			props.value = value;
			props.error = error;
			props.status = status;
			props.startTime = startTime;
			props.endTime = endTime;
			props.data = data;
			props._running = false;
			return t;
		}
		catch (e){
			const error = `Task Restore Failure: ${e}`;
			const opts = {name, label, progress, total, value, error, status, startTime, endTime, data};
			console.error(error, {options}, opts);
			throw new Error(error);
		}
	}
}

//TODO: test/export Task