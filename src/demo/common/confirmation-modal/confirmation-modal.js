import angular from 'angular';

import confirmationModalComponent from './confirmation-modal.component';

const confirmationModalModule = angular.module('confirmationModal', [])

.component('confirmationModal', confirmationModalComponent)

.name;

export default confirmationModalModule;
