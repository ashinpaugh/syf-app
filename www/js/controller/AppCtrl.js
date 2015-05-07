/**
 * Base controller.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

//{"Calories":"0","Steps":"0","NetCalories":"0","Age":"0","Height":"73","Weight":"230"}
okHealthControllers.controller('AppCtrl', ['$window', '$location', '$scope', '$swipe', 'UserHandler', 'TrackerHandler', 'GroupApi', 'SchoolApi', function ($window, $location, $scope, $swipe, UserHandler, TrackerHandler, GroupApi, SchoolApi) {
    $scope.token        = null;
    $scope.user         = null;
    $scope.tracker      = TrackerHandler;
    $scope.groups       = GroupApi.getAll();
    $scope.schools      = SchoolApi.getAll();
    $scope.eaten_today  = [];
    $scope.redirect_url = '';
    $scope.previous_data = {};
    
    $scope.$back = function () {
        $window.history.back();
    };
    
    $scope.$forward = function () {
        $window.history.forward();
    };
    
    $scope.getUser = function ()
    {
        return UserHandler;
    };
    
    $scope.getTracker = function ()
    {
        return TrackerHandler;
    };
    
    $scope.EnsureValidUser = function ()
    {
        return UserHandler.meta().hasOwnProperty('username');
    };
    
    $scope.EnforceLogin = function ($event, message)
    {
        if ($scope.EnsureValidUser()) {
            return false;
        }
        
        if ($event) {
            $event.preventDefault();
        }
        
        if (!$scope.redirect_url) {
            $scope.redirect_url = $location.url();
        }
        
        $location.url('/login?message=' + encodeURIComponent(message));
        
        return true;
    };
    
    $scope.SaveLocation = function (path)
    {
        if (path) {
            $scope.redirect_url = path;
            return;
        }
        
        $scope.redirect_url = $location.url();
    };
    
    $scope.RedirectUser = function ()
    {
        if (!$scope.redirect_url.length) {
            return false;
        }
        
        $location.url($scope.redirect_url);
        $scope.redirect_url = '';
        
        return true;
    };
    
    $scope.HasBackupData = function (controller)
    {
        return $scope.previous_data.hasOwnProperty(controller);
    };
    
    $scope.BackupData = function (controller, $s)
    {
        var data, params, param;
        data   = $scope.previous_data[controller] || {};
        params = ChildOnlyParams($s);
        
        for (var i = 0; i < params.length; i++) {
            param       = params[i];
            data[param] = $s[param];
        }
        
        $scope.previous_data[controller] = data;
        
        return true;
    };
    
    $scope.QuickFillScope = function (controller, $s)
    {
        if (!$scope.HasBackupData(controller)) {
            return false;
        }
        
        var data, params, param;
        data   = $scope.previous_data[controller];
        params = ChildOnlyParams($s);
        
        for (var i = 0; i < params.length; i++) {
            param = params[i];
            
            if (data.hasOwnProperty(param)) {
                $s[param] = data[param];
            }
        }
        
        return true;
    };
    
    var ChildOnlyParams = function ($s)
    {
        var params = [];
        
        for (var idx in $s) {
            if (!$scope.hasOwnProperty(idx) && ('$' != idx.substr(0, 1)) && !($s[idx] instanceof Function)) {
                params.push(idx);
            }
        }
        
        return params;
    };
    
    $scope.HandleNav = function (e)
    {
        if ($(e.target).parents('.swipe-able')[0]) {
            return;
        }
        
        var nav, main, state, offset, closing;
        nav   = $('div.app-nav-wrapper');
        main  = $('div.main-content');
        state = nav.data('state');
        
        if ('open' == state && 'swiperight' == e.type) {
            return;
        } else if ('closed' == state && 'swipeleft' == e.type) {
            return;
        } else if ('trans' == state) {
            return;
        }
        
        nav.data('state', 'trans');
        
        offset  = 50;
        closing = 'open' === state;
        
        if (closing) {
            main.css('left', '');
        }

        nav.animate({
            //marginLeft: (closing ? '-' + offset + '%' : '0')
            left: (closing ? '-' + offset + '%' : '0')
        }, {
            'speed': 'slow',
            'easing': 'linear',
            'progress': function (panim, prog, remaining) {
                var complete = 0;
                
                if (!closing) {
                    complete = offset * prog;
                } else {
                    complete = Math.round(offset * (1 - prog));
                }
                
                main.css('left', complete + "%");
            },
            'complete' : function () {
                nav.data('state', closing ? 'closed' : 'open');
                
                if (closing) {
                    main.removeAttr('style');
                }
            }
        });
    };
    
    $scope.HideNav = function ()
    {
        $scope.HandleNav({
            type: 'swipeleft'
        });
    }
}]);
