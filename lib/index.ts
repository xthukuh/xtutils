/**
 * Say Hello!
 * 
 * @param name
 */
export const _utilsHello = (name?: string): void => {
	const _timestamp = (): string => {
		const _pad = (v:any): string => `${v}`.padStart(2, '0');
		const d = new Date();
		return `${d.getFullYear()}-${_pad(d.getMonth()+1)}-${_pad(d.getDate())} ${_pad(d.getHours())}:${_pad(d.getMinutes())}:${_pad(d.getSeconds())}`;
	};
	name = name?.length ? name : 'Thuku';
	console.log(`[x] ${_timestamp()} - Hello ${name}!`);
}