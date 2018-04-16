
/* 
@TODO: will generate by esdoc

I set 3 temperature levels:
I assumed "tempe = temperature"
- level 1: tempe <= 320C (normal) -> The top message will be Blue
- level 2:  tempe > 320C & tempe <=400C (hot) -> the top message will be Amber
- level 3: tempe > 400C (danger) -> the top message will be Red

I implemented these cases: 
- case 1: If the tempe is normal and the truck status is on loading, there is not alerted to Bar.
- case 2: If the tempe is hot and the truck status is on loading, there will be alert to Bar. The temperature range beer will be down (-20C) to make the the beer is cool enough.
- case 3: If the tempe is danger and the truck status is on loading, the button change status to in driving will be disable. And Bar need to wait to normal tempe to drive

- case 4: Bar already loaded the beer in normal tempe but when he is driving, the tempe is hot. The message will be "The temperature range beer will be down (-20C) , click Reload button to make sure the beer is cool enough"

- case 5: Bar already loaded the beer in (normal tempe or hot tempe) but when he is driving, the tempe is danger. The message will be "You need to find the place to make sure the beer is not corrupted".

There are 5 truck statuses: "In Loading", "In driving", "Reload", "On Hold", "Continue", "Completed".

The interval will get temperature from container to check temperature is suitable for beer or not. Time interval will be 5s

*/


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
                this.loopToCheckContainerTempChange();
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
        this.listContainer = this.TruckContainerService.simulatorTempeTruckContainer();
    }

    checkTempeChangeContainer() {
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
    }

    loopToCheckContainerTempChange() {
        //@TODO: Use socket to receive information in real API
        this.$timeout(() => {
            this.checkTempeChangeContainer();
            this.loopToCheckContainerTempChange();
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
        switch (status) {
            case 'indriving': 
                const isValid = this.setupForInDriving();
                if (isValid) {
                    this.TruckContainerService.setDataWhenDriving(this.listTypeOfBear, this.listContainer, this.isDanger);
                    this.TruckContainerService.setStatusTruck(status);
                    this.loopToCheckContainerTempChange();
                }
                break;
            case 'completed': 
                this.TruckContainerService.deleteData();
                this.TruckContainerService.setStatusTruck('inloading');
                // @TODO: Use this.$state.reload() instead of reload page.
                this.$window.location.reload();
                // this.$state.reload();
                break;
            case 'onhold':
            case 'inholding':
                this.TruckContainerService.setStatusTruck(status);
                break;
            case 'reload': 
                this.TruckContainerService.deleteData();
                this.TruckContainerService.setStatusTruck('inloading');
                this.$state.reload();
                break;
        }

        this.setupStatusTruck();
    }
}

export default HomeController;
