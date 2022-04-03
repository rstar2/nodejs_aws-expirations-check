module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: ['inline-dotenv'],
        env: {
            production: {
                // in production bundle remove any console.xxx statements
                plugins: ['transform-remove-console']
            }
        }
    };
};
