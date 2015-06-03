/**
 * Common components used throughout the app.
 *
 * @author Austin Shinpaugh
 */

var App = (function ($)
{
    var Page, Resources, backup;
    
    Page      = function () {};
    Resources = function () {};
    backup    = {};

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
        if ('js' === path.substring(path.indexOf('.') + 1)) {
            LoadScript(path);
        } else {
            LoadCSS(path);
        }
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
        $(document).on('click', 'a[href^="//"], a[href^="http"]', function () {
            window.open(encodeURI(this.href), '_system', 'location=yes');
            
            return false;
        });
    }

    /**
     * Look for switch toggles and animate them.
     */
    Page.AnimateSwitches = function ()
    {
        $('.is-switch').bootstrapSwitch();
    };

    /**
     * Determine if a scope state was saved.
     * 
     * @return boolean
     */
    Page.HasBackupData = function (controller)
    {
        return backup.hasOwnProperty(controller);
    };

    /**
     * Save a scope's state.
     * 
     * @param controller
     * @param $s
     * @returns {boolean}
     */
    Page.BackupData = function (controller, $s)
    {
        var data, params, param;
        data   = backup[controller] || {};
        params = childOnlyParams($s);
        
        for (var i = 0; i < params.length; i++) {
            param       = params[i];
            data[param] = $s[param];
        }
        
        backup[controller] = data;
        
        return true;
    };

    /**
     * Fill the scope if the user is returning to a page
     * they previously visited.
     * 
     * @param controller
     * @param $parent
     * @param $child
     * 
     * @returns {boolean}
     */
    Page.QuickFillScope = function (controller, $parent, $child)
    {
        if (!Page.HasBackupData(controller)) {
            return false;
        }
        
        var data, params, param;
        data   = backup[controller];
        params = childOnlyParams($parent, $child);
        
        for (var i = 0; i < params.length; i++) {
            param = params[i];
            
            if (data.hasOwnProperty(param)) {
                $child[param] = data[param];
            }
        }
        
        return true;
    };

    /**
     * Compare to AngularJS scopes and return the parameter
     * names that are unique to the child.
     * 
     * @param $parent
     * @param $child
     * 
     * @returns {Array}
     */
    var childOnlyParams = function ($parent, $child)
    {
        var params = [];
        
        for (var idx in $child) {
            if (!$parent.hasOwnProperty(idx) && ('$' != idx.substr(0, 1)) && !($child[idx] instanceof Function)) {
                params.push(idx);
            }
        }
        
        return params;
    };
    
    $(function () {
        bindExternalLinks();
    });
    
    return {
        'Resources' : Resources,
        'Page'      : Page
    };
}) (jQuery);
