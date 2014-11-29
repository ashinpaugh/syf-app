/**
 * The pedometer utility's UI component.
 * 
 * @author Austin Shinpaugh <ashinpaugh@gmail.com>
 */

var Pedometer = (function ($) {
    "use strict";
    
    var start_time, ended_time, steps, detector, calibrating;
    
    start_time  = null;
    ended_time  = null;
    steps       = 0;
    detector    = null;
    
    /**
     * Initialize!
     */
    function init ()
    {
        bindEvents();
    }

    /**
     * Binds the requisite pedometer events.
     */
    function bindEvents ()
    {
        bindCounterEvents();
    }

    /**
     * Binds the events associated to the counter.
     */
    function bindCounterEvents ()
    {
        $(document).on('increment_counter', '.counter-wrapper', function () {
            var container, counter, val, prev;
            container = $(this);
            counter   = container.find('h3');
            val       = parseInt(counter.text().trim()) + 1;
            
            if (val <= 9) {
                counter.text(val);
                return false;
            }
            
            counter.text(0);
            prev = counter.parent().prevAll('.counter-wrapper:first');
            
            if (prev.length) {
                prev.trigger('increment_counter');
            }
            
            return false;
        });
    }

    /**
     * Called when a step was taken.
     */
    function OnStepTaken ()
    {
        console.log(['On step taken', this]);
        
        steps++;
        $('.counter-wrapper:last').trigger('increment_counter');
    }
    
    /**
     * On document ready binding.
     */
    $(function () {
        document.addEventListener('deviceready', init, false);
    });
    
    return {
        /**
         * Get the steps taken for this session.
         * 
         * @returns {number}
         */
        getSteps : function () {
            return steps;
        },
        
        isTracking : function () {
            return detector instanceof StepDetector && detector.IsEnabled();
        },

        /**
         * Start the pedometer.
         */
        start : function ()
        {
            ended_time  = null;
            start_time  = new Date();
            detector    = new StepDetector();
            
            detector
                .addListener(OnStepTaken)
                .Start()
            ;
        },

        /**
         * Stop the pedometer.
         */
        stop : function ()
        {
            ended_time = new Date();
            detector.Stop();
        },
        
        /**
         * Updates the amount of time that the pedometer has been running.
         * 
         * @returns {string}
         */
        getElapsedTime : function ()
        {
            if (!detector || !detector.IsEnabled()) {
                return '00:00:00';
            }
            
            var now, start, diff, sec, min, hr, display;
            
            now   = new Date();
            start = start_time ? start_time : now;
            
            diff = (now - start) / 1000;
            sec  = Math.round((now - start) / 1000) % 60;
            min  = (diff / 60)   % 60;
            hr   = (diff / 3600) % 3600;
            
            var timerRound = function (num) {
                num = Math.floor(num);
                
                return ("00" + num).slice(-2);
            };
            
            display = timerRound(hr)
                + ':' + timerRound(min)
                + ':' + timerRound(sec)
            ;
            
            return display;
        }
    };
}) (jQuery);
