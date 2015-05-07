

okHealthControllers.controller('HistoryCtrl', ['$scope', 'FS', '$routeParams', function ($scope, FS, $routeParams) {
    //$scope.resultSet = !$routeParams.view || $routeParams.view == 'food' ? FS.history() : [];
    $scope.resultSet   = [];
    $scope.isSearching = false;
    $scope.name        = '';
    
    
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
        
        if (!$scope.isSearching) {
            $scope.isSearching = true;
            $scope.resultSet = FS.history({q: username}, function () {
                $scope.isSearching = false;
            });
            
            $scope.name = username;
        }
    };
    
    angular.element(document).ready(function () {
        SYF.Page.SetSubtitle('Meal History');
        
        SYF.Resources.Load([
            'css/history.css'
        ]);
        
        if ($scope.HasBackupData('history')) {
            $scope.QuickFillScope('history', $scope);
        }
    });
}]);