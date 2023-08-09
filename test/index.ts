import {
	_sayHello,
	_cloneDeep,
	_jsonStringify,
	_animate,
	Easings,
	_hashCode,
	_hash53,
	_base64Encode,
	_base64Decode,
	_uuid,
	_round,
	_minMax,
	_compareShallow,
	_rand,
	_asyncAll,
	_sleep,
	_asyncValues,
	Term,
	Tasks,
	Task,
} from '../lib';

(async()=>{
	
	//test task job
	const _task_job = async (task: Task, stops: boolean = false, fails: boolean = false) => {
		const loop = 5;
		const max = 2000;
		const num = Math.ceil(max/loop);
		let sum = task.value;

		//delay
		const _delay = async () => {
			const ms = _rand(800, 1500);
			Term.debug(task.name, `--- delay ${ms}ms...`);
			await _sleep(ms);
		};

		//setTotal
		Term.debug(task.name, `=== setTotal=${max}`);
		task.setTotal(max);

		//data before
		Term.debug(task.name, '=== data before:', _jsonStringify(task.data()));
		
		//start
		Term.debug(task.name, '=== start:', _jsonStringify(task.data()));
		task.start();

		//updates
		while (sum < max){
			await _delay();
			sum += _rand(Math.floor(num/2), num); //increment
			if (sum > max) sum = max;

			//stops
			if (stops && sum >= Math.ceil(max/(loop/2))){
				Term.debug(task.name, '=== stops');
				task.stop();
				break;
			}

			//fails
			if (fails && sum >= Math.ceil(max/(loop/2))){
				Term.debug(task.name, '=== fails');
				task.failure(new Error('Test error message.'));
				break;
			}
			
			//setValue
			Term.debug(task.name, '=== setValue: ', sum);
			task.setValue(sum);

			//setProgress
			if (!task.linked){
				const progress = sum/max * 100;
				Term.debug(task.name, `=== setProgress - ${sum}/${max} * 100 = %s %`, progress);
				task.setProgress(progress);
			}
		}

		//done
		if (fails || task.progress === 100){
			Term.debug(task.name, '=== done:', _jsonStringify(task.data()));
			task.done();
		}
		
		//data after
		Term.debug(task.name, '=== data after:', _jsonStringify(task.data()));
	};

	//test tasks
	const count = 5;
	const precision = undefined;
	const event_debounce = undefined;
	const tasks = new Tasks(precision, event_debounce);
	const _uns = tasks.subscribe(event => {
		const {tasks, ...data} = event.data;
		Term.success(`<< tasks event:`, data.progress, _jsonStringify(data));
	});
	const t_uns: any = {};
	const items: Task[] = [...Array(count)].map((_, i) => {
		const name = 'T' + i;
		const linked = i < 4;
		const event_debounce = undefined;
		// const precision = 3;
		// const t = new Task(name, linked, precision);
		const t = tasks.add(name, linked, event_debounce);
		const _un = t.subscribe(event => {
			Term.debug(`--- ${t.name} event:`, event.data.progress, _jsonStringify(event));
		});
		t_uns[t.name] = _un;
		return t;
	});
	Term.success('<< tasks added:', _jsonStringify(tasks.data()));
	await _asyncAll(items, async (t, i) => {
		const fails = i === 2;
		const stops = i === 3;
		Term.info(`>> ${t.name} test job`, {fails, stops});
		await _task_job(t, stops, fails);
		if (stops){
			Term.info(`>> ${t.name} test resume job...`);
			await _sleep(1000);
			await _task_job(t);
		}
		t_uns[t.name]();
	});
	_uns();
	Term.success('<< tasks done:', _jsonStringify(tasks.data()));
})()
.catch(error => {
	Term.error(`[E] ${error?.stack || error}`);
});