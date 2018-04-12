import template from './home.html';
import controller from './home.controller';
import './home.scss';

const homeComponent = {
	controllerAs: 'vm',
	restrict: 'E',
	bindings: {},
	template,
	controller
};

export default homeComponent;
