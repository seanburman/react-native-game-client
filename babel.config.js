module.exports = function (api) {
    api.cache(false);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            ["react-native-reanimated/plugin"],
            ["@babel/plugin-proposal-export-namespace-from"],
            [
                "module:react-native-dotenv",
                {
                    path: ".env",
                },
            ],
        ],
    };
};
