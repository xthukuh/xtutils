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
} from '../lib';

//tests
(async()=>{
	
	//test item
	const item: any = demoItem();
	// item.nums = [1, 2, 3, {four: [4, 'four']}];

	// //test dot - flat/inflate
	// const flat = _dotFlat(item);
	// const inflated = _dotInflate(flat);
	// console.log('=============================================');
	// console.log('-- item:', item);
	// console.log('');
	// console.log('=============================================');
	// console.log('-- flat:', flat);
	// console.log('');
	// console.log('=============================================');
	// console.log('-- inflated:', inflated);
	// console.log('=============================================');
	// console.log('-- match:', _jsonStringify(item) === _jsonStringify(inflated));

	//test dot - get
	console.log('=============================================');
	let path = 'Visit_Plan__r.attributes.type';
	console.log(`-- dot get (${path}) default (pass):`, _dotGet(path, item));
	console.log('');
	console.log('=============================================');
	path = 'visit_plan__r.attributes.type';
	console.log(`-- dot get (${path}) default (fails):`, _dotGet(path, item));
	console.log('');
	console.log('=============================================');
	path = 'visit_plan__r.Attributes.TYPE';
	console.log(`-- dot get (${path}) ignoreCase (pass):`, _dotGet(path, item, true));
	console.log('');

	//test replace
	console.log('=============================================');
	console.log('--- replace dot path pattern.');
	const re = /\{([_0-9a-zA-Z]+)((\.[_0-9a-zA-Z]+)+)\}/g
	const text = `SELECT * FROM Test_Object__c WHERE Id = '{visits.Id}' AND name = '{visits.Account__r.name}' AND Status__c = '{visits.Visit_Plan__r.status__c}' LIMIT 10`;
	const matches: any = [];
	const res = text.replace(re, (...args: any[]) => {
		const type = args[1];
		const path = args[2].replace(/^\./, '').trim();
		matches.push([type, path]);
		return _dotGet(path, item, true);
	});
	console.log(`-- text: "${text}"`);
	console.log(`-- replaced: "${res}"`);
	console.log(`-- pattern: "${re}"`);
	console.log(`-- matches:`, matches);
})()
.catch((error: any) => {
	Term.error(`[E] ${error?.stack || error}`);
});
function demoItem(){
	return {
		"Account__c": "0012600001RTLwwAAH",
		"Account__r": {
			"County__c": null,
			"Customer_No__c": null,
			"Customer_Type__c": null,
			"Division__c": null,
			"GPS_Updated__c": false,
			"Geo_Code__Latitude__s": -15.4078,
			"Geo_Code__Longitude__s": 28.35055,
			"Last_Order_Date__c": null,
			"Location__c": null,
			"Name": "KALINGALINGA SERVICE STATION",
			"Province__c": "Lusaka",
			"Sales_Office_2__c": null,
			"Sub_Location__c": null,
			"Total_Amount__c": null,
			"Total_Revenue__c": 0,
			"attributes": {
				"type": "Account",
				"url": "/services/data/v55.0/sobjects/Account/0012600001RTLwwAAH"
			}
		},
		"Checkin_DateTime__c": null,
		"Checkin_Location__c": null,
		"Checkout_DateTime__c": null,
		"Checkout_Location__c": null,
		"Id": "a052600000GinCwAAJ",
		"Name": "KALINGALINGA SERVICE STATION - 2023-09-18",
		"Reason__c": null,
		"Status__c": "Planned",
		"Visit_Plan_Date__c": "2023-09-20",
		"Visit_Plan__c": "a0626000009N5IYAA0",
		"Visit_Plan__r": {
			"Status__c": "Approved",
			"attributes": {
				"type": "Visit_Plan__c",
				"url": "/services/data/v55.0/sobjects/Visit_Plan__c/a0626000009N5IYAA0"
			}
		},
		"attributes": {
			"type": "Visit__c",
			"url": "/services/data/v55.0/sobjects/Visit__c/a052600000GinCwAAJ"
		},
		"latitude": -15.4078,
		"longitude": 28.35055,
		"name": "KALINGALINGA SERVICE STATION"
	};
}