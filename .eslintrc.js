module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings'
    ],
    env: {
        node: true,
        es6: true
    },
    globals: {
        fin: 'readonly',
        browser: 'readonly'
    },
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2016,
        sourceType: 'module'
    },
    rules: {
        quotes: ['error', 'single'],
        indent: [2, 4],
        'import/named': 2,
        'import/namespace': 2,
        'import/default': 2,
        'import/export': 2
    },
    'import/no-unresolved': true
}