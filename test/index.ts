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
} from '../lib';

//tests
(async()=>{

	const val: any = `Ng'ang'a is \n here \t y'all !\\! /*?*"quotes"`;
	console.log(`---- val:`, val);
	const esc: any = _sqlEscape(val);
	console.log(`---- esc: `, esc);

	//..
})()
.catch((error: any) => {
	Term.error(`[E] ${error?.stack || error}`);
});