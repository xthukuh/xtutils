import { _sayHello } from './_hello';

//tests
describe("Testing \`_sayHello:(name?:string)=>string\` function", () => {
	
	//default
	it(`calling \`_sayHello()\` should print and return "[x] - Hello Thuku!".`, () => {
		expect(_sayHello()).toBe('[x] - Hello Thuku!');
	});
	
	//with argument
	it(`calling \`_sayHello('Martin')\` should print and return "[x] - Hello Martin!".`, () => {
		expect(_sayHello('Martin')).toBe('[x] - Hello Martin!');
	});
});