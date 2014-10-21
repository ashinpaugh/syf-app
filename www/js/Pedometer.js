/**
 * The pedometer's guts.
 * 
 * @author Austin Shinpaugh <ashinpaugh@gmail.com>
 */

var Pedometer = (function ($) {
    "use strict";
    
    var average, started, ended, samples, num_errors, watch_id,
        timer_id, is_tracking, steps, accelerometer;
    
    steps = 0;
    average = 0;
    samples = [];
    num_errors = 0;
    is_tracking = false;
    accelerometer = new Accellerometer();
    
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
        var context, counters;
        
        context  = this;
        counters = $('.counter-wrapper');
        
        counters.on('increment_counter', function () {
            var container, counter, val, prev;
            container = $(this);
            counter   = container.find('h3');
            val       = parseInt(counter.text().trim()) + 1;
            
            context.steps++;
            
            if (val <= 9) {
                counter.text(val);
                return false;
            }
            
            counter.text(0);
            prev = container.prevAll('.counter-wrapper:first');
            
            if (prev.length) {
                prev.trigger('increment_counter');
            }
            
            return false;
        });
        
        /*counters.click(function (e) {
            $(this).trigger('increment_counter');
        });*/
    }
    
    function doCalibration ()
    {
        var num_samples, axises, item, steps;
        
        num_samples = samples.length;
        axises      = {
            'x': {'min': 0, 'max': 0},
            'y': {'min': 0, 'max': 0},
            'z': {'min': 0, 'max': 0}
        };
        
        var findMinMax = function (data, sample) {
            if (data.min > sample) {
                data.min = sample;
            }
            
            if (data.max < sample) {
                data.max = sample;
            }
            
            return data;
        };
        
        for (item in samples) {
            axises.x = findMinMax(axises.x, item.x);
            axises.y = findMinMax(axises.y, item.y);
            axises.z = findMinMax(axises.z, item.z);
        }
        
        samples = [];
        
        console.log('-- Do Calibration --');
        console.log({
            'axis': 'X',
            'min':  axises.x.min,
            'max':  axises.x.max,
            'AVG':  (axises.x.max + axises.x.min) / 2
        });
        
        console.log({
            'axis': 'Y',
            'min':  axises.y.min,
            'max':  axises.y.max,
            'AVG':  (axises.y.max + axises.y.min) / 2
        });
        
        console.log({
            'axis': 'X',
            'min':  axises.z.min,
            'max':  axises.z.max,
            'AVG':  (axises.z.max + axises.z.min) / 2
        });
    }
    
    /**
     * The Pedometer handle.
     * @var {Pedometer}
     */
    //Pedometer._instance = null;

    /**
     * @constructor
     */
    function Accellerometer () {}
    
    Accellerometer.prototype.onSuccess = function (e)
    {
        samples.push(e);
        
        if (0 === samples.length % 25) {
            doCalibration();
        }
    };
    
    Accellerometer.prototype.onFailure = function (e)
    {
        num_errors++;
    };
    
    $(function () {
        document.addEventListener('deviceready', init, false);
    });
    
    return {
        getSteps : function () {
            return steps;
        },
        
        isTracking : function () {
            return is_tracking;
        },
        
        start : function ()
        {
            ended       = null;
            is_tracking = true;
            started     = new Date();
            
            //this.timer_id = setInterval(Pedometer.getElapsedTime, 1000);
            watch_id = navigator.accelerometer.watchAcceleration(
                accelerometer.onSuccess,
                accelerometer.onFailure, {
                    'frequency' : 250
                }
            );
        },
        
        stop : function ()
        {
            ended       = new Date();
            is_tracking = false;
            
            //clearInterval(this.timer_id);
            navigator
                .accelerometer
                .clearWatch(watch_id)
            ;
        },
        
        /**
         * Updates the amount of time that the pedometer has been running.
         * 
         * @returns {string}
         */
        getElapsedTime : function ()
        {
            if (!started) {
                return '00:00:00';
            }
            
            var now, start, diff, sec, min, hr, display;
            
            now   = new Date();
            start = started ? started : now;
            
            diff = (now - start) / 1000;
            sec  = Math.round((now - started) / 1000) % 60;
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
