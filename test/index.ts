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
	_dotGet,
	_dotFlat,
	_dotInflate,
	_sqlEscape,
	_today,
	_datetime,
	_midnight,
	_yesterday,
	_tomorrow,
	_monthStart,
	_monthEnd,
	_monthDays,
} from '../lib';

//tests
(async()=>{
	let val: any;

	//-- today
	Term.log('--- today', [val = _today(), _datetime(val)]);
	Term.log('');
	
	//args
	let param: any = _str(process.argv[2], true);
	if (param === 'undefined') param = undefined;
	else if (param === 'null') param = undefined;
	else if (param === 'new') param = new Date();
	console.log('>> ' + _jsonStringify(param));

	//-- date
	let date: any = _date(param);
	Term.log('--- date', _jsonStringify([date, _datetime(date)]));
	// Term.log('');

	//-- midnight
	Term.log('--- midnight', _jsonStringify([val = _midnight(date), _datetime(val)]));
	// Term.log('');

	//-- yesterday
	Term.log('--- yesterday', _jsonStringify([val = _yesterday(date), _datetime(val)]));
	// Term.log('');

	//-- tomorrow
	Term.log('--- tomorrow', _jsonStringify([val = _tomorrow(date), _datetime(val)]));
	// Term.log('');

	//-- month start
	Term.log('--- month start', _jsonStringify([val = _monthStart(date), _datetime(val)]));
	// Term.log('');
	
	//-- month end
	Term.log('--- month end', _jsonStringify([val = _monthEnd(date), _datetime(val)]));
	// Term.log('');

	//-- month days
	Term.log('--- month days', _jsonStringify([val = _monthDays(date)]));
	// Term.log('');
})()
.catch((error: any) => {
	Term.error(`[E] ${error?.stack || error}`);
});