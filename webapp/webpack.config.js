const path = require('path');

const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSPlugin = require('css-minimizer-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

// const CopyPlugin = require('copy-webpack-plugin');
// const WebpackPwaManifest = require('webpack-pwa-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// load the common .env.yml
require('../utils/env').config(path.resolve(__dirname, '../env.yml'));

const isProd = process.env.NODE_ENV === 'production';

let baseUrl = `${process.env.BASE_URL || (process.env.AWS_STAGE ? '/' + process.env.AWS_STAGE: '')}`;
if (!baseUrl.endsWith('/')) baseUrl+= '/';

const options = {
    mode: isProd ? 'production' : 'development',
    entry: {
        // this is bundle for the main app
        'app': './public-src/main.js',
    },
    output: {
        path: path.resolve(__dirname, './public/js'),
        publicPath: '/public/js',
        filename: 'build.[name].js',
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },

            // this will apply to both plain `.js` files
            // AND `<script>` blocks in `.vue` files
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules\/(?!(vuetify)\/)/,
            },

            // this will apply to both plain `.css` files
            // AND `<style>` blocks in `.vue` files
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                        // you can specify a publicPath here
                        // by default it uses publicPath in webpackOptions.output
                            // publicPath: '../',
                        },
                    },
                    'css-loader',
                ],
            },

            {
                test: /\.s(c|a)ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        // Requires sass-loader@^8.0.0
                        options: {
                            // implementation: require('sass'),
                            sassOptions: {
                                indentedSyntax: true, // optional
                                quietDeps: true
                            },
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        alias: {
            'vue$': path.resolve(__dirname, './node_modules/vue/dist/vue.runtime.esm.js'),

            // this will make '@' available only in the 'app' folder
            '@': path.join(__dirname, 'public-src'),
        },
        extensions: ['*', '.js', '.vue', '.json',],
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true,
    },
    performance: {
        hints: 'warning',
    },
    plugins: [
        new VueLoaderPlugin(),

        new VuetifyLoaderPlugin(),

        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: '../styles/build.[name].css',
            chunkFilename: '../styles/build.[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),

        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
        }),

        // http://vue-loader.vuejs.org/en/workflow/production.html
        // https://vuejs.org/v2/guide/deployment.html
        // Run Vue.js in production mode - less warnings and etc...
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isProd ? '"production"' : '"development"',
                BASE_URL: `"${baseUrl}"`,
                VAPID_PUBLIC_KEY: `"${process.env.VAPID_PUBLIC_KEY}"`,
            },
        }),

        // new CopyPlugin({
        //     patterns: [
        //         './public-src/service-worker.js',
        //         {
        //             from: './public-src/manifest.json',
        //             to: '../',
        //         }
        //     ],
        // }),
        // new WebpackPwaManifest({
        //     fingerprints: false,
        //     inject: false,
        //     filename: '../manifest.json',

        //     // the actual manifest options inside
        //     name: 'Expirations Report',
        //     short_name: 'Expirations',
        //     scope: '/dev/',
        //     start_ulr: '../',
        //     display: 'standalone',
        //     theme: '#4DBA87',
        //     background_color: '#000000',
        //     orientation: 'omit',
        // }),
        // use the HtmlWebpackPlugin to create a template for manifest.json file as it needs to be dynamic
        new HtmlWebpackPlugin({
            inject: false,
            filename: '../manifest.json',
            templateContent: () => `
            {
                "name": "Expirations Report",
                "short_name": "Expirations",
                "display": "standalone",
                "scope": "${baseUrl}",
                "start_url": "${baseUrl === '/' ? '.' : '../'}",
                "theme": "#4DBA87",
                "background_color": "#000000",
                "icons": [
                    {
                        "src": "https://my-ru-public.s3.eu-west-1.amazonaws.com/my-expirations-check/img/icons/android-chrome-192x192.png",
                        "sizes": "192x192",
                        "type": "image/png"
                    },
                    {
                        "src": "https://my-ru-public.s3.eu-west-1.amazonaws.com/my-expirations-check/img/icons/android-chrome-512x512.png",
                        "sizes": "512x512",
                        "type": "image/png"
                    }
                ]
              }
            `
        })
    ],
    devtool: 'eval-source-map',
    optimization: {
        concatenateModules: false,
    },
};

if (isProd) {
    // mp source-map
    options.devtool = false;

    options.optimization = {
        minimizer: [
            new OptimizeJSPlugin(),
            new OptimizeCSSPlugin(),
        ],
    };

    options.performance = {
        hints: false,
    };
}

module.exports = options;
