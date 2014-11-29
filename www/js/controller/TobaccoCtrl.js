/**
 * Tobacco controller.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

okHealthControllers.controller('TobaccoCtrl', ['$scope', function ($scope) {
    angular.element(document).ready(function () {
        SYF.Page.SetSubtitle('Tobacco Free - Resources');
        SYF.Resources.Load([
            'css/tobacco.css'
        ]);
    });
}]);