/**
 * The pedometer
 * 
 * @author Austin Shinpaugh
 */

"use strict";

okHealthControllers.controller('PedometerCtrl', ['$scope', '$interval', '$http', function ($scope, $interval, $http)
{
    $scope.display = '00:00:00';

    /**
     * Is the Pedometer enabled.
     * @returns bool
     */
    $scope.isTracking = function ()
    {
        return $scope.Pedometer.isTracking();
    };
    
    $scope.getSteps = function ()
    {
        return $scope.Pedometer.getSteps();
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
    
    angular.element(document).ready(function () {
        SYF.Page.SetSubtitle('Pedometer');
        SYF.Resources.Load([
            'css/pedometer.css',
            'js/Pedometer.js'
        ]);
        
        $scope.Pedometer = Pedometer;
    });
}]);
