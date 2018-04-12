/* eslint-disable max-len */
import 'normalize.css';

import angular from 'angular';

import uiRouter from '@uirouter/angularjs';

import Common from './common/common';
import Components from './components/components';
import Services from './services/services';

import AppComponent from './app.component';

require('./app.scss');

angular.module('app', [
	uiRouter,

	Common,
	Components,
	Services
])

.config(($locationProvider, $stateProvider, $urlRouterProvider) => {
	'ngInject';

	$locationProvider.hashPrefix('');

	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('home', {
			url: '/',
			component: 'home'
		})
		.state('typeOfBear', {
			url: '/type-of-bear',
			component: 'typeOfBear'
		})
		.state('truckContainer', {
			url: '/truck-container',
			component: 'truckContainer'
		})
		;
})

.component('app', AppComponent);
