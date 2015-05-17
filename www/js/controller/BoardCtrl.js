

okHealthControllers.controller('BoardCtrl', ['$scope', 'BoardApi', '$routeParams', function ($scope, BoardApi, $routeParams) {
    $scope.resultSet = {};
    $scope.columns   = {
        username: 'ASC',
        school:   'ASC',
        points:   'DESC'
    };
    
    /*$scope.resultSet = [
        {
            display_name: 'ashinpaugh',
            school_initials:   'OU',
            total_points:   10
        },
        
        {
            display_name: 'crispy',
            school_initials:   'OU',
            total_points:   22
        },
        
        {
            display_name: 'derp',
            school_initials:   'UNM',
            total_points:   9
        },
        
        {
            display_name: 'smurf',
            school_initials:   'OU',
            total_points:   18
        },
        
        {
            display_name: 'daunte',
            school_initials:   'OU',
            total_points:   100
        },
        
        {
            display_name: 'geodude',
            school_initials:   'OU',
            total_points:   1000
        }
    ];*/
    
    $scope.ToggleSort = function (col)
    {
        var dir = $scope.columns[col];
        $scope.columns[col] = 'ASC' == dir ? 'DESC' : 'ASC';
    };
    
    $scope.SortByProperty = function (users, column, property)
    {
        if (!users) {
            users = $scope.resultSet;
        }
        
        users.sort(function (a, b) {
            var value, value2;
            value  = a[property];
            value2 = b[property];
            
            if (value.toLowerCase) {
                value  = value.toLowerCase();
                value2 = value2.toLowerCase();
            }
            
            if (value > value2) {
                return 1;
            }
            
            if (value < value2) {
                return -1;
            }
            
            return 0;
        });
        
        if ('DESC' == $scope.columns[column]) {
            users = users.reverse();
        }
        
        $scope.resultSet = users;
    };
    
    angular.element(document).ready(function () {
        SYF.Page.SetSubtitle("Leaderboards");
        
        $scope.isSearching = true;
        $scope.resultSet   = BoardApi.getLeaderBoard({}, function () {
            $scope.isSearching = false;
        });
    });
}]);

okHealthApp.directive('boardUserItem', function () {
    return {
        'restrict'    : 'E',
        'templateUrl' : 'partials/Board/BoardUserItem.html'
    }
});
