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
		.state('typeOfBeer', {
			url: '/type-of-beer',
			component: 'typeOfBeer'
		})
		.state('truckContainer', {
			url: '/truck-container',
			component: 'truckContainer'
		})
		;
})
.constant('WEATHER_INFO', {
	appid: 'b6907d289e10d714a6e88b30761fae22', // for register
	id: '2154855' // id of Sydney
})

.component('app', AppComponent);
