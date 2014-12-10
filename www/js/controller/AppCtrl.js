/**
 * Base controller.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

//{"Calories":"0","Steps":"0","NetCalories":"0","Age":"0","Height":"73","Weight":"230"}
okHealthControllers.controller('AppCtrl', ['$window', '$location', '$scope', 'UserHandler', function ($window, $location, $scope, UserHandler) {
    $scope.token = null;
    $scope.user  = UserHandler.get();
    
    $scope.$back = function () {
        $window.history.back();
    };
    
    $scope.$forward = function () {
        $window.history.forward();
    };
    
    $scope.getUser = function ()
    {
        return UserHandler.get();
    };
    
    $scope.EnsureValidUser = function ()
    {
        return UserHandler.get().hasOwnProperty('username');
    };
    
    $scope.EnforceLogin = function ($event, message)
    {
        if ($scope.EnsureValidUser()) {
            return;
        }
        
        $event.preventDefault();
        $location.url('/login?message=' + encodeURIComponent(message));
    };
}]);