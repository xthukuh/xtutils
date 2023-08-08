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
    tasks: {
        [name: string]: ITask;
    };
}
/**
 * `Symbol` private props key name
 */
declare const PROPS: unique symbol;
/**
 * @class Tasks
 */
export declare class Tasks {
    /**
     * Tasks global event debounce milliseconds (default: `200`)
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
        precision: number;
        event_debounce: number;
        updated: boolean;
        _tasks: Map<string, Task>;
        _unsubscribe: Map<string, () => void>;
        _emitter: EventEmitter;
        _debounced_update: () => void;
    };
    /**
     * Tasks count
     */
    get size(): number;
    /**
     * Task precision ~ positive `integer` [default `2`]
     */
    get precision(): number;
    /**
     * Task event debounce milliseconds (default: `Tasks.event_debounce` ~ `200`)
     */
    get event_debounce(): number;
    /**
     * Task updated
     */
    get updated(): boolean;
    /**
     * Create new instance
     *
     * @param precision - decimal places (default: `Tasks.decimal_precision` ~ `2`)
     * @param event_debounce - event debounce milliseconds (default: `Tasks.event_debounce` ~ `200`)
     */
    constructor(precision?: number, event_debounce?: number);
    /**
     * Get tasks data
     *
     * @returns `ITasksData` options ~ i.e. `{precision, event_debounce, updated, size, progress, running, started, complete, startTime, endTime, elapsedTime, tasks}`
     */
    get data(): () => ITasksData;
    /**
     * Update event trigger
     *
     * @returns `Task` instance
     */
    get update(): () => Tasks;
    /**
     * Add update event subscriber ~ `event = {type: 'update', data: ITask}`
     *
     * @param listener - event callback listener
     * @returns `(()=>void)` unsubscribe callback
     */
    subscribe(listener: (event: IEvent) => void): () => void;
    /**
     * Check if task name exists
     *
     * @param name
     * @returns `boolean`
     */
    has(name: string): boolean;
    /**
     * Add task instance
     *
     * @param task
     * @returns `Task`
     */
    task(task: Task): Task;
    /**
     * Add new task
     *
     * @param name - task name
     * @param linked - task value/total/progress linked ~ recalculate on change
     * @param event_debounce - event debounce milliseconds (default: `Task.event_debounce` ~ `200`)
     * @returns `Task`
     */
    add(name: string, linked?: boolean, event_debounce?: number): Task;
    /**
     * Create task from existing task data
     *
     * @param options - `ITask` options ~ i.e. `{name, label, linked, precision, event_debounce, progress, total, value, error, status, startTime, endTime, complete, updated, item}`
     * @param event_debounce - event debounce milliseconds (default: `Task.event_debounce` ~ `200`)
     * @returns `Task`
     */
    create(options: ITask, event_debounce?: number): Task;
    /**
     * Get task by name
     *
     * @param name
     * @returns `Task`
     */
    get(name: string): Task | undefined;
    /**
     * Remove task by name
     *
     * @param name
     * @returns `Tasks` instance
     */
    remove(name: string): Tasks;
}
export {};
