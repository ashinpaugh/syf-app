

okHealthControllers.controller('LocationCtrl', ['$scope', '$location', function ($scope, $location) {
    angular.element(document).ready(function () {
        SYF.Page.SetSubtitle('Meals');
        
        SYF.Resources.Load([
            'css/location.css'
        ]);
    });
}]);
