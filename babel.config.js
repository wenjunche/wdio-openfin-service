module.exports = {
    presets: [
        ['@babel/preset-typescript']
    ],
    plugins: [
        '@babel/plugin-proposal-function-bind',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-catch-binding'
    ],
    env: {
        development: {
            sourceMaps: 'inline',
            plugins: ['source-map-support']
        }
    }
}