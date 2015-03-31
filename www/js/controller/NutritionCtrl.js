/**
 * The homepage / dashboard for the app.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

okHealthControllers.controller('NutritionCtrl', ['$scope', '$swipe', 'FS', function ($scope, $swipe, FS)
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
        
        FS.search({q: $scope.search}, function (result) {
            $scope.resultSet   = CleanFoodData(result.food);
            $scope.isSearching = false;
            $scope.userError   = false;
            LoadServings();
        });
    };
    
    /*$scope.GetServings = function (food)
    {
        if (food.servings) {
            return;
        }
        
        FS.get({food_id: food.food_id}, function (result) {
            // Way to go FatSecret - nice and consistent return values...
            var servings = result.servings.serving;
            servings     = $.isArray(servings) ? servings : [servings];
            
            food.servings = CleanServingsData(servings);
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
    };*/
    
    $scope.GetServings = function (food)
    {
        if (food.servings) {
            return;
        }
        
        FS.get({food_id: food.food_id}, function (result) {
            // Way to go FatSecret - nice and consistent return values...
            var servings = result.servings.serving;
            servings     = $.isArray(servings) ? servings : [servings];
            
            food.servings = CleanServingsData(servings);
        });
    };
    
    $scope.AddToEaten = function ($event, food)
    {
        if ($scope.EnforceLogin($event, 'Please login before tracking your meals.')) {
            return;
        }
        
        FS.addEatenItem({
            id: food.food_id,
            name: food.name,
            serving_id: food.servings[0].serving_id
        }, function (result) {
            console.log(result);
        });
    };
    
    $scope.HasEaten = function (food)
    {
        return food.food_id in $scope.eaten_ids;
    };
    
    var LoadServings = function ()
    {
        var food_ids = [];
        
        for (var idx in $scope.resultSet) {
            var food = $scope.resultSet[idx];
            
            if (!food.hasOwnProperty('food_id')) {
                continue;
            }
            
            food_ids.push(food.food_id);
        }
        
        UpdateServings(food_ids);
    };
    
    var UpdateServings = function (food_ids)
    {
        FS.batch({'food_ids': food_ids.join(',')}, function (results) {
            for (var idx = 0; idx < results.length; idx++) {
                var result, food, servings;
                
                result   = results[idx];
                food     = GetFood(result.food_id);
                servings = result.servings.serving;
                servings = $.isArray(servings) ? servings : [servings];
                
                food.servings = CleanServingsData(servings);
            }
        })
    };
    
    var CleanFoodData = function (food)
    {
        var output = [];
        
        for (var idx in food) {
            var data, desc, vol, name, meta_pos;
            data = food[idx];
            desc = data.food_description;
            vol  = desc.substr(4, desc.indexOf(' -') - 4);
            
            // Per 101g - Calories: 197kcal | Fat: 7.79g | Carbs: 0.00g | Protein: 29.80g
            data.volume = vol;
            data.meta   = desc.substr(desc.indexOf('- ') + 2).trim().split(' | ');
            data.closed = true;
            
            name     = data.food_name;
            meta_pos = name.indexOf('(');
            
            if (-1 != meta_pos) {
                data.name      = name.substr(0, meta_pos - 1);
                data.name_meta = name.substr(meta_pos);
            } else {
                data.name = data.food_name;
            }
            
            delete data.food_name;
            delete data.food_description;
            output.push(data);
        }
        
        return output;
    };
    
    var CleanServingsData = function (servings)
    {
        var output = [];
        
        for (var idx in servings) {
            var serving, parts;
            serving = servings[idx];
            parts   = serving.serving_description.split('(');
            
            serving.name        = parts[0].trim();
            serving.description = "";
            serving.ser
            
            if (parts.length > 1) {
                serving.description = parts[1].substr(0, parts[1].length - 1);
            }
            
            delete serving.serving_description;
            
            output.push(serving);
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
    
    var GetFood = function (food_id)
    {
        for (var idx in $scope.resultSet) {
            var food = $scope.resultSet[idx];
            if (food.food_id == food_id) {
                return food;
            }
        }
        
        throw new Error('Food not found.');
    };
    
    angular.element(document).ready(function () {
        SYF.Resources.Load([
            'css/nutrition.css',
            'js/nutrition.js'
        ]);
    });
}]);