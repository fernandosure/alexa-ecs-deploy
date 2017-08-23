angular.module('app')


.controller('AWSConfigController', ['$http', '$scope', 'AWSConfigService', 'authService', function ($http, $scope, service, authService) {
    var vm = this;
    vm.auth = authService;


    service.getAWSConfigs().then(function(res){
        console.log(res.data);
        $scope.awsconfigs = res.data;
    })


    $scope.saveConfigs = function() {
    $scope.message = '';

    console.log($scope.awsconfigs);
    service.saveAWSConfigs($scope.awsconfigs)
        .then(function(result) {
            console.log(result);
            // $scope.message = result.data.message;
        }, function(error) {
            console.log(error);
            // $scope.message = error.data;
        })
    }
}])


.service('AWSConfigService', ['$http', function($http){

  this.getAWSConfigs = function() { return $http.get(API_BASE_URL + '/credentials')}
  this.saveAWSConfigs = function(data) { return $http.post(API_BASE_URL + '/credentials', data )}

}])