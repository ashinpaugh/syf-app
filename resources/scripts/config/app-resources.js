okHealthServices.factory('AccountApi', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/account';

    return $resource('', {}, {
        register : {
            url: base + '.json',
            method: 'POST',
            params: {
                username: '@username',
                password: '@password',
                first_name: '@first_name',
                last_name: '@last_name',
                height: '@height',
                dob: '@dob',
                sex: '@sex',
                weight: '@weight',
                school_id: '@school_id',
                group_id: '@group_id',
                student_id: '@student_id',
                email: '@email'
            }
        },
        
        login : {
            url: ApiEndpoint + '/login.json',
            method: 'POST'
        },
        
        logout : {
            url: base + '/logout.json',
            method: 'GET',
            isArray: false
        },
        
        stats : {
            url: base + '/stats.json',
            method: 'GET',
            isArray: true
        }
    });
}]);

/**
 * The FatSecret API service.
 */
okHealthServices.factory('FS', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/food';
    
    return $resource('', {}, {
        get : {
            url: base + '/:food_id.json',
            method: 'GET',
            params: {food_id: '@food_id'}
        },
        batch : {
            url:    base + '/:food_ids.json',
            method: 'GET',
            params: {'food_ids': '@food_ids'},
            isArray: true
        },
        search : {
            url: base + '.json',
            method: 'GET'
        },
        addEatenItem : {
            url: base + '/diary.json',
            method: 'POST',
            params: {
                id: '@id',
                serving_id: '@serving_id',
                name: '@name'
            }
        },
        history : {
            url: base + '/history.json',
            method: 'GET',
            isArray: true,
            params: {
                q: '@username'
            }
        }
    });
}]);

okHealthServices.factory('PedometerApi', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/entry';
    
    return $resource('', {}, {
        entry : {
            url: base + '/:started/:ended/:steps/:calories.json',
            method: 'POST',
            params: {
                steps:    '@steps',
                calories: '@calories',
                started: '@started_on',
                ended: '@ended_on'
            }
        }
    });
}]);

okHealthServices.factory('BoardApi', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/board';
    
    return $resource('', {}, {
        getLeaderBoard : {
            url: base + '/leaders.json',
            method: 'GET',
            isArray: true
        },
        
        getGroups : {
            url: base + '/group.json',
            method: 'GET',
            isArray: true
        },
        
        getGroup : {
            url: base + '/group/:id.json',
            method: 'GET',
            isArray: true,
            params: {
                id: '@id'
            }
        },
        
        getSchools : {
            url: base + '/school.json',
            method: 'GET',
            isArray: true
        },
        
        getSchool : {
            url: base + '/school/:id.json',
            method: 'GET',
            isArray: true,
            params: {
                id: '@id'
            }
        }
    });
}]);

okHealthServices.factory('GroupApi', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/group.json';
    
    return $resource('', {}, {
        getAll : {
            url: base,
            method: 'GET',
            isArray: true
        }
    });
}]);


okHealthServices.factory('SchoolApi', ['$resource', function ($resource) {
    var base = ApiEndpoint + '/school.json';
    
    return $resource('', {}, {
        getAll : {
            url: base,
            method: 'GET',
            isArray: true
        }
    });
}]);