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
	_str,
	_parseCsv,
	_toCsv,
	_filepath,
	_split,
	_int,
	_mime,
	EXT_MIMES,
	_basename,
	IMimeType,
	_parseDataUri,
	_values,
	_empty,
	_posInt,
	_date,
	_posNum,
	_num,
	_jsonParse,
	_pending,
	PENDING_CACHE,
	_pendingAbort,
	IPendingPromise,
	PendingAbortError,
} from '../lib';

(async()=>{

	//test
	const _do_test = (key: string): void => {

		//test promise
		const _test = async (v: any, fail: any = 0): Promise<any> => {
			const num = _rand(100, 1000);
			Term.debug('----- start:', key, v, num);
			await _sleep(3000);
			const res = v + '=' + num;
			Term.debug('----- done:', key, fail, res, Date.now() - ts);
			return fail ? Promise.reject(res) : res;
		};

		//a
		const ts = Date.now();
		Term.debug('--- a', key);
		Term.debug('+++ a', key, Date.now() - ts);
		_pending(key, () => _test('a'), 0, true)
		.then(res => Term.success('<< a:', key, res)).catch(err => Term.warn('<< a:', key, err)); //.finally(() => Term.log(Date.now() - ts, {a: PENDING_CACHE[key]}));
		
		//b
		Term.debug('--- b', key);
		setTimeout(() => {
			Term.debug('+++ b', key, Date.now() - ts);
			_pending(key, () => _test('b', true))
			.then(res => Term.success('<< b:', key, res)).catch(err => Term.warn('<< b:', key, err)); //.finally(() => Term.log(Date.now() - ts, {b: PENDING_CACHE[key]}));
		}, 1000);

		//c
		let c: IPendingPromise;
		Term.debug('--- c', key);
		setTimeout(() => {
			Term.debug('+++ c', key, Date.now() - ts);
			c = _pending(key, () => _test('c', 0), 3);
			// c.then(res => Term.success('<< c:', res)).catch(err => Term.warn('<< c:', err)); //.finally(() => Term.log(Date.now() - ts, {c: PENDING_CACHE[key]}));
			c.then(res => Term.success('<< c:', key, res)).catch(err => {
				Term.warn('<< c:', key, err);
				if (err instanceof PendingAbortError) err.pending.promise.then(res => Term.success('<<< c:', key, res)).catch(err => Term.warn('<<< c:', key, err));
			});
		}, 1500);

		//d
		Term.debug('--- d', key);
		setTimeout(() => {
			Term.debug('+++ d', key, Date.now() - ts);
			const d = _pending(key, () => _test('d'), 3)
			console.log(PENDING_CACHE[key]);
			d.then(res => Term.success('<< d:', key, res)).catch(err => Term.warn('<< d:', key, err)); //.finally(() => Term.log(Date.now() - ts, {d: PENDING_CACHE[key], c: c.pending}));
		}, 5800);
	};

	//tests
	_do_test('AAA');
	setTimeout(() => {
		_do_test('BBB');
	}, 2000);

	//abort
	if (1) setTimeout(() => {
		const abort_key = '';
		const remove = false;
		Term.info('============= abort...', {key: abort_key, remove});
		_pendingAbort(remove, abort_key, 'Cancelled by timeout.');
	}, 3500);
})()
.catch(error => {
	Term.error(`[E] ${error?.stack || error}`);
});