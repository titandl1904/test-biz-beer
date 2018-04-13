/* eslint-disable import/no-extraneous-dependencies, global-require */
const path = require('path');

const pathsrc = path.resolve(__dirname, 'src');

const webpack = require('webpack');

module.exports = function (config) {
	const configuration = {
		basePath: './',
		singleRun: true,
		autoWatch: false,
		logLevel: 'INFO',
		failOnEmptyTestSuite: false,
		browsers: [
			'PhantomJS'
		],
		frameworks: [
			'jasmine'
		],
		files: [
			'src/index.spec.js'
		],
		preprocessors: {
			'src/index.spec.js': ['webpack'],
			'src/**/*.html': ['ng-html2js']
		},
		ngHtml2JsPreprocessor: {
			stripPrefix: `${pathsrc}/`
		},
		reporters: ['progress', 'coverage'],
		coverageReporter: {
			dir: 'target',
			includeAllSources: true,
			reporters: [{
				type: 'html',
				subdir: 'report-coverage'
			}, {
				type: 'json',
				subdir: 'report-json'
			}, {
				type: 'text-summary',
				watermarks: {
					statements: [95.38, 97.38],
					branches: [81.81, 83.81],
					functions: [95.96, 97.96],
					lines: [95.77, 97.77]
				}
			}],
			instrumenterOptions: {
				istanbul: {
					noCompact: true
				}
			}
		},
		webpack: require('./webpack.config.js'),
		webpackMiddleware: {
			noInfo: true
		},
		plugins: [
			require('karma-jasmine'),
			require('karma-coverage'),
			require('karma-phantomjs-launcher'),
			require('karma-phantomjs-shim'),
			require('karma-ng-html2js-preprocessor'),
			require('karma-webpack'),
			require('karma-sourcemap-loader')
		],
		browserNoActivityTimeout: 100000,
		browserDisconnectTolerance: 2
	};

	config.set(configuration);
};
