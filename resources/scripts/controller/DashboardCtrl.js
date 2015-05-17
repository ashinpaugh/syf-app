/**
 * The homepage / dashboard for the app.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

okHealthControllers.controller('DashboardCtrl', [function ()
{
    angular.element(document).ready(function () {
        App.Page.SetSubtitle("Dashboard");
    });
}]);
