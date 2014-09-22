/**
 * The pedometer
 * 
 * @author Austin Shinpaugh
 */

"use strict";

okHealth.controller('PedometerCtrl', ['$scope', '$interval', function ($scope, $interval)
{
    $scope.Pedometer = new Pedometer();
    $scope.display   = '00:00:00';

    /**
     * Is the Pedometer enabled.
     * @returns {Pedometer.is_tracking}
     */
    $scope.isTracking = function ()
    {
        return $scope.Pedometer.is_tracking;
    };
    
    $scope.getSteps = function ()
    {
        return $scope.Pedometer.steps;
    };
    
    /*$scope.getElapsedTime = function ()
    {
        console.log($scope.Pedometer.getElapsedTime());
        return $scope.Pedometer.getElapsedTime();
    };*/
    
    var appTick, tickStop;
    $scope.toggleTimer = function ()
    {
        if ($scope.isTracking()) {
            tickStop();
            return;
        }
        
        tickStop = function () {
            $interval.cancel(appTick);
            $scope.Pedometer.stop();
        };
        
        appTick = $interval(function () {
            $('#timer').text($scope.Pedometer.getElapsedTime());
        }, 1000);
        
        $scope.Pedometer.start();
    };
    
    $scope.$on('$destroy', function () {
        if (angular.isDefined(tickStop)) {
            tickStop();
        }
    });
}]);
