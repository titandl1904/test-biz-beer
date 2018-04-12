class TypeOfBearController {

    constructor(BearService) {
        'ngInject';
        this.BearService = BearService;
    }

    $onInit() {
        this.listBears = this.BearService.getListTypeOfBear();
    }
}

export default TypeOfBearController;
