import angular from 'angular';
import BearService from './bear.service';
import TruckContainerService from './truck-container.service';
import WeatherService from './weather.service';

const serviceModule = angular.module('app.services', [])
.service('BearService', BearService)
.service('TruckContainerService', TruckContainerService)
.service('WeatherService', WeatherService)
.name;

export default serviceModule;
