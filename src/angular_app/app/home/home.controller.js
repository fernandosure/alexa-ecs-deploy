angular.module('app').controller('HomeController', ['$scope', 'authService', function($scope, authService){

    $scope.auth = authService;

}]);
