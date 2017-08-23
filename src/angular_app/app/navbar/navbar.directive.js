angular.module('app').directive('navbar', function(){

    return {
        templateUrl: 'app/navbar/navbar.html',
        controller: ['authService', function(authService){
          var vm = this;
          vm.auth = authService;
        }],
        controllerAs: 'vm'
    }

})
