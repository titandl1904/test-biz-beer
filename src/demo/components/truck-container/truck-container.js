import angular from 'angular';
import truckContainerComponent from './truck-container.component';

const truckContainerModule = angular.module('truckContainer', [])

.component('truckContainer', truckContainerComponent)

.name;

export default truckContainerModule;
