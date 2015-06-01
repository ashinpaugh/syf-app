/**
 * Page where the user searches for food and adds it to their calorie diary.
 * 
 * @extends AppCtrl
 * @author  Austin Shinpaugh
 */

okHealthControllers.controller('NutritionCtrl', ['$scope', '$swipe', '$routeParams', 'FS', function ($scope, $swipe, $routeParams, FS)
{
    'use strict';
    
    $scope.page      = $routeParams.hasOwnProperty('page') ? $routeParams.page : 0;
    $scope.search    = $routeParams.hasOwnProperty('search') ? $routeParams.search : '';
    $scope.resultSet = null;
    $scope.userError = false;

    /**
     * Looks up a user's search query.
     */
    $scope.doLookup = function ()
    {
        if (!$scope.search.length) {
            $scope.userError = 1;
            return;
        }
        
        if (invalidInput()) {
            $scope.userError = 2;
            return;
        }
        
        var query = {q: $scope.search};
        if ($routeParams.hasOwnProperty('page')) {
            query.page = $routeParams.page;
        }
        
        $scope.isSearching = true;
        FS.search(query, function (result) {
            $scope.SetupPagination(
                parseInt(result.page_number),
                parseInt(result.max_results),
                parseInt(result.total_results)
            );
            
            $scope.resultSet   = cleanFoodData(result.food);
            $scope.isSearching = false;
            $scope.userError   = false;
            loadServings();
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
        
        $scope.EnableOverlay('Adding ' + food.name + ' to your log..');
        
        if (!serving) {
            serving = food.servings[0];
        }
        
        FS.addEatenItem({
            id:         food.food_id,
            name:       food.name,
            serving_id: serving.serving_id
        }, function (result) {
            $scope.DisableOverlay();
            if (!result.hasOwnProperty('value')) {
                return;
            }
            
            serving.has_eaten = true;
            
            $scope.tracker.addEatenId(serving.serving_id);
            $scope.tracker.addCalories(serving.calories);
        });
    };
    
    $scope.GetPaginationPath = function (page)
    {
        return $scope.$location.path() + '?search=' + $scope.search + '&page=' + page;
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
    var loadServings = function ()
    {
        var food_ids = [];
        
        for (var idx in $scope.resultSet) {
            var food = $scope.resultSet[idx];
            
            if (!food.hasOwnProperty('food_id')) {
                continue;
            }
            
            food_ids.push(food.food_id);
        }
        
        updateServings(food_ids);
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
    var updateServings = function (food_ids)
    {
        FS.batch({'food_ids': food_ids.join(',')}, function (results) {
            for (var idx = 0; idx < results.length; idx++) {
                var result, food, servings;
                
                result = results[idx];
                food   = getFood(result.food_id);
                if (!food) {
                    continue;
                }
                
                servings = result.servings.serving;
                servings = $.isArray(servings) ? servings : [servings];
                
                food.servings = cleanServingsData(servings);
            }
        });
    };

    /**
     * Clean up some of the rubbish data sent with the FS food API.
     * 
     * @param food
     * @returns {Array}
     */
    var cleanFoodData = function (food)
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
    var cleanServingsData = function (servings)
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
    var invalidInput = function ()
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
    var getFood = function (food_id)
    {
        for (var idx in $scope.resultSet) {
            var food = $scope.resultSet[idx];
            if (food.food_id == food_id) {
                return food;
            }
        }
        
        return {};
    };
    
    angular.element(document).ready(function () {
        if ($scope.HasBackupData('nutrition')) {
            $scope.QuickFillScope('nutrition', $scope);
        }
        
        if ($scope.search.length) {
            $scope.doLookup();
        }
    });
}]);

okHealthApp.directive('userEatenButton', function () {
    return {
        'restrict'    : 'E',
        'templateUrl' : 'partials/Nutrition/UserEatenButton.html'
    };
});