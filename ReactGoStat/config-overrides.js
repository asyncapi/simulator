module.exports = (config, env) => {
    config.module.rules.push({
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
            {
                loader: 'file-loader',
            },
        ],
    });
    return config;
};
