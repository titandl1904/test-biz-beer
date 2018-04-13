
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
    let truckContainerService;
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
        .constant('WEATHER_INFO', {})
        angular.mock.module('HomeMock');
    });

    beforeEach(() => {
        angular.mock.inject(($httpBackend, _$rootScope_, _$compile_, _TruckContainerService_) => {
            truckContainerService = _TruckContainerService_;
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            element = $compile('<home></home>')(scope);
            $httpBackend.expectGET().respond(200, dataWeather);
            scope.$digest();
            controller = element.controller('home');
            $httpBackend.flush();
        });
    });

    describe('Controller', () => {
		it('Should be defined', () => {
            expect(controller).toBeDefined();
            
        });
        it('Should check data when controller init', () => {
            expect(controller.tempNow).toBe(30);
            expect(controller.isDanger).toBe(0);
            expect(controller.classTemp).toBe('alert-info');
        })
    });
    
    describe('Check function in controller', () => {

        it('Should check function setupStatusTruck', () => {
            truckContainerService.setStatusTruck('indriving');
            controller.setupStatusTruck();
            expect(controller.listButtonChangeStatus.length).toBe(3);

            truckContainerService.setStatusTruck('onhold');
            controller.setupStatusTruck();
            expect(controller.listButtonChangeStatus.length).toBe(2);

            truckContainerService.setStatusTruck('inholding');
            controller.setupStatusTruck();
            expect(controller.listButtonChangeStatus.length).toBe(2);
        });

        it('Should check function handleDataForDriving', () => {
            controller.listTypeOfBear[2].capacity = 100;
            controller.handleDataForDriving();
            expect(controller.listTypeOfBear[2].currentCap).toBe(0);
            expect(controller.listTypeOfBear[2].containerId.length).toBe(1);
        });
    });

});