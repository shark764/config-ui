angular.module('liveopsConfigPanel')
    .directive('pwCheck', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = scope.user.password;
                console.log(firstPassword, elem.val());
                elem.add(firstPassword).on('blur', function () {
                    scope.$apply(function () {
                    var v = scope.user.confirmPassword===scope.user.password;
                    ctrl.$setValidity('required', v);
                });
            });
        }
    }
}]);