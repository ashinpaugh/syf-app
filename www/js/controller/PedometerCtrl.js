/**
 * The pedometer
 * 
 * @author Austin Shinpaugh
 */

"use strict";

okHealthControllers.controller('PedometerCtrl', ['$scope', '$interval', 'PedometerApi', function ($scope, $interval, PedometerApi)
{
    var appTick, tickStop;
    
    $scope.display = '00:00:00';

    
    $scope.getSteps = function ()
    {
        return $scope.Pedometer.getSteps();
    };
    
    /*$scope.getElapsedTime = function ()
    {
        console.log($scope.Pedometer.getElapsedTime());
        return $scope.Pedometer.getElapsedTime();
    };*/
    
    
    $scope.ToggleTracking = function ()
    {
        if ($scope.Pedometer.isTracking()) {
            tickStop();
            return;
        }
        
        tickStop = function () {
            $interval.cancel(appTick);
            $scope.Pedometer.stop();
            $scope.UploadEntry();
        };
        
        appTick = $interval(function () {
            $('#timer').text($scope.Pedometer.getElapsedTime());
        }, 1000);
        
        $scope.Pedometer.start();
    };
    
    $scope.UploadEntry = function ()
    {
        
    };
    
    
    $scope.$on('$destroy', function () {
        if (angular.isDefined(tickStop)) {
            tickStop();
        }
    });
    
    angular.element(document).ready(function () {
        SYF.Page.SetSubtitle('Pedometer');
        SYF.Resources.Load([
            'js/StepDetector.js',
            'css/pedometer.css',
            'js/Pedometer.js'
        ]);
        
        $scope.Pedometer = Pedometer;
    });
}]);
