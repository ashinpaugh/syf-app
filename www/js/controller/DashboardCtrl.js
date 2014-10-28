/**
 * The homepage / dashboard for the app.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

okHealthControllers.controller('DashboardCtrl', ['$scope', function ($scope)
{
    $scope.username = '';
    $scope.token    = null;
    
    $scope.calories = 0;
    $scope.consumed = 0;
    $scope.steps    = 0;
    
    angular.element(document).ready(function () {
        SYF.Page.SetSubtitle("SYF Dashboard");
        SYF.Resources.Load('css/dashboard.css');
    });
}]);
