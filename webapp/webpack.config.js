const path = require('path');

const webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

const isProd = process.env.NODE_ENV === 'production';

const options = {
    mode: isProd ? 'production' : 'development',
    entry: {
        // this is bundle for the Vue, VueMaterial (or Vuetify)
        // 'vue': './public-src/vue.js',

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

            // TODO:
            // {
            //     test: /\.css$/,
            //     use: ExtractTextPlugin.extract({
            //         fallback: 'style-loader',
            //         use: 'css-loader',
            //     }),
            // },

            // this will apply to both plain `.css` files
            // AND `<style>` blocks in `.vue` files
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
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
                            implementation: require('sass'),
                            sassOptions: {
                                fiber: require('fibers'),
                                indentedSyntax: true, // optional
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
        hints: false,
    },
    plugins: [
        new VueLoaderPlugin(),

        new VuetifyLoaderPlugin(),

        // extract the 'boot' entry, the one containing Vue and VueMaterial (or Vuetify) as
        // it will be included in every page
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vue',
        //     // minChunks: function (module, count) {
        //     //   // any required modules inside node_modules are extracted to vendor
        //     //   return (
        //     // 	module.resource &&
        //     // 	/\.js$/.test(module.resource) &&
        //     // 	module.resource.indexOf(
        //     // 	  path.join(__dirname, '../node_modules')
        //     // 	) === 0
        //     //   )
        //     // }
        // }),

        // TODO:
        // extract CSS nad LESS into own files
        // new ExtractTextPlugin({ filename: '../styles/build.[name].css', }),

        
    ],
    devtool: '#eval-source-map',
    optimization: {
        concatenateModules: false,
    },
};

if (isProd) {
    // mp source-map
    options.devtool = false;


    options.optimization = {
        minimizer: [
            new UglifyJsPlugin({
                test: /\.js(\?.*)?$/i,
            }),
        ],
    };

    options.plugins = (options.plugins || []).concat([
        // http://vue-loader.vuejs.org/en/workflow/production.html
        // https://vuejs.org/v2/guide/deployment.html
        // Run Vue.js in production mode - less warnings and etc...
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
        }),
    ]);
}

module.exports = options;
