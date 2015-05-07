/**
 * The homepage / dashboard for the app.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

okHealthControllers.controller('DashboardCtrl', [function ()
{
    angular.element(document).ready(function () {
        SYF.Page.SetSubtitle("Dashboard");
        SYF.Resources.Load('css/dashboard.css');
    });
}]);
