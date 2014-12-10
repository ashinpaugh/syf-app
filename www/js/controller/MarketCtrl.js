/**
 * Farmers Market controller.
 * 
 * @author Austin Shinpaugh <ashinpaugh@gmail.com>
 */

"use strict";

okHealthControllers.controller('MarketCtrl', ['$scope', 'MarketApi', function ($scope, MarketApi) {
    $scope.query       = '';
    $scope.resultSet   = [];
    $scope.isSearching = false;
    
    $scope.doSearch = function () {
        $scope.isSearching = true;
        
        MarketApi.search({
            query: $scope.query
        }, function (data, headers) {
            $scope.resultSet   = CleanMarketData(data);
            $scope.isSearching = false;
        });
    };
    
    $scope.OpenMap = function (mkt)
    {
        window.open('http://maps.google.com/?q=' + mkt.Address, '_system', 'location=yes');
    };
    
    var CleanMarketData = function (results)
    {
        var output, idx;
        
        output = [];
        for (idx = 0; idx < results.length; idx++) {
            var data, times;
            data  = results[idx];
            times = data.Schedule;
            
            data.times = ParseSchedule(times);
            output.push(data);
        }
        
        return output;
    };
    
    var ParseSchedule = function (str)
    {
        if (!str.length) {
            return 'Not Available';
        }
        
        var output, reg, times, idx;
        
        output = {};
        reg    = /(\S*\sto\s\S*)(.*);?\n?/ig;
        times  = str.replace(';<br>', "\n").split("\n");
        
        for (idx in times) {
            var time, title, ranges;
            
            time = times[idx];
            if (!$.trim(time)) {
                continue;
            }
            
            title  = time.replace(reg, "$1");
            ranges = time.replace(reg, "$2").split(";");
            
            output[title] = ranges;
        }
        
        return output;
    };
    
    angular.element(document).ready(function () {
        SYF.Page.SetSubtitle('Market Locator');
        
        SYF.Resources.Load([
            'css/market.css'
        ]);
    });
}]);
