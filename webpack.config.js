const path = require('node:path');

const glob = require('glob-all');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require('purgecss-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (opts, {mode}) => {
    return {
        devtool: mode === 'production' ? 'source-map' : 'eval-source-map',
        entry: './src/scripts/script.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'scripts.min.js',
        },
        devServer: {
            static: './dist',
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    styles: {
                        name: 'styles',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true
                    }
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.html/,
                    use: {
                        loader: 'html-loader',
                    }
                },
                {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.(s*)css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        [
                                            'postcss-mixins'
                                        ],
                                    ],
                                },
                            },
                        },
                        'sass-loader',
                    ],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: 'styles.min.css',
            }),

            new ImageminPlugin({test: /\.(jpe?g|png|gif|svg)$/i}),
            new HtmlWebpackPlugin({
                template: './index.html'
            }),
        ]
    };
};