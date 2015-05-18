/**
 * The controller used when navigating to a page that links
 * to other controller actions.
 * 
 * @extends AppCtrl
 * @author  Austin Shinpaugh
 */
okHealthControllers.controller('LocationCtrl', [function () {
    angular.element(document).ready(function () {
        App.Page.SetSubtitle('Meals');
    });
}]);
