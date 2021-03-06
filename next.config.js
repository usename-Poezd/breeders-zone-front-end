module.exports = {
    webpack (config, options) {
        config.module.rules.push({
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 100000
                }
            }
        });

        if (!options.isServer) {
            config.node = {
                fs: 'empty'
            }
        }

        return config;
    },
    webpackDevMiddleware: config => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        };
        return config
    },
    env: {
        API_PUBLIC_URL: process.env.API_PUBLIC_URL,
        GEO_API_KEY: process.env.GEO_API_KEY,
        API_URL: process.env.API_URL,
        NEXT_PUBLIC_YM_ACCOUNT: process.env.NEXT_PUBLIC_YM_ACCOUNT,
    }
};
