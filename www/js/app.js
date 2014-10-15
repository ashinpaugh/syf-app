/**
 * Bootstrap the AngularJS app.
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
            templateUrl: '../partials/Exercise/links.html',
            controller:  'PedometerCtrl'
        }).when('/exercise/pedometer', {
            templateUrl: '../partials/Exercise/utility.html',
            controller:  'PedometerCtrl'
        }).when('/exercise/history', {
            templateUrl: '../partials/Exercise/history.html',
            controller:  'PedometerCtrl'
        }).when('/exercise/settings', {
            templateUrl: '../partials/Exercise/settings.html',
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