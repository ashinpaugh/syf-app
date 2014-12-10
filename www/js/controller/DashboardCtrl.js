/**
 * The homepage / dashboard for the app.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

okHealthControllers.controller('DashboardCtrl', ['$scope', 'UserHandler', function ($scope, UserHandler)
{
    var user        = UserHandler.get();
    $scope.calories = user.Calories;
    $scope.steps    = user.Steps;
    $scope.netCal   = user.NetCalories;
    
    angular.element(document).ready(function () {
        SYF.Page.SetSubtitle("SYF Dashboard");
        SYF.Resources.Load('css/dashboard.css');
    });
}]);
