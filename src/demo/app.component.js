import template from './app.html';
import controller from './app.controller';
import './app.scss';

const appComponent = {
	controllerAs: 'vm',
	controller,
	template,
	restrict: 'E'
};

export default appComponent;
