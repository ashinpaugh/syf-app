/**
 * Core JS required by the app and Angular.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

var okHealthApp, okHealthControllers;

okHealthApp = angular.module('okHealthApp', [
    'ngRoute',
    'okHealthControllers'
]);

okHealthControllers = angular.module('okHealthControllers', []);

okHealthApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/dashboard', {
            templateUrl: '../partials/Dashboard.html',
            controller:  'DashboardCtrl'
        }).when('/exercise', {
            templateUrl: '../partials/Pedometer/links.html',
            controller:  'PedometerCtrl'
        }).when('/exercise/pedometer', {
            templateUrl: '../partials/Pedometer/utility.html',
            controller:  'PedometerCtrl'
        }).when('/exercise/history', {
            templateUrl: '../partials/Pedometer/history.html',
            controller:  'PedometerCtrl'
        }).when('/exercise/settings', {
            templateUrl: '../partials/Pedometer/settings.html',
            controller:  'PedometerCtrl'
        }).when('/nutrition', {
            templateUrl: '../partials/Nutrition.html',
            controller:  'NutritionCtrl'
        }).otherwise({
            redirectTo: '/dashboard'
        })
    ;
}]);

okHealthApp.directive('appNav', function () {
    return {
        'restrict'    : 'E',
        'templateUrl' : '../partials/AppNav.html'
    };
});