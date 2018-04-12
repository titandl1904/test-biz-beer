class AppController {
	constructor($location) {
		'ngInject';
		this.$location = $location;
	}

	getClass(path) {
		return (this.$location.path().substr(0, path.length) === path) ? 'active' : '';
	}
}

export default AppController;
