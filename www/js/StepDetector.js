/**
 * Step Detector
 * 
 * Uses the device motion event to detect when a step has occurred.
 * 
 * @author Johnathan Fasking
 * @author Austin Shinpaugh
 */

"use strict";

var StepDetector = function ()
{
    this.enabled      = false;
    this.initialized  = false;
    this.stepStarted  = false;
    this.steps        = 0;
    this.sample_count = 0;
    this.callbacks    = [];
    this.vectors      = {};
};

/**
 * Starts the SD functionality.
 * 
 * @return {boolean}
 */
StepDetector.prototype.Start = function ()
{
    if (!window.DeviceMotionEvent) {
        return false;
    }
    
    var vector_coordinates = ['x', 'y', 'z'];
    
    for (var idx in vector_coordinates) {
        var cord = vector_coordinates[idx];
        this.vectors[cord] = {
            avg: 0,
            max: 0,
            min: 0,
            upperThresholdMin: 0,
            upperThresholdMax: 0,
            lowerThresholdMin: 0,
            lowerThresholdMax: 0
        };
    }
    
    var context  = this;
    this.enabled = true;
    this.event_wrapper = function (event) {
        context.OnMotion(event);
    };
    
    window.addEventListener('devicemotion', context.event_wrapper, false);
    
    return true;
};

/**
 * Stops the SD functionality.
 * 
 * @return {StepDetector}
 */
StepDetector.prototype.Stop = function ()
{
    var context  = this;
    this.enabled = false;
    
    window.removeEventListener('devicemotion', context.event_wrapper, false);
    
    return this;
};

/**
 * Callback registered to the device motion event.
 * 
 * @param {object} event
 */
StepDetector.prototype.OnMotion = function (event)
{
    var acceleration = event.accelerationIncludingGravity;
    var x = Math.abs(acceleration.x);
    var y = Math.abs(acceleration.y);
    var z = Math.abs(acceleration.z);
    
    this
        .ManageSampleRange(x, y, z)
        .CalculateThresholds()
    ;
    
    if (this.initialized && !this.stepStarted && this.RisingRangeAcceptable(x, y, z)) {
        this.stepStarted = true;
    } 

    if (this.stepStarted && this.FallingRangeAcceptable(z)) {
        this.stepStarted = false;
        this.OnStep();
    }
};

/**
 * Handles device motion samples.
 * 
 * @param x
 * @param y
 * @param z
 * @returns {StepDetector}
 */
StepDetector.prototype.ManageSampleRange = function (x, y, z)
{
    if (this.sample_count < StepDetector.getSampleLimit()) {
        return this.UpdateRange(x, y, z);
    }
    
    this.initialized = true;
    return this.ResetVariables(x, y, z);
};

/**
 * Calculate the "shifting window" aka threshold.
 * 
 * @returns {StepDetector}
 */
StepDetector.prototype.CalculateThresholds = function ()
{
    var factors, vector_coordinates;
    
    factors = {
        x: {
            maxUpperThreshold: 1.04,
            minUpperThreshold: 1.00,
            maxLowerThreshold: 0.99,
            minLowerThreshold: 0.0005
        },
        
        y: {
            maxUpperThreshold: 1.02,
            minUpperThreshold: 1.00,
            maxLowerThreshold: 0.95,
            minLowerThreshold: 0.65
        },
        
        z: {
            maxUpperThreshold: 1.50,
            minUpperThreshold: 1.09,
            maxLowerThreshold: 0.91,
            minLowerThreshold: 0.45
        }
    };
    
    vector_coordinates = ['x', 'y', 'z'];
    
    for (var idx in vector_coordinates) {
        var cord, vector, factor;
        cord   = vector_coordinates[idx];
        factor = factors[cord];
        vector = this.vectors[cord];
        
        vector.avg               = (vector.max + vector.min) / 2;
        vector.upperThresholdMin = vector.avg * factor.minUpperThreshold;
        vector.upperThresholdMax = vector.avg * factor.maxUpperThreshold;
        vector.lowerThresholdMin = vector.avg * factor.minLowerThreshold;
        vector.lowerThresholdMax = vector.avg * factor.maxLowerThreshold;
    }
    
    return this;
};

/**
 * Ensures the Accel Rate is within range. Rules out outliers. This
 * is the most difficult calculation.
 * 
 * @return {boolean}
 */
StepDetector.prototype.RisingRangeAcceptable = function (x, y, z)
{
    var vectors = this.vectors;
    
    return (x < vectors['x'].upperThresholdMax)
        && (z > vectors['z'].upperThresholdMin && z < vectors['z'].upperThresholdMax);
};

/**
 * Ensures the Decel Rate is within range. Rules out outliers.
 * 
 * @return {boolean}
 */
StepDetector.prototype.FallingRangeAcceptable = function (z)
{
    var vector = this.vectors['z'];
    
    //return z < vector.lowerThresholdMin && z > vector.lowerThresholdMax;
    return z > vector.lowerThresholdMin && z < vector.lowerThresholdMax;
};

/**
 * Resets the vectors to calculate new thresholds.
 * 
 * @param x
 * @param y
 * @param z
 * @returns {StepDetector}
 */
StepDetector.prototype.ResetVariables = function (x, y, z)
{
    this.sample_count = 0;
    
    var vector_coordinates = ['x', 'y', 'z'];
    var vector_samples     = [x, y, z];
    
    for (var idx in vector_coordinates) {
        var cord, sample;
        
        cord   = vector_coordinates[idx];
        sample = vector_samples.shift();
        
        this.vectors[cord].min = sample;
        this.vectors[cord].max = sample;
    }
    
    return this;
};

/**
 * Keeps track of the number of samples taken and the min / max values
 * out of those samples.
 * 
 * @param y
 * @param x
 * @param z
 * @returns {StepDetector}
 */
StepDetector.prototype.UpdateRange = function (x, y, z)
{
    this.sample_count++;
    
    var vector_coordinates = ['x', 'y', 'z'];
    var vector_samples     = [x, y, z];
    
    for (var idx in vector_coordinates) {
        var cord, sample, vector;
        
        cord   = vector_coordinates[idx];
        sample = vector_samples.shift();
        vector = this.vectors[cord];
        
        vector.min = sample < vector.min ? sample : vector.min;
        vector.max = sample > vector.max ? sample : vector.max;
    }
    
    return this;
};

/**
 * Registers a callback when a step is detected.
 * 
 * @param {Function} func
 * @return {StepDetector}
 */
StepDetector.prototype.addListener = function (func)
{
    if (typeof func !== 'function') {
        throw new Error('Param is not a function.');
    }
    
    this.callbacks.push(func);
    
    return this;
};

/**
 * Return the constant used to determine when to reset the min / max vector
 * ranges.
 * 
 * @returns {number}
 */
StepDetector.getSampleLimit = function ()
{
    return 15;
};

/**
 * Called when a step is taken and fires any callbacks that were
 * registered with this object.
 */
StepDetector.prototype.OnStep = function ()
{
    this.steps++;
    
    if (!this.callbacks.length) {
        return;
    }
    
    for (var i = 0; i < this.callbacks.length; i++) {
        this.callbacks[i]();
    }
};

/**
 * Indicates if the step detector is currently detecting the device's motion.
 * 
 * @returns {boolean}
 */
StepDetector.prototype.IsEnabled = function ()
{
    return this.enabled;
};
