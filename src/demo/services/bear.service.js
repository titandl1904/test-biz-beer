class BearService {

	constructor($http, TruckContainerService) {
        'ngInject';
        
        this.TruckContainerService = TruckContainerService;
        this.typeOfBear = {
            Bear1: {
                id: 'Bear1',
                name: 'Bear 1',
                minDegree: 4,
                maxDegree: 6,
                typeOfDegree: 'C'
            },
            Bear2: {
                id: 'Bear2',
                name: 'Bear 2',
                minDegree: 5,
                maxDegree: 6,
                typeOfDegree: 'C'
            },
            Bear3: {
                id: 'Bear3',
                name: 'Bear 3',
                minDegree: 4,
                maxDegree: 7,
                typeOfDegree: 'C'
            },
            Bear4: {
                id: 'Bear4',
                name: 'Bear 4',
                minDegree: 6,
                maxDegree: 8,
                typeOfDegree: 'C'
            },
            Bear5: {
                id: 'Bear5',
                name: 'Bear 5',
                minDegree: 3,
                maxDegree: 5,
                typeOfDegree: 'C'
            },
        };
    }

    getDownTemp() {
        // the Temperature down when the weather is too hot
        return 2;
    }

    getListTypeOfBear() {
        if (this.TruckContainerService.getCurrentStatusTruck().id !== 'inloading') {
            let dataDriving = JSON.parse(localStorage.getItem('dataDriving'));
            if (angular.isObject(dataDriving)) {
                dataDriving = dataDriving.listTypeOfBear;
                return dataDriving;
            }
        }
        return Object.keys(this.typeOfBear).map((key) => { return this.typeOfBear[key]; });
    }
}

export default BearService;
