

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
        $scope.resultSet = FS.history({q: username}, function () {
            $scope.isSearching = false;
            CalculateTotals();
        });
        
        $scope.name = username;
    };
    
    function CalculateTotals ()
    {
        for (var idx in $scope.resultSet) {
            var entries, total;
            entries = $scope.resultSet[idx];
            total   = 0;
            
            for (var i in entries) {
                if (entries[i].hasOwnProperty('calories')) {
                    total += parseInt(entries[i].calories);
                }
            }
            
            $scope.totals[idx] = total;
        }
    }
    
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