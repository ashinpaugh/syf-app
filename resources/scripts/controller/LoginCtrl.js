/**
 * Handles user login and logout actions.
 * 
 * @extends AppCtrl
 * @author  Austin Shinpaugh
 */
okHealthControllers.controller('LoginCtrl', ['$scope', '$location', '$routeParams', 'AccountApi', 'UserHandler', 'TrackerHandler', function ($scope, $location, $routeParams, AccountApi, UserHandler, TrackerHandler) {
    'use strict';
    
    $scope.user    = {};
    $scope.page    = 1;
    $scope.message = $routeParams.message;
    
    
    $scope.pageIsValid = function ($e)
    {
        var button, input, watcher;
        button = $($e.currentTarget);
        input  = $('.page-' + ($scope.page - 1) + ' .ng-invalid');
        
        if (!input[0]) {
            return true;
        }
        
        watcher = function () {
            var item = $(this);
            
            if (item.hasClass('ng-invalid')) {
                return;
            }
            
            button.removeAttr('disabled');
            input.off('blur', ':input', watcher);
        };
        
        button.attr('disabled', 'disabled');
        input.on('blur', ':input', watcher);
        
        input.first().focus();
        $scope.page -= 1;
        
        return false;
    };
    
    /**
     * Perform user sign-in.
     * 
     * @param btn
     */
    $scope.doLogin = function (btn)
    {
        var username, password;
        
        username = $scope.credentials.username;
        password = $scope.credentials.password;
        
        //username = !$scope.credentials.username ? 'ashinpaugh' : $scope.credentials.username;
        //password = !$scope.credentials.password ? 'password1'  : $scope.credentials.password;
        
        btn.disabled = true;
        $scope.EnableOverlay('Logging in...');
        
        AccountApi.login({
            '_username': username,
            '_password': password
        }, function (data) {
            btn.disabled = false;
            $scope.DisableOverlay();
            
            if (typeof data !== 'object') {
                $scope.message = 'Invalid login credentials provided!';
                return;
            }
            
            UserHandler.set(data.user_meta);
            TrackerHandler.set(data.food_meta);
            
            if (!$scope.RedirectUser()) {
                $location.url('/dashboard');
            }
        }, function () {
            alert('Invalid login detected.');
        });
    };

    /**
     * Register a user.
     */
    $scope.doRegistration = function ()
    {
        if ($('.ng-invalid')[0]) {
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
                TrackerHandler.set(data.food_meta);
                
                $location.url('/dashboard');
            });
        });
    };

    /**
     * @event OnDocumentReady
     */
    angular.element(document).ready(function () {
        if ($scope.getUser().meta()) {
            // Log a user out if they visit the login page.
            $scope.getUser().logout();
            $location.url('/dashboard');
        }
        
        App.Page.SetSubtitle('Login');
    });
}]);