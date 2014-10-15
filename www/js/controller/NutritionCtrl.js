/**
 * The homepage / dashboard for the app.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

okHealthControllers.controller('NutritionCtrl', function ($scope, $http)
{
    $scope.searches = {};
    $scope.search   = '';
    
    $scope.doLookup = function ()
    {
        var rPromise = $http.get('http://syfok.azurewebsites.net/api/searchfoods/chicken');
        rPromise.success(function (data, status, headers, config) {
            console.log(data);
        });
    };
});