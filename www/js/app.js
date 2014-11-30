/**
 * Bootstrap the AngularJS app.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

var ApiEndpoint, okHealthApp, okHealthControllers,
    okHealthServices, okHealthFilters
;

ApiEndpoint = 'http://syfok.azurewebsites.net/api';

okHealthControllers = angular.module('okHealthControllers', []);
okHealthServices    = angular.module('okHealthServices', ['ngRoute', 'ngResource']);
okHealthFilters     = angular.module('okHealthFilters', []);
okHealthApp         = angular.module('okHealthApp', [
    'ngRoute',
    'okHealthServices',
    'okHealthControllers',
    'okHealthFilters'
]);

okHealthApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
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

okHealthServices.factory('Account', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/profile';

    return $resource('', {}, {
        register : {
            url: base + '/register/:UserName/:Password',
            method: 'POST',
            params: {
                UserName: '@username',
                Password: '@password',
                ConfirmPassword: '@password',
                Height: '@height',
                Age: '@dob',
                Sex: '@gender',
                Weight: '@weight'
            }
        },
        
        login : {
            url: base + '/login/:username/:password',
            method: 'POST',
            params: {
                username: '@username',
                password: '@password'
            }
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
            url: base + '/get/:food_id',
            method: 'GET',
            params: {food_id: '@food_id'}
        },
        search : {
            url: base + '/search/:query',
            method: 'GET',
            //isArray: true,
            params: {query: '@query'}
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

/**
 * public class PedoEntry
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int UserId { get; set; }
        public int Steps { get; set; }
        [Column(TypeName = "datetime2")]
        public DateTime TimeStamp { get; set; }
        public double CaloriesBurned { get; set; }
        [Column(TypeName = "datetime2")]
        public DateTime StartTime { get; set; }
        [Column(TypeName = "datetime2")]
        public DateTime Duration { get; set; }
    }
 */

okHealthServices.factory('PedometerApi', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/pedometer';
    
    return $resource('', {}, {
        entry : {
            url: base + '/entry',
            method: 'POST',
            params: {
                Steps:    '@steps',
                TimeStamp: '@started_on',
                StartTime: '@started_on',
                Duration: '@duration',
                CaloriesBurned: '@calories'
            }
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
            
            config.headers['SYF-AUTH'] = TokenHandler.get();
            
            return config;
        },
        response : function (response) {
            if (!response.headers('SYF-AUTH')) {
                return response;
            }
            
            TokenHandler.set(response.headers('SYF-AUTH'));
            
            return response;
        }
    };
});

okHealthFilters.filter('StripTags', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  }
);