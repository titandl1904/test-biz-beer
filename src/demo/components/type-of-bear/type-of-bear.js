import angular from 'angular';
import typeOfBearComponent from './type-of-bear.component';

const typeOfBearModule = angular.module('typeOfBear', [])

.component('typeOfBear', typeOfBearComponent)

.name;

export default typeOfBearModule;
