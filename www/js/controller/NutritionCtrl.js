/**
 * The homepage / dashboard for the app.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

okHealthControllers.controller('NutritionCtrl', ['$scope', 'FS', function ($scope, FS)
{
    $scope.searches    = {};
    $scope.search      = '';
    $scope.resultSet   = null;
    $scope.isSearching = false;
    $scope.userError   = false;

    /**
     * Looks up a user's query.
     */
    $scope.doLookup = function ()
    {
        if (!$scope.search.length) {
            $scope.userError = 1;
            return;
        }
        
        if (InvalidInput()) {
            $scope.userError = 2;
            return;
        }
        
        $scope.isSearching = true;
        
        FS.search({query: $scope.search}, function (result) {
            $scope.resultSet   = CleanFoodData(result.foods.food);
            $scope.isSearching = false;
            $scope.userError   = false;
            LoadServings();
        })
    };
    
    $scope.GetServings = function (food)
    {
        if (food.servings) {
            return;
        }
        
        FS.get({food_id: food.food_id}, function (result) {
            food.servings = CleanServingsData(result.food.servings.serving)
        });
    };
    
    var LoadServings = function ()
    {
        for (var idx in $scope.resultSet) {
            if (!$scope.resultSet.hasOwnProperty(idx)) {
                continue;
            }
            
            $scope.GetServings($scope.resultSet[idx]);
        }
    };
    
    var CleanFoodData = function (food)
    {
        var output = [];
        
        for (var idx in food) {
            var data, desc, vol, meta;
            data  = food[idx];
            desc  = data.food_description;
            vol   = desc.substr(4, desc.indexOf(' -') - 4);
            
            // Per 101g - Calories: 197kcal | Fat: 7.79g | Carbs: 0.00g | Protein: 29.80g
            data.volume = vol;
            data.meta   = desc.substr(desc.indexOf('- ') + 2).trim().split(' | ');
            data.hide_servings = true;
            data.closed        = true;
            
            
            delete data.food_description;
            output.push(data);
        }
        
        return output;
    };
    
    var CleanServingsData = function (servings)
    {
        var output = [];
        
        for (var idx in servings) {
            var data, parts;
            data  = servings[idx];
            parts = data.serving_description.split('(');
            
            data.name        = parts[0].trim();
            data.description = "";
            
            if (parts.length > 1) {
                data.description = parts[1].substr(0, parts[1].length - 1);
            }
            
            delete data.serving_description;
            output.push(data);
        }
        
        return output;
    };
    
    var InvalidInput = function ()
    {
        var idx, letter;
        
        for (idx = 0; idx < $scope.search; idx++) {
            letter = $scope.search.substr(idx, 1);
            
            if (letter.toLowerCase() === letter.toUpperCase()) {
                return true;
            }
        }
        
        return false;
    };
    
    angular.element(document).ready(function () {
        SYF.Resources.Load([
            'css/nutrition.css',
            'js/nutrition.js'
        ]);
    });
}]);