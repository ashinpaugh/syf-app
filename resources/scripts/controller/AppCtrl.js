/**
 * Base controller.
 * 
 * @author Austin Shinpaugh
 */

okHealthControllers.controller('AppCtrl', ['$window', '$location', '$scope', '$swipe', 'UserHandler', 'TrackerHandler', 'GeneralApi', function ($window, $location, $scope, $swipe, UserHandler, TrackerHandler, GeneralApi) {
    'use strict';
    
    $scope.$location    = $location;
    $scope.user         = null;
    $scope.tracker      = TrackerHandler;
    $scope.groups       = [];
    $scope.schools      = [];
    $scope.board        = [];
    $scope.eaten_today  = [];
    $scope.redirect_url = '';
    
    // Overlay.
    $scope.isSearching     = false;
    $scope.overlay         = false;
    $scope.overlay_message = '';
    
    // Pagination.
    $scope.page        = 0;
    $scope.page_range  = {};
    $scope.total_pages = 0;

    /**
     * Navigate the user backward using their history.
     */
    $scope.$back = function () {
        $window.history.back();
    };

    /**
     * Navigate the user forward along their history.
     */
    $scope.$forward = function () {
        $window.history.forward();
    };

    /**
     * Return the UserHandler.
     * 
     * @returns {UserHandler}
     */
    $scope.getUser = function ()
    {
        return UserHandler;
    };

    /**
     * Return the TrackerHandler.
     * 
     * @returns {TrackerHandler}
     */
    $scope.getTracker = function ()
    {
        return TrackerHandler;
    };
    
    $scope.EnsureValidUser = function ()
    {
        return UserHandler.meta() &&
            UserHandler.meta().hasOwnProperty('username')
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
        
        $location.url('/login').search({'message': message});
        
        return true;
    };
    
    $scope.fillScope = function (location, $child)
    {
        App.Page.QuickFillScope(location, $scope, $child);
    };

    /**
     * Override-able method to determine what the pagination should link to.
     * @returns {string}
     */
    $scope.GetPaginationPath = function ()
    {
        return $location.path();
    };

    /**
     * Sets the global values to build pagination.
     * 
     * @param page
     * @param max_results
     * @param max_items
     */
    $scope.SetupPagination = function (page, max_results, max_items)
    {
        $scope.page        = page;
        $scope.total_pages = Math.ceil(max_items / max_results);
        $scope.page_range  = findRange(page, $scope.total_pages);
    };

    /**
     * @see http://stackoverflow.com/questions/11873570/angularjs-for-loop-with-numbers-ranges
     * @param min
     * @param max
     * @param step
     * @returns {Array}
     */
    var buildRange = function(min, max, step)
    {
        var input, i;
        step  = step || 1;
        input = [];
        
        for (i = min; i <= max; i += step) {
            input.push(i);
        }
        
        return input;
    };

    /**
     * Find the start and end points for the pagination.
     * 
     * @param page
     * @param max_pages
     * 
     * @returns {Array}
     */
    var findRange = function(page, max_pages)
    {
        page      = parseInt(page) + 1;
        max_pages = parseInt(max_pages);
        
        var visible, offset, range;
        visible = 5;
        offset  = (visible - 1) / 2;
        range   = {
            min: 1,
            max: 5
        };
        
        if ((page - offset) > 1) {
            range.min  = page - offset;
        }
        
        if (range.max < (page + offset) && (page + offset) > visible) {
            range.max = page + offset;
        }
        
        if (range.max > max_pages) {
            range.max = max_pages;
        }
        
        if ((range.max - range.min) < visible && range.min > visible) {
            range.min = range.max - visible;
        }

        return buildRange(range.min, range.max);
    };

    /**
     * Save the user's current location.
     * 
     * @param path
     */
    $scope.SaveLocation = function (path)
    {
        $scope.redirect_url = path ? path : $location.url();
    };

    /**
     * Redirect the user to their {@see SaveLocation}.
     * 
     * @returns {boolean}
     */
    $scope.RedirectUser = function ()
    {
        if (!$scope.redirect_url.length) {
            return false;
        }
        
        $location.url($scope.redirect_url);
        $scope.redirect_url = '';
        
        return true;
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
    };
    
    GeneralApi.fetch(function (data) {
        $scope.schools = data.schools;
        $scope.groups  = data.groups;
        $scope.board   = data.board;
    });
}]);
