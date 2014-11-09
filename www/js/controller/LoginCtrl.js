/**
 *
 */

okHealthControllers.controller('LoginCtrl', ['$scope', '$location', 'Account', function ($scope, $location, User) {
    /**
     * Perform user sign-in.
     */
    $scope.doLogin = function ()
    {
        User.login({
            username: $scope.credentials.username,
            password: $scope.credentials.password
        }, function (data, headers) {
            $location.url('/dashboard');
        });
    };
    
    angular.element(document).ready(function () {
        SYF.Page.SetSubtitle('Login');
        SYF.Resources.Load([
            'css/login.css'
        ]);
    });
}]);