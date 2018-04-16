import template from './type-of-beer.html';
import controller from './type-of-beer.controller';
import './type-of-beer.scss';

const typeOfBeerComponent = {
	controllerAs: 'vm',
	restrict: 'E',
	bindings: {},
	template,
	controller
};

export default typeOfBeerComponent;
