/**
 * Common components used throughout the app.
 *
 * @author Austin Shinpaugh
 */

var SYF = (function ($)
{
    var Page      = function () {};
    var Resources = function () {};

    /**
     * Sets the page sub-title.
     * 
     * @param name
     * @param flag
     * 
     * @return bool
     */
    Page.SetSubtitle = function (name, flag)
    {
        var header = $('#header');
        header.text(name);
        
        if (typeof flag !== 'undefined') {
            header.toggle(flag);
        }
        
        return header.is(':hidden');
    };

    /**
     * Loads a resource onto the page based on the file extension.
     * 
     * @param path
     */
    Resources.Load = function (path)
    {
        if (path instanceof Array) {
            for (var idx in path) {
                if (path.hasOwnProperty(idx)) {
                    Resources.Load(path[idx]);
                }
            }
            
            return;
        }
        
        'js' === path.substring(path.indexOf('.') + 1)
            ? LoadScript(path)
            : LoadCSS(path)
        ; 
    };

    /**
     * Opens external links using the InAppBrowser APIs.
     */
    function bindExternalLinks ()
    {
        $('a[href^="//"], a[href^="http"]').click(function (e) {
            e.preventDefault();
            
            window.open($(this).attr('href'), '_system', 'location=yes');
        });
    }
    
    /**
     * Loads a CSS file onto the page if it hasn't already been loaded.
     *
     * @param path
     */
    function LoadCSS (path)
    {
        if ($('link[href*="' + path + '"]')[0]) {
            return;
        }
        
        $('<link/>', {
            'rel'  : 'stylesheet',
            'type' : 'text/css',
            'href' : path
        }).appendTo('head');
    }

    /**
     * Loads a JS file if it hasn't already been loaded.
     * 
     * @param path
     */
    function LoadScript (path)
    {
        if ($('script[src*="' + path + '"]')[0]) {
            return;
        }
        
        $('<script/>', {
            'type' : 'text/javascript',
            'src' : path
        }).appendTo('body');
    }

    /**
     * Sets up the listeners for the swipe events and toggles the display
     * of the nav bar.
     * 
     * @return void
     */
    function SetupPageNav ()
    {
        bindNavSwipes();
        
        var nav = $('div.app-nav-wrapper');
        nav.on('click', 'a', function (e) {
            if (nav.is(':hidden')) {
                return;
            }
            
            $(document).trigger('swipeleft');
        });
    }
    
    function bindNavSwipes ()
    {
        $(document).bind('swipeleft swiperight', function (e) {
            var nav, main, state, offset, closing, margin;
            nav   = $('div.app-nav-wrapper');
            main  = $('div.main-content');
            state = nav.data('state');
            
            if ('open' == state && 'swiperight' == e.type) {
                return;
            } else if ('closed' == state && 'swipeleft' == e.type) {
                return;
            }
            
            nav.data('state', 'trans');
            
            offset  = 50;
            closing = 'open' === state;
            margin  = closing ? '-' + offset + '%' : '0';
            
            nav.animate({
                marginLeft: margin
            }, {
                'speed': 'fast',
                'easing': 'linear',
                'progress': function (panim, prog, remaining) {
                    var complete = 0;
                    
                    if (!closing) {
                        complete = offset * prog;
                    } else {
                        complete = offset * (1 - prog);
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
        });
    }
    
    $(function () {
        SetupPageNav();
        bindExternalLinks();
    });
    
    return {
        'Resources' : Resources,
        'Page'      : Page
    }
}) (jQuery);
