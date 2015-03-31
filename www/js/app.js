/**
 * Bootstrap the AngularJS app.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

var ApiEndpoint, ApiResponseFormat,
    okHealthApp, okHealthControllers,
    okHealthServices, okHealthFilters
;

/**
 * If the API endpoint changes, this must be updated to the new URI, and the
 * app must be recompiled.
 * 
 * I.E.: cordova build android
 * 
 * @type {string}
 */
//ApiEndpoint = 'http://syfok.azurewebsites.net/api';
//ApiEndpoint = 'http://okshapeyourfuture.azurewebsites.net';
ApiEndpoint       = 'http://api.mis-health.dev/app_dev.php/v1';
ApiResponseFormat = 'json';


okHealthControllers = angular.module('okHealthControllers', ['ngTouch']);
okHealthServices    = angular.module('okHealthServices', ['ngRoute', 'ngResource']);
okHealthFilters     = angular.module('okHealthFilters', []);
okHealthApp         = angular.module('okHealthApp', [
    'ngRoute',
    //'ngTouch',
    'okHealthServices',
    'okHealthControllers',
    'okHealthFilters'
]);

okHealthApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
    //$locationProvider.html5Mode(true);
    //$httpProvider.defaults.withCredentials = true;

    $routeProvider
        .when('/dashboard', {
            templateUrl: 'partials/Dashboard.html',
            controller:  'DashboardCtrl'
        }).when('/exercise', {
            templateUrl: 'partials/Location/exercise-links.html',
            controller:  'PedometerCtrl'
        }).when('/exercise/pedometer', {
            templateUrl: 'partials/Exercise/utility.html',
            controller:  'PedometerCtrl'
        }).when('/exercise/history', {
            templateUrl: 'partials/Exercise/history.html',
            controller:  'PedometerCtrl'
        }).when('/exercise/settings', {
            templateUrl: 'partials/Exercise/settings.html',
            controller:  'PedometerCtrl'
        }).when('/nutrition', {
            templateUrl: 'partials/Location/nutrition-links.html',
            controller:  'NutritionCtrl'
        }).when('/nutrition/add-meal', {
            templateUrl: 'partials/Nutrition/add-meal.html',
            controller:  'NutritionCtrl'
        }).when('/nutrition/lookup', {
            templateUrl: 'partials/Nutrition/lookup.html',
            controller:  'NutritionCtrl'
        }).when('/login', {
            templateUrl: 'partials/Login/login.html',
            controller:  'LoginCtrl'
        }).when('/tobacco-free', {
            templateUrl: 'partials/Tobacco/resources.html',
            controller:  'LoginCtrl'
        }).when('/account/register', {
            templateUrl: 'partials/Login/register.html',
            controller:  'LoginCtrl'
        }).when('/nutrition/markets', {
            templateUrl: 'partials/Market/search.html',
            controller:  'MarketCtrl'
        }).otherwise({
            redirectTo: '/dashboard'
        })
    ;
}]);



okHealthApp.directive('appNav', function () {
    return {
        'restrict'    : 'E',
        'templateUrl' : 'partials/AppNav.html'
    };
});

okHealthServices.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}]);

okHealthServices.factory('AccountApi', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/account';

    return $resource('', {}, {
        register : {
            url: base + '.json',
            method: 'POST',
            params: {
                username: '@username',
                password: '@password',
                first_name: '@first_name',
                last_name: '@last_name',
                height: '@height',
                dob: '@dob',
                gender: '@gender',
                weight: '@weight',
                school_id: '@school_id',
                group_id: '@group_id',
                student_id: '@student_id',
                email: '@email'
            }
        },
        
        login : {
            url: ApiEndpoint + '/login.json',
            method: 'POST'
        },
        
        logout : {
            url: base + '/logout.json',
            method: 'GET',
            isArray: false
        },
        
        stats : {
            url: base + '/stats.json',
            method: 'GET',
            isArray: true
        }
    });
}]);

/**
 * The FatSecret API service.
 * 
 * For technical reasons on the .NET side, anything that is user specific requires
 * the '/fs' prefix.
 */
okHealthServices.factory('FS', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/food';
    
    return $resource('', {}, {
        get : {
            url: base + '/:food_id.json',
            method: 'GET',
            params: {food_id: '@food_id'}
        },
        batch : {
            url:    base + '/:food_ids.json',
            method: 'GET',
            params: {'food_ids': '@food_ids'},
            isArray: true
        },
        search : {
            url: base + '.json',
            method: 'GET'
        },
        addEatenItem : {
            url: base + '/diary/:id/:serving_id/:name.json',
            method: 'POST',
            params: {
                id: '@id',
                serving_id: '@serving_id',
                name: '@name'
            }
        },
        
        favoriteFood : {
            url: base + '/favorite',
            method: 'GET',
            isArray: true
        },
        addFavoriteFood : {
            url: base + '/favorite/:food_id/:name/:description',
            method: 'POST',
            params: {
                food_id: '@food_id',
                name: '@name',
                description: '@description'
            }
        },
        removeFavoriteFood : {
            url: base + '/favorite/:food_id',
            method: 'DELETE',
            params: {food_id: '@food_id'}
        },
        mostEaten : {
            url: base + '/most-eaten',
            method: 'GET',
            isArray: true
        },
        recentlyEaten : {
            url: base + '/recently-eaten',
            method: 'GET',
            isArray: true
        }
        /*addFavoriteRecipe : {
            url: base + '/recipe/favorite/'
        }*/
    });
}]);

okHealthServices.factory('PedometerApi', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/pedometer.json';
    
    return $resource('', {}, {
        entry : {
            url: base + '/entry',
            method: 'POST',
            params: {
                Steps:    '@steps',
                CaloriesBurned: '@calories',
                TimeStamp: '@started_on',
                StartTime: '@started_on',
                EndTime: '@ended_on'
            }
        }
    });
}]);

okHealthServices.factory('GroupApi', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/group.json';
    
    return $resource('', {}, {
        getAll : {
            url: base,
            method: 'GET',
            isArray: true
        }
    });
}]);


okHealthServices.factory('SchoolApi', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/school.json';
    
    return $resource('', {}, {
        getAll : {
            url: base,
            method: 'GET',
            isArray: true
        }
    });
}]);

okHealthServices.factory('MarketApi', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/market';
    
    return $resource('', {}, {
        search : {
            url: base + '/search/:query',
            method: 'GET',
            isArray: true,
            params: {
                query: "@query"
            }
        }
    });
}]);

okHealthServices.factory('TokenHandler', function () {
    var token, date;
    token = null;
    date  = null;
    
    return {
        get : function () {
            return token;
        },
        set : function (t) {
            token = t;
            date  = new Date();
        }
    };
});

okHealthServices.factory('httpInterceptor', function (TokenHandler) {
    return {
        request : function (config) {
            if (!TokenHandler.get()) {
                return config;
            }
            
            config.headers['X-AUTH-TOKEN'] = TokenHandler.get();
            
            return config;
        },
        response : function (response) {
            if (!response.headers('X-AUTH-TOKEN')) {
                return response;
            }
            
            TokenHandler.set(response.headers('X-AUTH-TOKEN'));
            
            return response;
        }
    };
});

okHealthServices.factory('UserHandler', function () {
    var user = {};
    
    return {
        get : function () {
            return user;
        },
        set : function (u) {
            user = u;
        }
    };
});

okHealthFilters.filter('StripTags', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  }
);
