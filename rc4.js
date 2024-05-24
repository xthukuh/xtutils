(() => {
	const args = process.argv.slice(2);
	const text = args[0];
	const password = args[1];
	const mathogothanio = rc4(text, password);
	const text2 = rc4(mathogothanio, password);
	console.log(JSON.stringify({text, password, mathogothanio, text2}, undefined, 2));
})();

/**
 * RC4 Encryption cypher
 * - gũthogothania gũthigitha
 * 
 * @param {*} text 
 * @param {*} password 
 * @returns 
 */
function rc4(text, password=undefined){
	if (!(text = String(text ?? ''))) return '';
	password = String(password ?? 'Hingũra');
	const S = [], K = [];
	for (let i = 0; i < 256; i ++){
		S[i] = i;
		K[i] = password.charCodeAt(i % password.length);
	}
	let j = 0;
	for (let i = 0; i < 256; i ++){
		j = (j + S[i] + K[i]) % 256;
		[S[i], S[j]] = [S[j], S[i]];
	}
	let result = '', i = 0; j = 0;
	for (let n = 0; n < text.length; n ++){
		j = (i + 1) % 256;
		j = (j + S[i]) % 256;
		[S[i], S[j]] = [S[j], S[i]];
		const keystream = S[(S[i] + S[j]) % 256];
		result += String.fromCharCode(text.charCodeAt(n) ^ keystream);
	}
	return result;
}