import 'babel-polyfill';
import 'angular/angular';
import 'angular-mocks/angular-mocks';

angular.module('test.Config', [])
	.provider('externalConfig', () => ({
		parentState: '',
		$get: () => {}
	}));

const context = require.context('./demo', true, /spec\.js$/);
context.keys().forEach(context);
