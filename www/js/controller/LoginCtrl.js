/**
 *
 */

okHealthControllers.controller('LoginCtrl', ['$scope', '$location', '$routeParams', 'AccountApi', 'UserHandler', function ($scope, $location, $routeParams, AccountApi, UserHandler) {
    $scope.user      = {};
    $scope.show_pass = false;
    $scope.page      = 1;
    $scope.message   = $routeParams.message;
    
    /**
     * Perform user sign-in.
     * 
     * @param btn
     */
    $scope.doLogin = function (btn)
    {
        btn.disabled = true;
        
        var username, password;
        
        //username = $scope.credentials.username;
        //password = $scope.credentials.password;
        // TODO: Remove before sending off to production.
        username = !$scope.credentials.username ? 'ashinpaugh' : $scope.credentials.username;
        password = !$scope.credentials.password ? 'password1'  : $scope.credentials.password;
        
        AccountApi.login({
            '_username': username,
            '_password': password
        }, function (data) {
            btn.disabled = false;
            
            if (typeof data !== 'object') {
                $scope.message = 'Invalid login credentials provided!';
                return;
            }
            
            UserHandler.set(data.user_meta);
            $scope.tracker.set(data.food_meta);
            
            console.log($scope.redirect_url);
            if (!$scope.RedirectUser()) {
                $location.url('/dashboard');
            }
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
        
        AccountApi.register($scope.user, function (data) {
            if (!data.hasOwnProperty('success')) {
                alert('An error occurred. Please make sure you are using unique values for your username, email, and student ID.');
                return;
            }
            
            AccountApi.login({
                _username: $scope.user.username,
                _password: $scope.user.password
            }, function (data) {
                UserHandler.set(data.user_meta);
                $scope.tracker.set(data.food_meta);
                
                $location.url('/dashboard');
            });
        })
    };

    /**
     * Performs some lightweight client-side input validation.
     * 
     * @returns {boolean}
     */
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
        if ($scope.getUser().meta()) {
            $scope.getUser().logout();
        }
        
        SYF.Page.SetSubtitle('Login');
        SYF.Resources.Load([
            'css/login.css'
        ]);
    });
}]);