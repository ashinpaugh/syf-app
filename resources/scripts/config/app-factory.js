/**
 * Contains services that are used for local storage.
 * 
 * @author Austin Shinpaugh
 */

okHealthServices.factory('TokenHandler', function () {
    var token, date;
    token = null;
    date  = null;
    
    return {
        get : function () {
            return token;
        },
        getFull : function () {
            return 'Bearer ' + token;
        },
        set : function (t) {
            token = t;
            date  = new Date();
        },
        clear : function () {
            token = date = null;
        }
    };
});

okHealthServices.factory('UserHandler', ['TokenHandler', 'TrackerHandler', function (TokenHandler, TrackerHandler) {
    var user = {};

    /**
     * http://stackoverflow.com/questions/4060004/calculate-age-in-javascript
     * @returns {number}
     */
    function computeAge (user)
    {
        var diff_ms, diff_date;
        diff_ms   = Date.now() - user.date_of_birth;
        diff_date = new Date(diff_ms);
        user.age  = Math.abs(diff_date.getUTCFullYear() - 1970);
        
        return user;
    }
    
    return {
        meta : function () {
            return user;
        },
        set : function (u) {
            user = computeAge(u);
        },
        logout : function () {
            user = {};
            TokenHandler.clear();
            TrackerHandler.clear();
        }
    };
}]);

okHealthServices.factory('TrackerHandler', function () {
    var meta = {};
    
    reset();
    
    function reset ()
    {
        meta = {
            steps:     0,
            consumed:  0,
            burned:    0,
            eaten_ids: []
        };
    }
    
    return {
        get : function () {
            return meta;
        },
        
        set : function (food_meta) {
            meta = food_meta;
        },
        
        getConsumed : function () {
            return meta.consumed;
        },
        
        getBurned : function () {
            return meta.burned;
        },
        
        getNet : function () {
            return parseInt(meta.consumed) - parseInt(meta.burned);
        },
        
        getEatenIds : function () {
            return meta.eaten_ids;
        },
        
        addEatenId : function (id) {
            meta.eaten_ids.push(id);
        },
        
        addCalories : function (cal) {
            meta.consumed += parseInt(cal);
        },
        
        hasConsumedLess : function ()
        {
            return parseInt(meta.consumed) <= parseInt(meta.burned);
        },
        
        getSteps : function () {
            return meta.steps;
        },
        
        addSteps : function (s)
        {
            meta.steps += parseInt(s);
        },
        
        addBurnedCalories : function (s) {
            meta.burned += s;
        },
        
        clear : function () {
            reset();
        }
    };
});