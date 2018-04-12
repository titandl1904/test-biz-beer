import angular from 'angular';
import BusyComponent from './busy/busy.component';
import ConfirmationModal from './confirmation-modal/confirmation-modal';

import './common.scss';

const commonModule = angular.module('app.common', [
    ConfirmationModal
])
.component('busy', BusyComponent)

.name;

export default commonModule;
