class TruckContainerController {

    constructor(TruckContainerService) {
        'ngInject';
        this.TruckContainerService = TruckContainerService;
    }

    $onInit() {
        this.listContainer = this.TruckContainerService.getTruckContainer();
    }
}

export default TruckContainerController;
