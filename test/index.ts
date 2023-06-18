import {
	_sayHello,
	_deepClone,
	_jsonStringify,
	_animate,
	Easings,
} from '../lib';

(async()=>{
	// _sayHello();

	//_deepClone
	console.log('');
	console.log('--test _deepClone');
	const language = {
		set current(name: any){
			this.log.push(name);
		},
		log: [] as any[],
	};
	language.current = 'EN';
	language.current = {name: 'test', items: [1, {age: 30}, 3], date: new Date()}
	const a = language;
	const b = _deepClone(a, {});
	b.current = 'BB';
	console.log({a, b}, a === b);

	let x: any = new Date(0);
	x.extra = 'epoch';
	let y: any = _deepClone(x);
	x.extra = 'changed';
	console.log({x, y}, x === y);

	//animate
	console.log('');
	console.log('--test _animate');
	_animate({
		update: val => console.log('--- update', val),
		duration: 1000,
		from: 100,
		to: 120,
		easing: Easings.easeInOutQuad,
	});
})();