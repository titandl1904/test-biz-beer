import angular from 'angular';
import Home from './home/home';
import TypeOfBear from './type-of-bear/type-of-bear';
import TruckContainer from './truck-container/truck-container';

const componentModule = angular.module('app.components', [
	Home,
	TypeOfBear,
	TruckContainer
])

.name;

export default componentModule;
