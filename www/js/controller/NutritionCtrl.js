/**
 * The homepage / dashboard for the app.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

okHealthControllers.controller('NutritionCtrl', ['$scope', 'FS', function ($scope, FS)
{
    $scope.searches  = {};
    $scope.search    = '';
    $scope.resultSet = null;

    /**
     * Looks up a user's query.
     */
    $scope.doLookup = function ()
    {
        FS.search({query: $scope.search}, function (result) {
            $scope.resultSet = result.foods.food;
        })
    };
    
    angular.element(document).ready(function () {
        SYF.Resources.Load([
            'css/nutrition.css',
            'js/nutrition.js'
        ]);
    });
}]);