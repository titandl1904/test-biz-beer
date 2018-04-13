class HomeController {

    constructor(WeatherService, BearService, TruckContainerService, $window, $timeout, $state) {
        'ngInject';

        this.BearService = BearService;
        this.TruckContainerService = TruckContainerService;
        this.WeatherService = WeatherService;
        this.$window = $window;
        this.$timeout = $timeout;
        this.$state = $state;
        this.downTemp = this.BearService.getDownTemp();
    }

    preventNegative() {
        const numInput = document.querySelector('input');
        numInput.addEventListener('input', function(){
            var num = this.value.match(/^\d+$/);
            if (num === null) {
                this.value = "";
            }
        }, false);
    }

    $onInit() {
        this.listStatus = this.TruckContainerService.listStatusOfTruck();
        this.busy = true;
        
        this.WeatherService.getWeatherSydney().then(res => {
            this.tempNow = res;
            this.classTemp = 'alert-info';
            this.isDanger = 0;
            if (this.tempNow > 32 && this.tempNow <= 40) {
                this.classTemp = 'alert-warning';
                this.isDanger = 1;
            } else if (this.tempNow > 40) {
                this.isDanger = 2;
                this.classTemp = 'alert-danger';
            }
            this.setupContainter();
            this.setupStatusTruck();

            if (this.truckStatus.id !== 'inloading') {
                this.checkTempeChangeContainer();
            }
            // prevent negative number when input beer capacity
            this.$timeout(() => {
                this.preventNegative();
            }, 100);
        }).finally(() => {
            this.busy = false;
        });
    }

    setupContainter() {
        this.listTypeOfBear = this.BearService.getListTypeOfBear();
        this.listContainer = this.TruckContainerService.getMockTempeTruckContainer();
    }

    checkTempeChangeContainer() {
        //@TODO: Use socket to receive information in real API
        this.$timeout(() => {
            this.setupContainter();

            let containerObject = angular.copy(this.listContainer);

            containerObject = containerObject.reduce(function(acc, cur, index) {
                acc[cur.id] = cur;
                return acc;
              }, {});
            this.messageErrorOutofRange = [];
            this.listTypeOfBear.map((bear) => {
                bear.containerId.forEach(container => {
                    const currentCon = containerObject[parseInt(container.id)];
                    const minDegree = this.isDanger === 1 ? bear.minDegree - this.downTemp : bear.minDegree;
                    const maxDegree = this.isDanger === 1 ? bear.maxDegree - this.downTemp : bear.maxDegree;

                    if (currentCon.degree < minDegree || currentCon.degree > maxDegree) {
                        this.messageErrorOutofRange.push({degree: currentCon.degree, containerId: container.id});
                    }
                });
            });
            this.checkTempeChangeContainer();
        }, 5000);
    }

    setupStatusTruck() {
        this.truckStatus = this.TruckContainerService.getCurrentStatusTruck();
        if (this.truckStatus.id !== 'inloading') {
            this.previousDangerLevel = this.TruckContainerService.getPreviousDangerLevel();
        }
        this.listButtonChangeStatus = [];

        switch(this.truckStatus.id) {
            case 'inloading': 
                this.listButtonChangeStatus.push(this.listStatus['indriving']);
                break;
            case 'indriving':
                this.listButtonChangeStatus.push(this.listStatus['onhold']);
                this.listButtonChangeStatus.push(this.listStatus['completed']);

                if (angular.isDefined(this.previousDangerLevel) && this.previousDangerLevel === 0) {
                    this.listButtonChangeStatus.push(this.listStatus['reload']);
                }
                break;
            case 'onhold':
                this.listButtonChangeStatus.push(this.listStatus['inholding']);
                this.listButtonChangeStatus.push(this.listStatus['completed']);
                break;
            case 'inholding':
                this.listButtonChangeStatus.push(this.listStatus['onhold']);
                this.listButtonChangeStatus.push(this.listStatus['completed']);
            default: 
                break;
        }
    }

    handleDataForDriving() {
        this.listContainer.map(container => {
            container.currentLiter = container.maxLiter;
            return container;
        });
        this.listTypeOfBear.map((data) => {
            if (angular.isUndefined(data.capacity) || data.capacity === null) {
                data.capacity = 0;
            }
            data.currentCap = data.capacity;
            data.containerId = [];

            if (data.currentCap > 0) {
                this.listContainer.map(container => {
                    const minDegree = this.isDanger === 1 ? data.minDegree - this.downTemp : data.minDegree;
                    const maxDegree = this.isDanger === 1 ? data.maxDegree - this.downTemp : data.maxDegree;
                    if (container.currentLiter > 0 && data.currentCap > 0 && container.degree >= minDegree &&
                        container.degree <= maxDegree) {
                        let cap = 0;
                        if (data.currentCap > container.currentLiter) {
                            cap = container.currentLiter;
                            data.currentCap = data.currentCap - container.currentLiter;
                            container.currentLiter = 0;
                        } else {
                            cap = data.currentCap;
                            container.currentLiter = container.currentLiter - data.currentCap;
                            data.currentCap = 0;
                        }
                        data.containerId.push({id: container.id, cap});
                    }
                    return container;
                });
            }

            return data;
        });
    }

    setupForInDriving() {
        this.handleDataForDriving();
        const maxValueCap = Math.max.apply(Math,this.listTypeOfBear.map(function(o){return o.capacity;}));
        const maxValueRemain = Math.max.apply(Math,this.listTypeOfBear.map(function(o){return o.currentCap;}));
        this.errInputBeerCapacity = false;
        this.errBigCap = false;
        let isValid = true;
        if (maxValueCap === 0) {
            isValid = false;
            this.errInputBeerCapacity = true;
        }
        else if (maxValueRemain > 0) {
            isValid = false;
            this.errBigCap = true;
        }

        return isValid;
    }

    changeStatus(status) {
        if (status === 'indriving') {
            const isValid = this.setupForInDriving();
            if (isValid) {
                this.TruckContainerService.setDataWhenDriving(this.listTypeOfBear, this.listContainer, this.isDanger);
                this.TruckContainerService.setStatusTruck(status);

                this.checkTempeChangeContainer();
            }
        } else if (status === 'completed') {
            this.TruckContainerService.deleteData();
            this.TruckContainerService.setStatusTruck('inloading');
            // @TODO: Use this.$state.reload() instead of reload page.
            this.$window.location.reload();
            // this.$state.reload();
        } else if (status === 'onhold') {
            this.TruckContainerService.setStatusTruck(status);
        } else if (status === 'inholding') {
            this.TruckContainerService.setStatusTruck(status);
        } else if (status === 'reload') {
            this.TruckContainerService.deleteData();
            this.TruckContainerService.setStatusTruck('inloading');
            this.$state.reload();
        }

        this.setupStatusTruck();
    }
}

export default HomeController;
