/**
 * RC4 encrypt/decrypt text value
 * 
 * @param text - parse text
 * @param key - cypher key (default: `'alohomora'`)
 * @returns `string`
 */
export function _rc4(input: any, pass?: string): Buffer|string
{
	const is_buffer = Buffer.isBuffer(input);
	const data = is_buffer ? input : Buffer.from(String(input ?? ''), 'binary');
	if (!data.length) return is_buffer ? Buffer.from('') : '';
	let S = Array.from({ length: 256 }, (_, i) => i);
	let j = 0;
	pass = String(pass ?? 'alohomora');
	const key = Array.from(pass).map(c => c.charCodeAt(0));
	for (let i = 0; i < 256; i ++) {
		j = (j + S[i] + key[i % key.length]) % 256;
		[S[i], S[j]] = [S[j], S[i]];
	}
	let i = 0, k = 0, result = '';
	const buffer = Buffer.from(new Uint8Array(data.length) as any);
	for (let n = 0; n < data.length; n++) {
		i = (i + 1) % 256;
		k = (k + S[i]) % 256;
		[S[i], S[k]] = [S[k], S[i]];
		const key_stream = S[(S[i] + S[k]) % 256];
		const transformed_byte = data[n] ^ key_stream;
		if (is_buffer) buffer[n] = transformed_byte;
		else result += String.fromCharCode(transformed_byte);
	}
	return is_buffer ? buffer : result;
};