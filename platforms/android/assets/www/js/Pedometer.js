/**
 * The pedometer's guts.
 * 
 * @author Austin Shinpaugh <ashinpaugh@gmail.com>
 */

var Pedometer;
(function ($) {
    "use strict";

    /**
     * @constructor
     */
    Pedometer = function ()
    {
        this.average    = 0;
        this.started    = null;
        this.ended      = null;
        this.samples    = [];
        this.num_errors = 0;
        
        this.watch_id      = null;
        this.timer_id      = null;
        this.is_tracking   = false;
        this.steps         = 0;
        this.accelerometer = new Pedometer.Accellerometer();
    };
    
    Pedometer.prototype = {
        start : function ()
        {
            this.ended       = null;
            this.is_tracking = true;
            this.started     = new Date();
            
            //this.timer_id = setInterval(Pedometer.getElapsedTime, 1000);
            this.watch_id = navigator.accelerometer.watchAcceleration(
                this.accelerometer.onSuccess,
                this.accelerometer.onFailure, {
                'frequency' : 250
            });
        },
        stop : function ()
        {
            this.ended       = new Date();
            this.is_tracking = false;
            
            //clearInterval(this.timer_id);
            navigator
                .accelerometer
                .clearWatch(this.watch_id)
            ;
        },
        
        /**
         * Updates the amount of time that the pedometer has been running.
         * 
         * @returns {string}
         */
        getElapsedTime : function ()
        {
            if (!this.started) {
                return '00:00:00';
            }
            
            var now, started, diff, sec, min, hr, display;
            
            now     = new Date();
            started = this.started ? this.started : now;
            
            diff = (now - started) / 1000;
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
            
            //$('#timer').text(display);
            
            return display;
        }
    };

    /**
     * Returns the singleton of this class.
     * 
     * @returns {Pedometer}
     */
    Pedometer.getInstance = function ()
    {
        if (null !== Pedometer._instance) {
            return Pedometer._instance;
        }
        
        return (Pedometer._instance = new Pedometer());
    };

    /**
     * Initialize!
     * @return {Pedometer}
     */
    Pedometer.init = function ()
    {
        var pedo = Pedometer.getInstance();
        
        Pedometer.bindEvents.call(pedo);
        
        return this;
    };

    /**
     * Binds the requisite pedometer events.
     */
    Pedometer.bindEvents = function ()
    {
        Pedometer.bindCounterEvents.call(this);
    };

    /**
     * Binds the events associated to the counter.
     */
    Pedometer.bindCounterEvents = function ()
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
    };
    
    Pedometer.doCalibration = function ()
    {
        var num_samples, axises, item, steps;
        
        num_samples = this.samples.length;
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
        
        for (item in this.samples) {
            axises.x = findMinMax(axises.x, item.x);
            axises.y = findMinMax(axises.y, item.y);
            axises.z = findMinMax(axises.z, item.z);
        }
        
        this.samples = [];
        
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
    };
    
    /**
     * The Pedometer handle.
     * @var {Pedometer}
     */
    Pedometer._instance = null;

    /**
     * @constructor
     */
    Pedometer.Accellerometer = function () {};
    
    Pedometer.Accellerometer.prototype.onSuccess = function (e)
    {
        var pedo = Pedometer.getInstance();
        pedo.samples.push(e);
        
        if (0 === pedo.samples.length % 25) {
            Pedometer.doCalibration.call(pedo);
        }
    };
    
    Pedometer.Accellerometer.prototype.onFailure = function (e)
    {
        this.num_errors++;
    };
    
    $(function () {
        document.addEventListener('deviceready', Pedometer.init, false);
    });
}) (jQuery);
