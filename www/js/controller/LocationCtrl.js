

okHealthControllers.controller('LocationCtrl', ['$scope', '$location', function ($scope, $location) {
    angular.element(document).ready(function () {
        SYF.Page.SetSubtitle('My Tools - Fitness');
        
        SYF.Resources.Load([
            'css/location.css'
        ]);
    });
}]);
