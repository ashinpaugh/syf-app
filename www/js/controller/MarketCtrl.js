/**
 * Farmers Market controller.
 * 
 * @author Austin Shinpaugh <ashinpaugh@gmail.com>
 */

"use strict";

okHealthControllers.controller('MarketCtrl', ['$scope', 'MarketApi', function ($scope, MarketApi) {
    $scope.query     = '';
    $scope.resultSet = [];
    
    $scope.doSearch = function () {
        MarketApi.search({
            query: $scope.query
        }, function (data, headers) {
            $scope.resultSet = data;
        });
    };
    
    $scope.watchKeys = function (e) {
        if (13 !== e.keyCode) {
            return;
        }
        
        //$('.market-wrapper form[name="frm"] button').click();
    };
    
    var CleanMarketData = function ()
    {
        var idx;
        
        for (idx = 0; idx < $scope.resultSet.length; idx++) {
            var data, times;
            data  = $scope.resultSet[idx];
            times = data.Schedule;
        }
    };
    
    var ParseSchedule = function (str)
    {
        
    };
    
    angular.element(document).ready(function () {
        SYF.Page.SetSubtitle('Market Locator');
        
        SYF.Resources.Load([
            'css/market.css'
        ]);
    });
}]);
