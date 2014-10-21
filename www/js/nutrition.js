/**
 * Nutrition.
 * 
 * @author Austin Shinpaugh
 */

"use strict";

(function ($) {
    
    function SetupBindings ()
    {
        $('body').on('keydown', '.input-wrapper input', function (e) {
            if (13 !== e.which) {
                return;
            }
            
            $('.button-wrapper button').click();
        });
    }
    
    SetupBindings();
}) (jQuery);