import { EventEmitter, IEvent } from '../EventEmitter';
/**
 * Task status type
 */
export type TaskStatus = 'new' | 'running' | 'stopped' | 'failed' | 'done';
/**
 * Task statuses list
 */
export declare const TASK_STATUSES: TaskStatus[];
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
 * `Symbol` private props key name
 */
declare const PROPS: unique symbol;
/**
 * @class Task
 */
export declare class Task implements ITask {
    /**
     * Task global event debounce milliseconds (default: `200`)
     */
    static get event_debounce(): number;
    static set event_debounce(value: any);
    /**
     * Task global precision ~ round decimal places  (default: `2`)
     */
    static get decimal_precision(): number;
    static set decimal_precision(value: any);
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
        _debounced_update: () => void;
    };
    /**
     * Task name
     */
    get name(): string;
    /**
     * Task label
     */
    get label(): string;
    /**
     * Task linked - value/total/progress (recalculate on change)
     */
    get linked(): boolean;
    /**
     * Task precision ~ positive `integer` [default `2`]
     */
    get precision(): number;
    /**
     * Task event debounce milliseconds (default: `Tasks.event_debounce` ~ `200`)
     */
    get event_debounce(): number;
    /**
     * Task progress
     */
    get progress(): number;
    /**
     * Task total
     */
    get total(): number;
    /**
     * Task value
     */
    get value(): number;
    /**
     * Task error
     */
    get error(): string;
    /**
     * Task status
     */
    get status(): TaskStatus;
    /**
     * Task startTime - timestamp milliseconds (i.e. `Date.now()`)
     */
    get startTime(): number;
    /**
     * Task endTime - timestamp milliseconds (i.e. `Date.now()`)
     */
    get endTime(): number;
    /**
     * Task elapsedTime - millisecond timestamps difference (i.e. `endTime - startTime`)
     */
    get elapsedTime(): number;
    /**
     * Task complete
     */
    get complete(): boolean;
    /**
     * Task updated
     */
    get updated(): boolean;
    /**
     * Task item
     */
    get item(): any;
    /**
     * Create new instance
     *
     * @param name - task name
     * @param linked - task value/total/progress linked ~ recalculate on change
     * @param precision - decimal places (default: `Task.decimal_precision` ~ `2`)
     * @param event_debounce - event debounce milliseconds (default: `Task.event_debounce` ~ `200`)
     */
    constructor(name: string, linked?: boolean, precision?: number, event_debounce?: number);
    /**
     * Get task data
     *
     * @returns `ITask` options ~ i.e. `{name, label, linked, precision, event_debounce, progress, total, value, error, status, startTime, endTime, complete, updated, item}`
     */
    get data(): () => ITask;
    /**
     * Update event trigger
     *
     * @returns `Task` instance
     */
    get update(): () => Task;
    /**
     * Add update event subscriber ~ `event = {type: 'update', data: ITask}`
     *
     * @param listener - event callback listener
     * @returns `(()=>void)` unsubscribe callback
     */
    subscribe(listener: (event: IEvent) => void): () => void;
    /**
     * Task start
     *
     * @returns `Task` instance
     */
    start(restart?: boolean): Task;
    /**
     * Task stop
     *
     * @returns `Task` instance
     */
    stop(): Task;
    /**
     * Task failed
     *
     * @returns `Task` instance
     */
    failure(error?: any): Task;
    /**
     * Task done
     *
     * @param fullProgress - [default: `true`] set `progress` to `100`% (linked default) //TODO: test fullProgress = true/false
     * @returns `Task` instance
     */
    done(fullProgress?: boolean): Task;
    /**
     * Set progress
     *
     * @param progress - task percentage progress (`0-100`)
     * @param _value - unlinked task `value` update ~ ignores `undefined`
     * @param _total - unlinked task `total` update ~ ignores `undefined`
     * @returns `Task` instance
     */
    setProgress(progress: number, _value?: number, _total?: number): Task;
    /**
     * Set total
     *
     * @param total
     * @returns `Task` instance
     */
    setTotal(total: number): Task;
    /**
     * Set value
     *
     * @param value
     * @returns `Task` instance
     */
    setValue(value: number): Task;
    /**
     * Set item
     *
     * @param item
     * @returns `Task` instance
     */
    setItem(item: any): Task;
    /**
     * Create instance from existing task options
     *
     * @param options - `ITask` options ~ i.e. `{name, label, linked, precision, event_debounce, progress, total, value, error, status, startTime, endTime, complete, updated, item}`
     * @param precision - decimal places (default: `Task.decimal_precision` ~ `2`)
     * @param event_debounce - event debounce milliseconds (default: `Task.event_debounce` ~ `200`)
     * @returns `Task` instance
     * @throws validation `Error`
     */
    static create(options: ITask, precision?: number, event_debounce?: number): Task;
}
export {};
