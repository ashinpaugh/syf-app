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
        $scope.getTracker().addSteps($scope.Pedometer.getSteps());
        $scope.getTracker().addBurnedCalories($scope.Pedometer.getCaloriesBurned());

        PedometerApi.entry({
            steps:      $scope.Pedometer.getSteps(),
            calories:   $scope.Pedometer.getCaloriesBurned(),
            started_on: $scope.Pedometer.getStartTime().getTime(),
            ended_on:   new Date().getTime()
        }, function (data, headers) {
            //console.log([data, headers]);
        });
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
    
    $('.pedomter-wrapper .btn-warning').on('click', function (e) {
        $scope.UploadEntry();
    });
}]);
