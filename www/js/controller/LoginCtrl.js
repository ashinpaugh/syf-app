/**
 *
 */

okHealthControllers.controller('LoginCtrl', ['$scope', '$location', '$routeParams', 'AccountApi', 'UserHandler', function ($scope, $location, $routeParams, AccountApi, UserHandler) {
    $scope.user      = UserHandler.get();
    $scope.show_pass = false;
    $scope.page      = 1;
    $scope.message   = $routeParams.message;
    
    /**
     * Perform user sign-in.
     */
    $scope.doLogin = function ()
    {
        var username, password;
        
        username = $scope.credentials.username;
        password = $scope.credentials.password;
        
        AccountApi.login({
            'username': username,
            'password': password
        }, function (data, headers) {
            if (typeof data !== 'object') {
                alert(data);
                return;
            }
            
            UserHandler.set($.extend(
                {'username': username},
                data
            ));
            
            
            $location.url('/dashboard');
        });
    };

    /**
     * Register a user.
     */
    $scope.doRegistration = function ()
    {
        if (!validateProperties()) {
            return;
        }
        
        AccountApi.register($scope.user, function (data, headers) {
            $location.url('/dashboard');
        })
    };
    
    function validateProperties()
    {
        var u = $scope.user;
        
        if (!u.hasOwnProperty('password')) {
            alert('Invalid password.');
            return false;
        }
        
        if (!$scope.show_pass) {
            if (!u.hasOwnProperty('password2')) {
                alert("Please enter re-enter your password.");
                $('#password2').focus();
                return false;
            }
            
            if (u.password != u.password2) {
                alert("The passwords you provided did not match.");
                $('#password, #password2').val('');
                $('#password').focus();
                return false;
            }
        }
        
        return $('.registration').filter('.ng-invalid').length == 0;
    }
    
    angular.element(document).ready(function () {
        SYF.Page.SetSubtitle('Login');
        SYF.Resources.Load([
            'css/login.css'
        ]);
    });
    
    $scope.$on('$destroy', function () {
        
    });
}]);