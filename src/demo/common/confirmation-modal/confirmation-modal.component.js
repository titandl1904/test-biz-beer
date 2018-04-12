import template from './confirmation-modal.html';
import controller from './confirmation-modal.controller';

const confirmationModalComponent = {
	restrict: 'E',
	bindings: {
		modalInstance: '<'
	},
	template,
	controller
};

export default confirmationModalComponent;
