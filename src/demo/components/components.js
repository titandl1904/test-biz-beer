import angular from 'angular';
import Home from './home/home';
import TypeOfBeer from './type-of-beer/type-of-beer';
import TruckContainer from './truck-container/truck-container';

const componentModule = angular.module('app.components', [
	Home,
	TypeOfBeer,
	TruckContainer
])

.name;

export default componentModule;
