import angular from 'angular';
import BeerService from './beer.service';
import TruckContainerService from './truck-container.service';
import WeatherService from './weather.service';

const serviceModule = angular.module('app.services', [])
.service('BeerService', BeerService)
.service('TruckContainerService', TruckContainerService)
.service('WeatherService', WeatherService)
.name;

export default serviceModule;
