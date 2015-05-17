/**
 * Base controller.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

okHealthControllers.controller('AppCtrl', ['$window', '$location', '$scope', '$swipe', 'UserHandler', 'TrackerHandler', 'GroupApi', 'SchoolApi', function ($window, $location, $scope, $swipe, UserHandler, TrackerHandler, GroupApi, SchoolApi) {
    $scope.$location    = $location;
    $scope.token        = null;
    $scope.user         = null;
    $scope.tracker      = TrackerHandler;
    $scope.groups       = GroupApi.getAll();
    $scope.schools      = SchoolApi.getAll();
    $scope.eaten_today  = [];
    $scope.redirect_url = '';
    $scope.previous_data = {};
    
    // Overlay.
    $scope.isSearching     = false;
    $scope.overlay         = false;
    $scope.overlay_message = '';
    
    // Pagination.
    $scope.page        = 0;
    $scope.page_range  = {};
    $scope.total_pages = 0;
    
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
        return UserHandler.meta()
            && UserHandler.meta().hasOwnProperty('username')
        ;
    };
    
    $scope.EnableOverlay = function (message)
    {
        $scope.isSearching     = true;
        $scope.overlay_message = message;
        
        $('#overlay-message')
            .modal('show')
            .position({
                'of' : $(window)
            })
        ;
        
    };
    
    $scope.DisableOverlay = function ()
    {
        $scope.isSearching     = false;
        $scope.overlay_message = '';
        
        $('#overlay-message').modal('hide');
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
    
    $scope.GetPaginationPath = function ()
    {
        return $location.path();
    };
    
    $scope.SetupPagination = function (page, max_results, max_items)
    {
        $scope.page        = page;
        $scope.total_pages = Math.ceil(max_items / max_results);
        $scope.page_range  = $scope.pageRange(1, $scope.total_pages);
    };

    /**
     * @see http://stackoverflow.com/questions/11873570/angularjs-for-loop-with-numbers-ranges
     * @param min
     * @param max
     * @param step
     * @returns {Array}
     */
    $scope.range = function(min, max, step)
    {
        var input, i;
        step  = step || 1;
        input = [];
        
        for (i = min; i <= max; i += step) {
            input.push(i);
        }
        
        return input;
    };
    
    $scope.pageRange = function(page, max_pages)
    {
        var range = {
            min: page < 1 ? 1 : page,
            max: max_pages < 5 ? max_pages : 5
        };
        
        if (page - 2 >= 1) {
            range.min = page - 2;
        }
        
        if (page + 2 <= max_pages && page + 2 > range.max) {
            range.max = page + 2;
        }
        console.log(range);
        return $scope.range(range.min, range.max);
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
