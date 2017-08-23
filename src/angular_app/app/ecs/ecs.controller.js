angular.module('app').controller('ecsController', ['ecsService', function(service){

}])

.service('ecsService', ['$http', function($http){

    this.deploy = function(data) { return $http.post(API_BASE_URL + '/deploy', data )}

}])