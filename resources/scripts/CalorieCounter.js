var CalorieCounter;

(function () {
    'use strict';
    
    CalorieCounter = function (sex, age, weight, height)
    {
        this.sex    = sex;
        this.age    = age;
        this.weight = weight;
        this.height = height;
        this.BMR    = CalorieCounter.CalculateBMR(this);
    };
    
    /**
     * Calculates the calories burned based on a physical profile and activity
     * performed.
     * 
     * @param {string} activity
     * @param {number} duration
     * 
     * @returns {number}
     */
    CalorieCounter.prototype.getCaloriesBurned = function (activity, duration)
    {
        console.log(this);
        console.log([(this.BMR / 24), CalorieCounter.getMETValues(activity), (duration / 3600)]);
        
        return Math.ceil(
            (this.BMR / 24)
            * CalorieCounter.getMETValues(activity)
            * (duration / 3600)
        );  
    };
    
    /**
     * Returns the MET values for various physical activities.
     * 
     * @param {string} activity
     * 
     * @returns {Object}
     */
    CalorieCounter.getMETValues = function (activity)
    {
        var hash = {
            Frisbee: 4,
            Golf: 3,
            Walking: 4.3,
            Jogging: 12.3,
            Racquetball: 9,
            Rowing: 10,
            Running: 14.6,
            Soccer:  7,
            Softball: 4,
            Swimming: 6.8,
            Tennis: 6,
            'Trail Biking': 5,
            Volleyball: 6,
            Weightlifting: 5,
            Wrestling: 5,
            Yoga: 3.2
        };
        
        if (!activity || typeof activity == 'undefined') {
            return hash;
        }
        
        if (hash.hasOwnProperty(activity)) {
            return hash[activity];
        }
        
        for (var idx in hash) {
            if (activity == idx.toLowerCase()) {
                return hash[idx];
            }
        }
        
        throw new Error('Activity not found.');
    };
    
    
    /**
     * Calculate a subject's BMR.
     * This calculation is based off of the Harrison-Benedict equations.
     * 
     * @param {CalorieCounter} instance
     * 
     * @returns {number}
     */
    CalorieCounter.CalculateBMR = function (instance)
    {
        var LBS_TO_KG  = 0.453592;
        var INCH_TO_CM = 2.54;
        
        var weight, height;
        weight = LBS_TO_KG  * instance.weight;
        height = INCH_TO_CM * instance.height;
        
        if (1 == instance.sex) {
            // Equation for males.
            return (13.75 * weight) + (5 * height) + (6.76 * instance.age) + 66;
        }
        
        return (9.56 * weight) + (1.85 * height) + (4.68 * instance.age) + 655;
    };
}) ();
