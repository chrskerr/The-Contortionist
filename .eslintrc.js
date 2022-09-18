module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
		jest: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'next',
	],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	plugins: ['react', '@typescript-eslint'],
	rules: {
		eqeqeq: 'error',
		'prefer-const': 'error',
		'prefer-spread': 'error',
		'no-loop-func': 'error',
		'no-undef': 'error',
		'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/consistent-type-imports': 'error',
		'react-hooks/exhaustive-deps': 'off',
	},
};
