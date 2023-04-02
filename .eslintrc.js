module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:react/recommended'],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	plugins: ['react', 'react-hooks'],
	rules: {
		'prefer-const': 'error',
		'prefer-spread': 'error',
		'func-call-spacing': ['error', 'never'],
		'no-loop-func': 'error',
		'no-undef': 'error',
		'react-hooks/rules-of-hooks': 'error',
	},
};
