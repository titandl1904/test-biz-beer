import angular from 'angular';
import typeOfBeerComponent from './type-of-beer.component';

const typeOfBeerModule = angular.module('typeOfBeer', [])

.component('typeOfBeer', typeOfBeerComponent)

.name;

export default typeOfBeerModule;
