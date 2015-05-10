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

okHealthApp.config(['$routeProvider', function ($routeProvider) {
    //$locationProvider.html5Mode(true);
    //$httpProvider.defaults.withCredentials = true;

    $routeProvider
        .when('/dashboard', {
            templateUrl: 'partials/Dashboard.html',
            controller:  'DashboardCtrl'
        }).when('/exercise', {
            templateUrl: 'partials/Exercise/utility.html',
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
        }).when('/history/nutrition/:username?/:display_name?', {
            templateUrl: 'partials/History/template.html',
            controller:  'HistoryCtrl'
        }).when('/login', {
            templateUrl: 'partials/Login/login.html',
            controller:  'LoginCtrl'
        }).when('/account/register', {
            templateUrl: 'partials/Login/register.html',
            controller:  'LoginCtrl'
        }).when('/board', {
            templateUrl: 'partials/Board/board.html',
            controller:  'BoardCtrl'
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

okHealthApp.directive('userEatenButton', function () {
    return {
        'restrict'    : 'E',
        'templateUrl' : 'partials/Nutrition/UserEatenButton.html'
    }
});

okHealthApp.directive('boardUserItem', function () {
    return {
        'restrict'    : 'E',
        'templateUrl' : 'partials/Board/BoardUserItem.html'
    }
});

okHealthApp.directive('historyDateWrapper', function () {
    return {
        'restrict'    : 'E',
        'templateUrl' : 'partials/History/HistoryDateWrapper.html'
    }
});

okHealthApp.directive('historyMealWrapper', function () {
    return {
        'restrict'    : 'E',
        'templateUrl' : 'partials/History/HistoryMealWrapper.html'
    }
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
                sex: '@sex',
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
            url: base + '/diary.json',
            method: 'POST',
            params: {
                id: '@id',
                serving_id: '@serving_id',
                name: '@name'
            }
        },
        history : {
            url: base + '/history.json',
            method: 'GET',
            isArray: true,
            params: {
                q: '@username'
            }
        }
    });
}]);

okHealthServices.factory('PedometerApi', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/entry';
    
    return $resource('', {}, {
        entry : {
            url: base + '/:started/:ended/:steps/:calories.json',
            method: 'POST',
            params: {
                steps:    '@steps',
                calories: '@calories',
                started: '@started_on',
                ended: '@ended_on'
            }
        }
    });
}]);

okHealthServices.factory('BoardApi', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/board';
    
    return $resource('', {}, {
        getLeaderBoard : {
            url: base + '/leaders.json',
            method: 'GET',
            isArray: true
        },
        
        getGroups : {
            url: base + '/group.json',
            method: 'GET',
            isArray: true
        },
        
        getGroup : {
            url: base + '/group/:id.json',
            method: 'GET',
            isArray: true,
            params: {
                id: '@id'
            }
        },
        
        getSchools : {
            url: base + '/school.json',
            method: 'GET',
            isArray: true
        },
        
        getSchool : {
            url: base + '/school/:id.json',
            method: 'GET',
            isArray: true,
            params: {
                id: '@id'
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

okHealthServices.factory('UserHandler', ['TrackerHandler', function (TrackerHandler) {
    var user = {};

    /**
     * http://stackoverflow.com/questions/4060004/calculate-age-in-javascript
     * @returns {number}
     */
    function computeAge (user)
    {
        var diff_ms, diff_date;
        diff_ms   = Date.now() - user.date_of_birth;
        diff_date = new Date(diff_ms);
        user.age  = Math.abs(diff_date.getUTCFullYear() - 1970);
        
        return user;
    }
    
    return {
        meta : function () {
            return user;
        },
        set : function (u) {
            user = computeAge(u);
        },
        logout : function () {
            user = null;
            TrackerHandler.clear();
        }
    };
}]);

okHealthServices.factory('TrackerHandler', function () {
    var meta = {};
    
    reset();
    
    function reset ()
    {
        meta = {
            steps:     0,
            consumed:  0,
            burned:    0,
            eaten_ids: []
        };
    }
    
    return {
        get : function () {
            return meta;
        },
        
        set : function (food_meta) {
            meta = food_meta;
        },
        
        getConsumed : function () {
            return meta.consumed;
        },
        
        getBurned : function () {
            return meta.burned;
        },
        
        getNet : function () {
            return parseInt(meta.consumed) - parseInt(meta.burned);
        },
        
        getEatenIds : function () {
            return meta.eaten_ids;
        },
        
        addEatenId : function (id) {
            meta.eaten_ids.push(id);
        },
        
        addCalories : function (cal) {
            meta.consumed += parseInt(cal);
        },
        
        hasConsumedLess : function ()
        {
            return parseInt(meta.consumed) <= parseInt(meta.burned);
        },
        
        getSteps : function () {
            return meta.steps;
        },
        
        addSteps : function (s)
        {
            meta.steps += s;
        },
        
        addBurnedCalories : function (s) {
            meta.burned += s;
        },
        
        clear : function (user) {
            reset();
        }
    }
});

okHealthFilters.filter('StripTags', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  }
);
