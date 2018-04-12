import template from './truck-container.html';
import controller from './truck-container.controller';
import './truck-container.scss';

const truckContainerComponent = {
	controllerAs: 'vm',
	restrict: 'E',
	bindings: {},
	template,
	controller
};

export default truckContainerComponent;
