/**
 * The homepage / dashboard for the app.
 * 
 * @author Austin Shinpaugh
 */

okHealthControllers.controller('DashboardCtrl', [function ()
{
    'use strict';
    
    angular.element(document).ready(function () {
        App.Page.SetSubtitle("Dashboard");
    });
}]);
