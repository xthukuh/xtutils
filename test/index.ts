import {
	_cr,
	_strKeyValues,
	_parseKeyValues,
	_mapValues,
	Term,
	_jsonParse,
	_num,
	_posInt,
	_str,

	_unescape,
	_escape,
	_utf8Encode,
	_utf8Decode,
	_strEscape,
	_sort,
	_jsonStringify,
	AlphaNum,
	_selectKeys,
	_base64Encode,
	_rc4,
	_base64Decode,
	_asyncAll,
	_sleep,
	_rand,
	IAnimateOptions,
	_animate,
	Easing,
	_elapsed,
	_duration,
} from '../lib';

//tests
(async(): Promise<any> => {
	let dates = [
		["1998-02-22","2008-05-19"], // 10Y 2M 27D
		["1998-02-22 00:00:00","2008-05-19 00:00:00"], // 10Y 2M 27D
		["1998-02-22T17:30:29.069Z", "2008-05-19T05:00:00.420Z"],
		// ["2023-11-20T17:30:29.069Z", "2012-01-19T05:00:00.420Z"],
	].forEach(([dt1, dt2]) => {
		const elapsed = _elapsed(dt1, dt2);
		console.log({dt1, dt2, elapsed});
		// const duration = _duration(dt1, dt2);
		// console.log({dt1, dt2, elapsed, duration});
	});
})();

/*
function calcAge3(birthday, currentDate){
	// Validate input dates
	if (!isValidDate(birthday) || !isValidDate(currentDate)) {
			// throw new Error("Invalid date format. Please use 'YYYY-MM-DDTHH:mm:ss.sssZ' format.");
			return null;
	}

	// Convert string dates to Date objects
	let start = Date.parse(birthday);
	let end = Date.parse(currentDate);
	start = Math.min(start, end);
	end = Math.max(start, end);
	start = new Date(start);
	end = new Date(end);

	// Ensure start date is earlier than end date
	if (start > end) {
			throw new Error("Birthday cannot be in the future.");
	}

	// Calculate the difference
	const diffTime = end - start;
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

	let years = end.getFullYear() - start.getFullYear();
	let months = end.getMonth() - start.getMonth();
	let days = end.getDate() - start.getDate();

	// Adjust for negative values
	if (days < 0) {
			months--;
			days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
	}
	if (months < 0) {
			years--;
			months += 12;
	}

	const hours = end.getHours() - start.getHours();
	const minutes = end.getMinutes() - start.getMinutes();
	const seconds = end.getSeconds() - start.getSeconds();
	const milliseconds = end.getMilliseconds() - start.getMilliseconds();

	return {
			start: start.toISOString(),
			end: end.toISOString(),
			years,
			months,
			days,
			hours,
			minutes,
			seconds,
			milliseconds,
			total_days: diffDays,
			total_time: diffTime
	};
}
const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;
const MONTH_MS = 30.44 * 24 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const SECOND_MS = 1000;
*/