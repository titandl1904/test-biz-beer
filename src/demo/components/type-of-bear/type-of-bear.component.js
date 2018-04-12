import template from './type-of-bear.html';
import controller from './type-of-bear.controller';
import './type-of-bear.scss';

const typeOfBearComponent = {
	controllerAs: 'vm',
	restrict: 'E',
	bindings: {},
	template,
	controller
};

export default typeOfBearComponent;
