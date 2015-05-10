/**
 * The pedometer utility's UI component.
 * 
 * @author Austin Shinpaugh <ashinpaugh@gmail.com>
 */

var Pedometer = (function ($) {
    "use strict";

    /**
     * @var StepDetector
     */
    var detector = null;

    /**
     * @var CalorieCounter
     */
    var tracker = null;
    
    var activity, start_time, ended_time, steps, calories,
        activity_started, activity_ended, last_step
    ;
    
    /**
     * Initialize!
     */
    function init ()
    {
        ResetPedometer();
        bindEvents();
    }

    /**
     * Binds the requisite pedometer events.
     */
    function bindEvents ()
    {
        bindCounterEvents();
        
        $('.counter-wrapper').click(function ($e) {
            console.log('clicked');
            detector.OnStep();
        });
    }
    
    /**
     * Reset the pedometer variables.
     */
    function ResetPedometer ()
    {
        activity   = 'walking';
        start_time = null;
        ended_time = null;
        calories   = 0;
        steps      = 0;
        
        activity_started = 0;
        activity_ended   = 0;
        last_step        = 0;
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
     * Tracks the start / end times of this workout session.
     */
    function StartExerciseTimer ()
    {
        ended_time = null;
        start_time = new Date();
    }
    
    /**
     * Activity timestamps monitor when a user went from walking, jogging, and running.
     */
    function ResetActivityTimer (act)
    {
        if (act) {
            calories += tracker.getCaloriesBurned(
                activity,
                getActivityDuration()
            );
            
            activity = act;
        }
        
        
        activity_ended   = null;
        activity_started = null;
    }

    /**
     * Stop tracking the exercise.
     */
    function StopExercise ()
    {
        activity_ended = new Date();
        ended_time     = new Date();
        
        calories += tracker.getCaloriesBurned(activity, getActivityDuration());
    }
    
    /**
     * Returns the duration of the exercise in seconds.
     * @return {number}
     */
    function getActivityDuration ()
    {
        if (!activity_started) {
            return 0;
        }
        
        var ended = activity_ended ? activity_ended : new Date();
        return Math.ceil(ended.getTime() - activity_started.getTime()) / 1000;
    }
    

    /**
     * Turns off activity and calorie monitoring when the user is inactive.
     */
    function monitorActivity ()
    {
        if (!(steps % 10)) {
            ResetActivityTimer(activity);
        }
        
        if (1 == steps || !activity_started) {
            console.log('started');
            activity_started = new Date();
        }
        
        if (last_step && ((new Date().getTime() - last_step) > 10000)) {
            console.log('resetting');
            activity_ended = new Date(last_step);
            ResetActivityTimer(activity);
            activity_started = new Date();
        }
        
        last_step = new Date().getTime();
    }

    /**
     * Determine if the Pedometer is enabled.
     * 
     * @returns {boolean}
     */
    function isTracking ()
    {
        return detector instanceof StepDetector && detector.IsEnabled();
    }

    /**
     * Called when a step was taken.
     */
    function OnStepTaken ()
    {
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
        setActivity : function (act) {
            if (!$.inArray(act, ['walking', 'jogging', 'running'])) {
                return false;
            }
            
            ResetActivityTimer(act);
            
            return true;
        },
        
        /**
         * Get the steps taken for this session.
         * 
         * @returns {number}
         */
        getSteps : function () {
            return steps;
        },
        
        getStartTime: function () {
            return start_time.getTime() / 1000;
        },
        
        getEndTime: function () {
            return ended_time.getTime() / 1000;
        },
        
        isTracking : function () {
            return isTracking();
        },
        
        getCaloriesBurned: function () {
            /*var burnt = calories;
            if (isTracking()) {
                burnt = tracker.getCaloriesBurned(activity, getActivityDuration());
            }
            
            return Math.round(burnt);*/
            return calories;
        },

        /**
         * Start the pedometer.
         * 
         * @param {object} user The user's meta information.
         */
        start : function (user)
        {
            ResetPedometer();
            StartExerciseTimer();
            ResetActivityTimer();
            
            detector = new StepDetector();
            tracker  = new CalorieCounter(
                user.sex,
                user.age,
                user.weight,
                user.height
            );
            
            detector
                .addListener(OnStepTaken)
                .addListener(monitorActivity)
                .Start()
            ;
        },

        /**
         * Stop the pedometer.
         */
        stop : function ()
        {
            StopExercise();
            
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
