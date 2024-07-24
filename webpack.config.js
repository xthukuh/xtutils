const path = require('path');
const {name} = require('./package.json');

module.exports = env => {
	let {mode, library} = Object(env);
	mode = mode === 'production' ? mode : 'development';
	library = 'string' === typeof library && /^[_a-z0-9]+$/.test(library) ? library : name;
	return {
		mode,
		devtool: 'inline-source-map',
		entry: {
			main: './lib/index.ts',
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: `${name}.min.js`,
			// libraryTarget: 'umd',
			// library,
			library: {
				name: library,
				type: 'umd',
			},
			globalObject: 'this',
			// umdNamedDefine: true,
		},
		resolve: {
			extensions: ['.ts', '.js', '.json'],
		},
		module: {
			rules: [
				{ 
					test: /\.tsx?$/,
					loader: 'ts-loader',
					options: {configFile: 'tsconfig.prod.json'},
				}
			]
		},
	};
};