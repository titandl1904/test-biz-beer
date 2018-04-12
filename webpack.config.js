/* eslint-disable angular/json-functions */
const path = require('path');
const webpack = require('webpack');
const config = require('./config/config.json');

const ENV_PRODUCTION = 'production';
const ENV_DEVELOPMENT = 'development';

const API_SERVER = process.env.API_SERVER;
const ENV = process.env.NODE_ENV || ENV_DEVELOPMENT;

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const WebpackUglifyJsPlugin = require('webpack-uglify-js-plugin');

const sourceDir = path.resolve(__dirname, 'src');
const targetDir = path.resolve(__dirname, 'dist');
const targetLib = path.resolve(__dirname, 'lib');

require('babel-polyfill');

module.exports = {
	context: sourceDir,

	devServer: {
		contentBase: './src',
		historyApiFallback: true,
		host: '0.0.0.0',
		disableHostCheck: true,
		proxy: [
			{
				context: [
					'/data/2.5/weather',
				],
				target: 'http://samples.openweathermap.org',
				secure: false
			}
		]
	},

	entry: {
		'app-demo': ['./demo/app.js']
	},

	output: {
		path: targetLib,
		filename: '[name].js'
	},

	resolve: {
		modules: ['node_modules'],
		extensions: ['.js']
	},

	module: {
		rules: [{
			test: /\.js$/,
			use: ['ng-annotate-loader', 'babel-loader'],
			include: [
				sourceDir
			]
		}, {
			test: /\.html$/,
			use: 'raw-loader',
			include: sourceDir
		},
		{
			test: /\.css$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader', 'postcss-loader']
			})
		},
		{
			test: /\.scss$/,
			use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: [{
					loader: 'css-loader',
					options: {
						minimize: true
					}
				}, 'postcss-loader', 'sass-loader'],
			}),
			include: sourceDir
		},
		{
			test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			use: 'url-loader'
		},
		{
			test: /\.(ttf|eot|svg|jpg|png|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			use: 'url-loader'
		},
		{
			test: /\.json$/,
			use: ['json-loader']
		}]
	},
	plugins: [

		new webpack.DefinePlugin({
		}),

		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			moment: 'moment',
			'window.jQuery': 'jquery'
		}),

		new ProgressBarPlugin(),

		new ExtractTextPlugin('[name].css')
	]
};

if (ENV === ENV_PRODUCTION) {

	module.exports.plugins.push(

		new WebpackUglifyJsPlugin({
			cacheFolder: path.resolve(__dirname, 'target'),
			debug: true,
			minimize: true,
			sourceMap: false,
			output: {
				comments: false
			},
			compressor: {
				warnings: false
			}
		}),
		new CopyWebpackPlugin([
			{
				from: './i18n/',
				to: path.resolve(__dirname, 'lib/i18n/')
			}
		])
	);

} else if (ENV === ENV_DEVELOPMENT) {

	module.exports.entry.vendor = [
		'@uirouter/angularjs',
		'angular',
		'angular-ui-bootstrap',
		'babel-polyfill',
		'bootstrap',
		'jquery',
		'normalize.css'
	];

	module.exports.plugins.push(
		new CopyWebpackPlugin([
			{
				from: './index.html',
				to: targetDir
			},
			{
				from: './i18n/',
				to: path.resolve(__dirname, 'dist/i18n/')
			}
		])
	);
	module.exports.output.path = targetDir;
}
