okHealthApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/dashboard', {
            templateUrl: 'partials/Dashboard.html'
        }).when('/exercise', {
            templateUrl: 'partials/Exercise/utility.html'
        }).when('/nutrition', {
            templateUrl: 'partials/Location/nutrition-links.html'
        }).when('/nutrition/add-meal', {
            templateUrl: 'partials/Nutrition/add-meal.html'
        }).when('/nutrition/lookup', {
            templateUrl: 'partials/Nutrition/lookup.html'
        }).when('/history/nutrition/:username?/:display_name?', {
            templateUrl: 'partials/History/template.html'
        }).when('/login', {
            templateUrl: 'partials/Login/login.html'
        }).when('/account/register', {
            templateUrl: 'partials/Login/register.html'
        }).when('/board', {
            templateUrl: 'partials/Board/board.html'
        }).otherwise({
            redirectTo: '/dashboard'
        })
    ;
}]);