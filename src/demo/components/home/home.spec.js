
import home from './home.component';
import 'angular-ui-bootstrap';
import BearService from '../../services/bear.service';
import TruckContainerService from '../../services/truck-container.service';
import WeatherService from '../../services/weather.service';
import '@uirouter/angularjs';

describe('Home Component', () => {
	let element;
	let scope;
	let controller;
	let calendarService;
	let occurrences;
	let $uibModal;
	let $rootScope;
    let $compile;
    const dataWeather = {
        main: {
            temp: 30
        }
    };
    beforeEach(() => {
        angular.module('HomeMock', [
            'ui.bootstrap',
            'ui.router'
        ])
        .service('BearService', BearService)
        .service('TruckContainerService', TruckContainerService)
        .service('WeatherService', WeatherService)
        .component('home', home)
        angular.mock.module('HomeMock');
    });

    beforeEach(() => {
        angular.mock.inject(($httpBackend, _$rootScope_, _$compile_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            element = $compile('<home></home>')(scope);
            scope.$digest();
            $httpBackend.expectGET('.*').respond(200, dataWeather);
            controller = element.controller('home');
            $httpBackend.flush();
        });
    });

    describe('Controller', () => {
		it('Should be defined', () => {
			expect(controller).toBeDefined();
		});
	});

});