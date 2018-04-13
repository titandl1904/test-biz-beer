
import home from './home.component';
import 'angular-ui-bootstrap';


describe('Home Component', () => {
	let element;
	let scope;
	let controller;
	let calendarService;
	let occurrences;
	let $uibModal;
	let $rootScope;
	let $compile;
    beforeEach(() => {
        angular.module('HomeMock', [
            'ui.bootstrap'
        ])
            .component('home', home)
        angular.mock.module('CalendarFormMock');
    });

    beforeEach(() => {
        angular.mock.inject(($httpBackend, _$rootScope_, _$compile_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            scope = $rootScope.$new();
            element = $compile('<home></home>')(scope);
            scope.$digest();
            controller = element.controller('home');
        });
    });

    describe('Controller', () => {
		it('Should be defined', () => {
			expect(controller).toBeDefined();
		});
	});

});