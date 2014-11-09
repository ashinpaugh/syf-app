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
        
        //path = 'file:///android_asset/www/' + path;
        'js' === path.substring(path.indexOf('.') + 1)
            ? LoadScript(path)
            : LoadCSS(path)
        ; 
    };

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
     * Opens external links using the InAppBrowser APIs.
     */
    function bindExternalLinks ()
    {
        $(document).on('click', 'a[href^="//"], a[href^="http"]', function (e) {
            var handle = window.open(encodeURI(this.href), '_system', 'location=yes');
            handle.addEventListener('loadstart', function () {
                console.log('start');
            });
            
            handle.addEventListener('loadstop', function () {
                console.log('stop')
            });
            
            handle.addEventListener('exit', function () {
                console.log('exit');
            });
            
            return false;
        });
    }
    
    /**
     * Sets up the listeners for the swipe events and toggles the display
     * of the nav bar.
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
                    
                    console.log('complete: ' + complete);
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
