/*
Service: BeerService
- Store data Beer in localStorage
- Get temperature down when the weather is too hot

*/

class BeerService {

	constructor($http, TruckContainerService) {
        'ngInject';
        
        this.TruckContainerService = TruckContainerService;
        this.typeOfBeer = {
            Beer1: {
                id: 'Beer1',
                name: 'Beer 1',
                minDegree: 4,
                maxDegree: 6,
                typeOfDegree: 'C'
            },
            Beer2: {
                id: 'Beer2',
                name: 'Beer 2',
                minDegree: 5,
                maxDegree: 6,
                typeOfDegree: 'C'
            },
            Beer3: {
                id: 'Beer3',
                name: 'Beer 3',
                minDegree: 4,
                maxDegree: 7,
                typeOfDegree: 'C'
            },
            Beer4: {
                id: 'Beer4',
                name: 'Beer 4',
                minDegree: 6,
                maxDegree: 8,
                typeOfDegree: 'C'
            },
            Beer5: {
                id: 'Beer5',
                name: 'Beer 5',
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

    getListTypeOfBeer() {
        if (this.TruckContainerService.getCurrentStatusTruck().id !== 'inloading') {
            let dataDriving = JSON.parse(localStorage.getItem('dataDriving'));
            if (angular.isObject(dataDriving)) {
                dataDriving = dataDriving.listTypeOfBeer;
                return dataDriving;
            }
        }
        return Object.keys(this.typeOfBeer).map((key) => { return this.typeOfBeer[key]; });
    }
}

export default BeerService;
