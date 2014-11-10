/**
 * The pedometer utility's UI component.
 * 
 * @author Austin Shinpaugh <ashinpaugh@gmail.com>
 */

var Pedometer = (function ($) {
    "use strict";
    
    var average, started, ended, samples, num_errors, watch_id,
        timer_id, is_tracking, steps, accelerometer, calibrating, detector;
    
    steps = 0;
    samples = [];
    num_errors = 0;
    is_tracking = false;
    calibrating   = false;
    detector = new StepDetector();
    
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
    
    function OnStepTaken ()
    {
        steps++;
        $('#tenths').trigger('increment_counter');
    }

    
    function onTrackingStop ()
    {
        if (!calibrating) {
            return;
        }
        
        calibrating = false;
        var table   = $('#results');
        
        table.children('tr').not(':first').remove();
        
        for (var idx in samples) {
            if (!samples.hasOwnProperty(idx)) {
                continue;
            }
            
            var row, sample;
            row    = $('<tr>');
            sample = samples[idx];
            
            for (var dirs in {x: '', y: '', z: ''}) {
                $('<td>').text(sample[dirs]).appendTo(row);
            }
            
            row.appendTo(table);
        }
    }
    
    function StepDetector ()
    {
        this.threshold  = new AccelPoint(0, 0, 0);
        this.prev_point = new AccelPoint(0, 0, 0);
        
        this.samples   = [];
        this.watch_id  = null;
        this.prev_time = Date.now();
    }
    
    StepDetector.prototype.Start = function ()
    {
        var that = this;
        this.watch_id = navigator.accelerometer.watchAcceleration(
            function (data) {
                that.DetectStep(data);
            },
            function (var1) {
                that.PollingFailure(var1);
            }, {
                frequency: 250
            }
        );
    };
    
    StepDetector.prototype.Stop = function ()
    {
        ended = new Date();
        
        navigator
            .accelerometer
            .clearWatch(this.watch_id)
        ;
        
        this.watch_id = null;
    };
    
    StepDetector.prototype.AddSample = function (point, delta)
    {
        this.prev_point = point;
        
        if (0.75 >= Math.abs(delta.diff)) {
            return point;
        }
        
        //console.log(['Add Sample', point, this.prev_point, delta]);
        this.samples.push(point);
        
        return point;
    };
    
    StepDetector.prototype.DetectStep = function (data) {
        var point, pp, base, delta, v, now;
        point = new AccelPoint(data.x, data.y, data.z);
        pp    = this.prev_point;
        base  = this.GetThreshold();
        delta = point.getGreatestVectorDelta(pp);
        v     = delta.vector;
        now   = Date.now();
        
        this.AddSample(point, delta);
        
        /*if (!this.prev_point.StepCheck(data, base)) {
            return;
        }*/
        
        if (now - this.prev_time < 200) {
            return;
        }
        
        console.log([point, base, delta, point[v] < base[v], pp.StepCheck(point, base)]);
        if (point[v] < base[v] && pp.StepCheck(point, base)) {
            console.log('Step Detected');
            
            this.prev_time = now;
            
            OnStepTaken();
        }
    };
    
    
    StepDetector.prototype.GetThreshold = function ()
    {
        if (this.samples.length % 25 > 0) {
            return this.threshold;
        }
        
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
        
        console.log('-- Do Calibration --');
        
        for (var idx in this.samples) {
            var sample = this.samples[idx];
            
            axises.x = findMinMax(axises.x, sample.x);
            axises.y = findMinMax(axises.y, sample.y);
            axises.z = findMinMax(axises.z, sample.z);
            
            console.log([sample.x, sample.y, sample.z]);
        }
        
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
        
        this.threshold = new AccelPoint(
            (axises.x.max + axises.x.min) / 2,
            (axises.y.max + axises.y.min) / 2,
            (axises.z.max + axises.z.min) / 2
        );
        
        return this.threshold;
    };
    
    StepDetector.prototype.PollingFailure = function (var1)
    {
        console.log('Polling failure');
        console.log(var1);
    };
    
    //StepDetector.prototype.constructor = StepDetector;
    
    function AccelPoint (x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    AccelPoint.prototype.getGreatestVectorDelta = function (point)
    {
        if (!point instanceof AccelPoint) {
            throw new Error();
        }
        
        var x, y, z, results, idx, highest;
        x = Math.abs(this.x - point.x);
        y = Math.abs(this.y - point.y);
        z = Math.abs(this.z - point.z);
        
        results = {'x': x, 'y': y, 'z': z};
        highest = 'x';
        
        for (idx in results) {
            if (results[highest] < results[idx]) {
                highest = idx;
            }
        }
        
        return {
            vector: highest,
            diff:   point[highest] - this[highest]
        };
    };
    
    AccelPoint.prototype.StepCheck = function (point, threshold)
    {
        /*if (0.3 > point.x) {
            return false;
        }*/
        
        var delta, vector;
        delta  = this.getGreatestVectorDelta(point);
        vector = delta.vector;
        
        //console.log(['StepCheck', this, point, delta, threshold, point[vector] < this[vector]]);
        
        /*return point[vector] > this[vector]
           && threshold[vector] < point[vector]
        ;*/
        return point[vector] < this[vector];
    };
    
    function getLargestNum(nums)
    {
        var idx, highest, num;
        highest = nums[0];
        
        for (idx = 1; idx < nums.length; idx++) {
            num = nums[idx];
            
            if (num > highest) {
                highest = num;
            }
        }
        
        return highest;
    }

    /**
     * @constructor
     */
    function Accellerometer () {}
    
    Accellerometer.prototype.onSuccess = function (e)
    {
        console.log('Accel success');
        samples.push(e);
        
        if (0 === samples.length % 25) {
            doCalibration();
        }
    };
    
    Accellerometer.prototype.onFailure = function (e)
    {
        console.log('Accel failed.');
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
            
            detector.Start();
        },
        
        stop : function ()
        {
            ended       = new Date();
            is_tracking = false;
            
            detector.Stop();
            
            onTrackingStop();
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
        },
        
        setCalibrate : function (val) {
            var type = typeof val;
            
            calibrating = $.inArray(type, ['undefined', 'object']) ? !calibrating : val;
        }
    };
}) (jQuery);
