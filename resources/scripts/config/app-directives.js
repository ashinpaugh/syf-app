okHealthApp.directive('appNav', function () {
    return {
        'restrict'    : 'E',
        'templateUrl' : 'partials/components/AppNav.html'
    };
});

okHealthApp.directive('overlay', function () {
    return {
        'restrict'    : 'E',
        'templateUrl' : 'partials/components/Overlay.html'
    };
});

okHealthApp.directive('appNavTop', function () {
    return {
        'restrict'    : 'E',
        'templateUrl' : 'partials/components/TopNav.html'
    };
});

okHealthApp.directive('pagination', function () {
    return {
        'restrict'    : 'E',
        'templateUrl' : 'partials/components/Pagination.html'
    };
});

okHealthApp.directive('loader', function () {
    return {
        'restrict'    : 'E',
        'templateUrl' : 'partials/components/Loader.html'
    };
});
