
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
        // make sure override function simulate data from truck container
        .config(($provide) => {
            $provide.decorator('TruckContainerService', ($delegate) => {
                $delegate.simulatorTempeTruckContainer = () => {
                    return $delegate.getTruckContainer();
                }

                return $delegate;
            });
        });
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

        it('Should check function setupForInDriving', () => {
            controller.listTypeOfBear[2].capacity = 100;
            controller.setupForInDriving();
            expect(controller.listTypeOfBear[2].currentCap).toBe(0);
            expect(controller.listTypeOfBear[2].containerId.length).toBe(1);
        });

        it('Should check function checkTempeChangeContainer', () => {
            controller.listTypeOfBear[2].capacity = 100;
            controller.handleDataForDriving();
            controller.checkTempeChangeContainer();
            expect(controller.messageErrorOutofRange.length).toBe(0);
        });

        it('Should check function changeStatus with indriving status', () => {
            controller.listTypeOfBear[2].capacity = 100;
            spyOn(truckContainerService, 'setDataWhenDriving');
            spyOn(truckContainerService, 'setStatusTruck');
            controller.changeStatus('indriving');
            expect(truckContainerService.setDataWhenDriving).toHaveBeenCalledWith(
                controller.listTypeOfBear, controller.listContainer, controller.isDanger
            );
            expect(truckContainerService.setStatusTruck).toHaveBeenCalledWith('indriving');

        });

        it('Should check function changeStatus with completed status', () => {
            controller.listTypeOfBear[2].capacity = 100;
            spyOn(truckContainerService, 'deleteData');
            spyOn(truckContainerService, 'setStatusTruck');
            controller.changeStatus('completed');
            expect(truckContainerService.deleteData).toHaveBeenCalledWith();
            expect(truckContainerService.setStatusTruck).toHaveBeenCalledWith('inloading');
        });

        it('Should check function changeStatus with onhold status', () => {
            controller.listTypeOfBear[2].capacity = 100;
            spyOn(truckContainerService, 'setStatusTruck');
            controller.changeStatus('onhold');
            expect(truckContainerService.setStatusTruck).toHaveBeenCalledWith('onhold');
        });

        it('Should check function changeStatus with reload status', () => {
            controller.listTypeOfBear[2].capacity = 100;
            spyOn(truckContainerService, 'deleteData');
            spyOn(truckContainerService, 'setStatusTruck');
            controller.changeStatus('reload');
            expect(truckContainerService.deleteData).toHaveBeenCalledWith();
            expect(truckContainerService.setStatusTruck).toHaveBeenCalledWith('inloading');
        });
    });

});