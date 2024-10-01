(() => {
	const _parse_date = val => { // {Date|undefined}
		if (val instanceof Date) return !isNaN(val = val.getTime()) ? new Date(val) : undefined;
		if (Number.isInteger(val)) return !isNaN((val = new Date(val)).getTime()) ? val : undefined;
		if (!/\d/.test((val = String(val)).trim())) return undefined;
		// parse text + timezone hack
		const time_match = val.match(/(^|\s)(\d{1,2}):(\d{2})(:\d{2}(\.\d{1,3})?)?/);
		let time_text = '00:00:00';
		if (time_match){
			if (!(val = val.replace(time_match[0], '').trim())) val = '1970-01-01';
			time_text = time_match[0].trim().split(':').concat('0').slice(0, 3).map(v => v.indexOf('.') < 0 ? v.padStart(2, '0') : v.split('.').map((s, i) => !i ? s.padStart(2, '0') : s).join('.')).join(':');
		}
		if (isNaN(val = Date.parse(val))) return undefined;
		let date = new Date(val), year = date.getFullYear();
		date = new Date(String(year < 1970 ? 1970 : year) + '-' + [date.getMonth() + 1, date.getDate()].map(v => String(v).padStart(2, '0')).join('-') + ' ' + time_text);
		date.setFullYear(year);
		return date;
	};
	const tests = [
		"0005-03-01",
		"0005-03-01 00:00:00",
		"0005-03-01 21:30:45",
		"0005-03-01 21:30:45.455",
		"2001-05-02T21:30:45.455Z",
		"12/9/2000",
		"12/9/2000 9:30",
		"12/9/2000 006:30",
		"12/9/2000 21:30:45.455",
		"2000/12/23 21:30:45.455",
		"2000/23/12 21:30:45.455",
		"21:30:45.455",
	];
	tests.forEach(val => {
		const res = _parse_date(val);
		const txt = String(res);
		console.log({val, res, txt});
		console.log('----');
	});
	// const pattern = /^(?:(\d{2,4})-(\d{2})-(\d{2})|(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/(\d{2,4}))$/g;
	// YYYY|YY-MM-DD 23:59:59.999
	// MM-DD-YYYY|YY
	return;
	const regx = /(\d{1,4}[-\/](0?[1-9]|1[0-2])[-\/](0?[1-9]|[12][0-9]|3[01])|(0?[1-9]|1[0-2])[-\/](0?[1-9]|[12][0-9]|3[01])[-\/](\d{1,4}))/;
	const reg1 = /(\d{1,4})[-\/](0?[1-9]|1[0-2])[-\/](0?[1-9]|[12][0-9]|3[01])/;
	const reg2 = /(0?[1-9]|1[0-2])[-\/](0?[1-9]|[12][0-9]|3[01])[-\/](\d{1,4})/;
	const regt = /(\d{1,2}):(\d{1,2})(:\d{1,2}(\.\d{1,3})?)?/;
	const texts = [
		"0005-03-01",
		"0005-03-01 21:30:45",
		"0005-03-01 21:30:45.455",
		"2001-05-02T21:30:45.455Z",
		"12/9/2000",
		"12/9/2000 9:30",
		"12/9/2000 21:30:45.455",
		"2000/23 21:30:45.455",
		"2000-01-01",
		"2023-12-25",
		"03/15/2021",
		"12/25/2020",
		"2020/12/25",
		"2000-13-01",
		"12/32/2000",
	];
	texts.forEach(val => {
		const _matches = (v, r) => {
			let m = null;
			v.replace(r, (...args) => m = args);
			// return m;
			return v.match(r);
		};
		val = String(val).trim();
		let pattern = [reg1, reg2].find(r => r.test(val));
		let date_matches = pattern ? _matches(val, pattern) : undefined;
		let time_matches = regt.test(val) ? _matches(val, regt) : undefined;
		console.log({val, date_matches, time_matches});
		console.log('----');
	});
})();