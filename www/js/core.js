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
     * Apply the loading animation.
     * 
     * @param jQuery target
     */
    Page.ToggleLoadingAnimation = function (target)
    {
        target = target.hasOwnProperty('find') ? target : $(target);
        
        if (target.find('.syf-loading')) {
            target.remove('.syf-loading');
            return;
        }
        
        $('<div>')
            .addClass('syf-loading')
            .append(
                $('<div>').addClass('fa fa-circle-o-notch fa-spin')
            )
            .appendTo(target)
        ;
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
            window.open(encodeURI(this.href), '_system', 'location=yes');
            
            return false;
        });
    }
    
    $(function () {
        bindExternalLinks();
    });
    
    return {
        'Resources' : Resources,
        'Page'      : Page
    }
}) (jQuery);
