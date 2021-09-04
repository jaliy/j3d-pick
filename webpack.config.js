/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/index.ts",
    mode: 'development',
    target: "web",
    output: {
        filename: "[name].[hash].js",
        path: __dirname + "/dist",
        clean: true,
        assetModuleFilename: 'assets/[name][ext][query]'
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    devtool: 'inline-source-map',
    devServer: {
        host: '0.0.0.0',
        port: '3000',
        contentBase: './dist',
        hot: true
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            { test: /\.less$/i, use: ['style-loader', 'css-loader', 'less-loader']},
            { test: /\.tsx?$/, loader: "ts-loader" },
            { test: /\.js$/, enforce: "pre", loader: "source-map-loader" },
            { test: /\.gltf$/, loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: 'body',
            scriptLoading: 'blocking'
        }),

        new CopyPlugin({
            patterns: [
                { from: "assets", to: "assets" }
            ]
        })
    ]
};