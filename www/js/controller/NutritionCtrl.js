/**
 * Page where the user searches for food and adds it to their calorie diary.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

okHealthControllers.controller('NutritionCtrl', ['$scope', '$swipe', 'FS', function ($scope, $swipe, FS)
{
    $scope.search      = '';
    $scope.resultSet   = null;
    $scope.isSearching = false;
    $scope.userError   = false;

    /**
     * Looks up a user's search query.
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
    
    /**
     * Mark a meal as eaten and enter it into the calorie diary.
     * 
     * @param $event
     * @param food
     * @param serving
     */
    $scope.AddToEaten = function ($event, food, serving)
    {
        if ($scope.EnforceLogin($event, 'Please login before tracking your meals.')) {
            $scope.BackupData('nutrition', $scope);
            return;
        }
        
        if (!serving) {
            serving = food.servings[0];
        }
        
        FS.addEatenItem({
            id:         food.food_id,
            name:       food.name,
            serving_id: serving.serving_id
        }, function (result) {
            if (!result.hasOwnProperty('value')) {
                return;
            }
            
            serving.has_eaten = true;
            
            $scope.tracker.addEatenId(serving.serving_id);
            $scope.tracker.addCalories(serving.calories);
        });
    };

    /**
     * Determine if the user has eaten a particular food_id today.
     * 
     * @param serving_id
     * @returns {boolean}
     */
    $scope.HasEaten = function (serving_id)
    {
        return $.inArray(serving_id, $scope.tracker.getEatenIds()) > -1;
    };

    /**
     * Collects all the food objects' food_id's for batch processing.
     */
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

    /**
     * Streams the servings API back to the phone since the server will have
     * to make multiple FS API calls to retrieve all the required data.
     * 
     * Also, normalizes some of the inconsistent data sent by FS when requesting
     * the serving details.
     * 
     * @param food_ids
     */
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

    /**
     * Clean up some of the rubbish data sent with the FS food API.
     * 
     * @param food
     * @returns {Array}
     */
    var CleanFoodData = function (food)
    {
        var output = [];
        
        for (var idx in food) {
            var data, desc, vol, name, meta_pos;
            data = food[idx];
            desc = data.food_description;
            vol  = desc.substr(4, desc.indexOf(' -') - 4);
            
            // Per 101g - Calories: 197kcal | Fat: 7.79g | Carbs: 0.00g | Protein: 29.80g
            data.volume    = vol;
            data.meta      = desc.substr(desc.indexOf('- ') + 2).trim().split(' | ');
            data.closed    = true;
            data.has_eaten = false;
            console.log(data);
            
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

    /**
     * Clean up some of the rubbish data sent with the FS servings API.
     * 
     * @param servings
     * @returns {Array}
     */
    var CleanServingsData = function (servings)
    {
        var output = [];
        
        for (var idx in servings) {
            var serving, parts;
            serving = servings[idx];
            parts   = serving.serving_description.split('(');
            
            serving.name        = parts[0].trim();
            serving.description = "";
            
            if (parts.length > 1) {
                serving.description = parts[1].substr(0, parts[1].length - 1);
            }
            
            delete serving.serving_description;
            
            output.push(serving);
        }
        
        return output;
    };

    /**
     * Checks the user input before sending it on to FS.
     * 
     * @returns {boolean}
     */
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

    /**
     * Finds the food object (sent by FS) by ID.
     * 
     * @param food_id
     * @returns {Object}
     */
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
            'css/nutrition.css'
        ]);
        
        if ($scope.HasBackupData('nutrition')) {
            $scope.QuickFillScope('nutrition', $scope);
        }
    });
}]);