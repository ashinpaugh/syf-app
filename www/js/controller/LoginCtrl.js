/**
 *
 */

okHealthControllers.controller('LoginCtrl', ['$scope', '$location', 'Account', function ($scope, $location, User) {
    //$scope.user      = {username: '', password: '', password2: '', dob: 0, height: null, weight: 0};
    $scope.user      = {};
    $scope.show_pass = false;
    $scope.page      = 1;
    $scope.pword_focused = false;
    //$scope.watchman_set  = false;
    
    /**
     * Perform user sign-in.
     */
    $scope.doLogin = function ()
    {
        User.login({
            username: $scope.credentials.username,
            password: $scope.credentials.password
        }, function (data, headers) {
            $location.url('/dashboard');
        });
    };

    /**
     * Register a user.
     */
    $scope.doRegistration = function ()
    {
        if (!validateProperties()) {
            return;
        }
        
        User.register($scope.user, function (data, headers) {
            console.log([data, headers]);
        })
    };
    
    function validateProperties()
    {
        var u = $scope.user;
        
        if (!u.hasOwnProperty('password')) {
            alert('Invalid password.');
            return false;
        }
        
        if (!$scope.show_pass) {
            if (!u.hasOwnProperty('password2')) {
                alert("Please enter re-enter your password.");
                $('#password2').focus();
                return false;
            }
            
            if (u.password != u.password2) {
                alert("The passwords you provided did not match.");
                $('#password, #password2').val('');
                $('#password').focus();
                return false;
            }
        }
        
        return $('.registration').filter('.ng-invalid').length == 0;
    }
    
    angular.element(document).ready(function () {
        SYF.Page.SetSubtitle('Login');
        SYF.Resources.Load([
            'css/login.css'
        ]);
    });
    
    $scope.$on('$destroy', function () {
        
    });
}]);