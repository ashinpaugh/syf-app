/**
 *
 */

okHealthControllers.controller('LoginCtrl', ['$scope', 'Account', function ($scope, User) {
    /**
     * Perform user sign-in.
     */
    $scope.doLogin = function ()
    {
        User.login({
            username: $scope.credentials.username,
            password: $scope.credentials.password
        }, function (user) {
            $scope.user = user;
        });
    };
    
    angular.element(document).ready(function () {
        SYF.Page.SetSubtitle("Login");
        SYF.Resources.Load([
            'css/login.css'
        ]);
    });
}]);