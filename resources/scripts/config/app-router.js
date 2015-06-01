okHealthApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/dashboard', {
            templateUrl: 'partials/Dashboard.html',
            controller:  'DashboardCtrl'
        }).when('/exercise', {
            templateUrl: 'partials/Exercise/utility.html',
            controller:  'PedometerCtrl'
        }).when('/nutrition', {
            templateUrl: 'partials/Location/nutrition-links.html'
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