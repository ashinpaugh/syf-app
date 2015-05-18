/**
 * The history controller. Used when displaying what a user ate
 * over the course of a week.
 * 
 * @extends AppCtrl
 * @author  Austin Shinpaugh
 */
okHealthControllers.controller('HistoryCtrl', ['$scope', 'FS', '$routeParams', function ($scope, FS, $routeParams) {
    //$scope.resultSet = !$routeParams.view || $routeParams.view == 'food' ? FS.history() : [];
    $scope.resultSet = [];
    $scope.name      = '';
    $scope.totals    = {};
    
    
    $scope.LoadHistory = function ()
    {
        var username = $routeParams.username;
        if (!username && $scope.getUser()) {
            username = $scope.getUser().meta().username;
        }
        
        if (!username || 'undefined' == username) {
            $scope.SaveLocation('/history/nutrition');
            $scope.EnforceLogin(null, 'You must login before viewing your history.');
            return;
        }
        
        if ($scope.isSearching) {
            return;
        }
        
        $scope.isSearching = true;
        FS.history({q: username}, function (data) {
            $scope.isSearching = false;
            $scope.resultSet   = calculateTotals(data);
        });
        
        $scope.name = username;
    };
    
    var calculateTotals = function (data)
    {
        for (var idx in data) {
            if (data[idx].hasOwnProperty('calories')) {
                // Sometimes the results aren't returned as an array.
                data[idx] = [data[idx]];
            }
            
            var entries, total;
            entries = data[idx];
            total   = 0;
            
            for (var i in entries) {
                if (entries[i].hasOwnProperty('calories')) {
                    total += parseInt(entries[i].calories);
                }
            }
            
            $scope.totals[idx] = total;
        }
        
        return data;
    };
    
    angular.element(document).ready(function () {
        App.Page.SetSubtitle('Meal History');
        
        if ($scope.HasBackupData('history')) {
            $scope.QuickFillScope('history', $scope);
        }
    });
}]);

okHealthApp.directive('historyDateWrapper', function () {
    return {
        'restrict'    : 'E',
        'templateUrl' : 'partials/History/HistoryDateWrapper.html'
    };
});

okHealthApp.directive('historyMealWrapper', function () {
    return {
        'restrict'    : 'E',
        'templateUrl' : 'partials/History/HistoryMealWrapper.html'
    };
});