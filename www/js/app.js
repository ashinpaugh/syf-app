/**
 * Bootstrap the AngularJS app.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

var ApiEndpoint, okHealthApp, okHealthControllers, okHealthServices;

ApiEndpoint = 'http://syfok.azurewebsites.net/api';
okHealthApp = angular.module('okHealthApp', [
    'ngRoute',
    'okHealthServices',
    'okHealthControllers'
]);

okHealthControllers = angular.module('okHealthControllers', []);
okHealthServices    = angular.module('okHealthServices', ['ngResource']);

okHealthApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);
    $httpProvider.defaults.withCredentials = true;
    
    $routeProvider
        .when('/dashboard', {
            templateUrl: '../partials/Dashboard.html',
            controller:  'DashboardCtrl'
        }).when('/exercise', {
            templateUrl: '../partials/Location/exercise-links.html',
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
            templateUrl: '../partials/Location/nutrition-links.html',
            controller:  'NutritionCtrl'
        }).when('/nutrition/add-meal', {
            templateUrl: '../partials/Nutrition/add-meal.html',
            controller:  'NutritionCtrl'
        }).when('/nutrition/lookup', {
            templateUrl: '../partials/Nutrition/lookup.html',
            controller:  'NutritionCtrl'
        }).when('/login', {
            templateUrl: '../partials/Login/login.html',
            controller:  'LoginCtrl'
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

okHealthServices.factory('Account', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/account';
    
    return $resource('', {}, {
        login : {
            url: base + '/login/:username/:password',
            method: 'GET',
            params: {
                username: '@username',
                password: '@password'
            },
            isArray: false
        },
        logout : {
            url: base + '/logout',
            method: 'GET',
            isArray: false
        },
        stats : {
            url: base + '/stats',
            method: 'GET',
            isArray: true
        }
    });
}]);
/*

GET api/fs/food/*
GET api/fs/food/search/*
POST api/fs/food/favorite/*
GET api/fs/food/favorite/*
DELETE  api/fs/food/favorite/*
GET api/fs/food/most-eaten/*
GET api/fs/food/recently-eaten/*

POST api/fs/recipe/favorite/*

POST api/account/login/*
POST api/account/register/*
GET api/account/stats/*

POST api/pedo/entry/*
GET api/pedo/[d,w,m,y]/*

 */

okHealthServices.factory('FS', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/fs';
    
    return $resource('', {}, {
        get : {
            url: base + '/food/:id',
            method: 'GET',
            params: {id: '@id'}
        },
        search : {
            url: base + '/food/search/:query',
            method: 'GET',
            isArray: true,
            params: {query: '@query'}
        },
        favoriteFood : {
            url: base + '/food/favorite',
            method: 'GET',
            isArray: true
        },
        addFavoriteFood : {
            url: base + '/food/favorite/:food_id/:uid',
            method: 'POST',
            params: {
                food_id: '@food_id',
                uid:     '@uid'
            }
        },
        removeFavoriteFood : {
            url: base + '/food/favorite/:food_id',
            method: 'DELETE',
            params: {food_id: '@food_id'}
        },
        mostEaten : {
            url: base + '/food/most-eaten',
            method: 'GET',
            isArray: true
        },
        recentlyEaten : {
            url: base + '/food/recently-eaten',
            method: 'GET',
            isArray: true
        }
        /*addFavoriteRecipe : {
            url: base + '/recipe/favorite/'
        }*/
    });
}]);

okHealthServices.factory('PedometerApi', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/pedo';
    
    return $resource('', {}, {
        url: base + '/entry',
        method: 'POST',
        params: {
            steps: '@steps',
            calories: '@calories',
            duration: '@duration',
            started:  '@started'
        }
    });
}]);