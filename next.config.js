module.exports = {
    env: {
        MIX_PUSHER_APP_KEY: "4a726b0027184c3ac752",
        MIX_PUSHER_APP_CLUSTER: "eu",
        WS_HOST: "fpm"
    },
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
};