/**
 * Created by ashinpaugh on 9/20/14.
 */

var Pedomter;
(function ($) {
    "use strict";
    
    Pedomter.instance = null;
    
    Pedomter = function ()
    {
        
    };
    
    Pedomter.getInstance = function ()
    {
        if (null !== Pedomter) {
            return Pedomter.instance;
        }
        
        return (Pedomter.instance = new Pedomter());
    };
}) (jQuery);