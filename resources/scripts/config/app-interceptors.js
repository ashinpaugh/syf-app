okHealthServices.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}]);

/**
 * Responsible for processing and passing the X-AUTH-TOKEN
 * back and forth between API calls.
 */
okHealthServices.factory('httpInterceptor', function (TokenHandler) {
    var CorsAuthHeader = 'Authorization';
    
    return {
        request : function (config) {
            if (!TokenHandler.get()) {
                return config;
            }
            
            config.headers[CorsAuthHeader] = TokenHandler.getFull();
            
            return config;
        },
        response : function (response) {
            if (!response.headers(CorsAuthHeader)) {
                return response;
            }
            
            TokenHandler.set(response.headers(CorsAuthHeader));
            
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