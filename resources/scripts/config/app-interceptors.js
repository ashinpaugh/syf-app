okHealthServices.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}]);

/**
 * Responsible for processing and passing the X-AUTH-TOKEN
 * back and forth between API calls.
 */
okHealthServices.factory('httpInterceptor', function (TokenHandler) {
    return {
        request : function (config) {
            if (!TokenHandler.get()) {
                return config;
            }
            
            config.headers['X-AUTH-TOKEN'] = TokenHandler.get();
            
            return config;
        },
        response : function (response) {
            if (!response.headers('X-AUTH-TOKEN')) {
                return response;
            }
            
            TokenHandler.set(response.headers('X-AUTH-TOKEN'));
            
            return response;
        },
        responseError : function (response)
        {
            if (console) {
                console.log('response error');
                console.log(response);
                console.log(response.headers());
            }
            
            return response;
        }
    };
});