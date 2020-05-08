const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css')

module.exports = withCss(withSass({
    env: {
        MIX_PUSHER_APP_KEY: "4a726b0027184c3ac752",
        MIX_PUSHER_APP_CLUSTER: "eu"
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
        return config;
    }
}));