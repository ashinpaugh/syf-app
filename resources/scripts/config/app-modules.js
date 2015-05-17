"use strict";

okHealthControllers = angular.module('okHealthControllers', ['ngTouch']);
okHealthServices    = angular.module('okHealthServices', ['ngRoute', 'ngResource']);
okHealthFilters     = angular.module('okHealthFilters', []);
okHealthApp         = angular.module('okHealthApp', [
    'ngRoute',
    'okHealthServices',
    'okHealthControllers',
    'okHealthFilters'
]);