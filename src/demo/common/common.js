import angular from 'angular';
import BusyComponent from './busy/busy.component';

import './common.scss';

const commonModule = angular.module('app.common', [
])
.component('busy', BusyComponent)

.name;

export default commonModule;
