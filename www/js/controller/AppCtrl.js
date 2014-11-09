/**
 * Base controller.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

okHealthControllers.controller('AppCtrl', ['$window', '$location', '$scope', function ($window, $location, $scope) {
    $scope.token = null;
    
    $scope.$back = function () {
        $window.history.back();
    };
    
    $scope.$forward = function () {
        $window.history.forward();
    };
}]);