module.exports = {
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
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
    }
}