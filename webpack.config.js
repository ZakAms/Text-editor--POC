const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const NODE_ENV = process.env.NODE_ENV || 'development'

const config = {
    entry: './src/js/index.js',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        modules: ['node_modules', 'src'],
        alias: {
            'froala-editor-js': path.resolve(__dirname, 'node_modules/froala-editor/js/froala_editor.pkgd.min.js'),
            'froala-code-view-plugin': path.resolve(__dirname, 'node_modules/froala-editor/js/plugins/code_view.min.js'),
            'codemirror-html-plugin': path.resolve(__dirname, 'node_modules/codemirror/mode/xml/xml.js'),
            'froala-draggable-plugin': path.resolve(__dirname, 'node_modules/froala-editor/js/plugins/draggable.min.js')
        },
    },
    module: {

        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: ['babel-plugin-transform-object-rest-spread', "babel-plugin-transform-object-assign"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            },
            {
                test: /\.(png|gif|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?name=[name].[ext]'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'less-loader' }
                ]
            },
            // {
            //   test: /\.(png|ico|jpg|jpeg|gif)$/,
            //   use: [
            //
            //     {loader: 'url-loader'},
            //     {loader: 'file-loader'},
            //   ]
            // }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            CodeMirror: 'codemirror'
        }),
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new CopyWebpackPlugin([
            { from: 'src/images', to: 'images' }
        ])
    ]
};

if (NODE_ENV === 'production') {
    config.plugins = config.plugins.concat([
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ])
}

module.exports = config