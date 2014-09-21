/**
 * The pedometer
 * 
 * @author Austin Shinpaugh
 */

"use strict";

okHealth.controller('PedometerCtrl', ['$scope', function ($scope)
{
    $scope.tracking   = false;
    $scope.steps      = 0;
    
    $scope.timer      = null;
    $scope.started_on = null;
    $scope.ended_on   = null;
    $scope.display    = null;
    
    $scope.toggleTimer = function ()
    {
        if ($scope.tracking) {
            $scope.tracking = false;
            $scope.ended_on = new Date();
            clearInterval($scope.timer);
            return;
        }
        
        $scope.tracking   = true;
        $scope.ended_on   = null;
        $scope.started_on = new Date();
        $scope.timer      = setInterval($scope.getElapsedTime, 1000);
    };
    
    $scope.getElapsedTime = function ()
    {
        var now, started, diff, sec, min, hr;
        
        now     = new Date();
        started = $scope.started_on ? $scope.started_on : now;
        
        diff = (now - started) / 1000;
        sec  = Math.round((now - started) / 1000) % 60;
        min  = diff / 60;
        hr   = diff / 3600;
        
        var timerRound = function (num) {
            num = Math.floor(num);
            
            return ("00" + num).slice(-2);
        };
        
        $scope.display = timerRound(hr)
            + ':' + timerRound(min)
            + ':' + timerRound(sec)
        ;
        
        $('#timer').text($scope.display);
        
        return $scope.display;
    };
}]);
