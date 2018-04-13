import 'babel-polyfill';
import 'angular/angular';
import 'angular-mocks/angular-mocks';

const context = require.context('./demo', true, /spec\.js$/);
context.keys().forEach(context);
