class TypeOfBeerController {

    constructor(BeerService) {
        'ngInject';
        this.BeerService = BeerService;
    }

    $onInit() {
        this.listBeers = this.BeerService.getListTypeOfBeer();
    }
}

export default TypeOfBeerController;
