angular.module('profile', [])


.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {


    $urlRouterProvider
        .when('/profile', '/profile/view')
        .when('/profile/', '/profile/view');


    $stateProvider

        .state('profile', {
            abstract: true,
            template: '<div ui-view></div>',
            url: '/profile',
            onEnter: checkAuthentication
        })

        .state('profile.view', {
            url: '/view',
            templateUrl: 'app/modules/profile/views/profile.html',
            controller: 'ProfileController',
            resolve: {
                profile: ['authService', function (service) {
                    return service.getProfile();
                }]
            }
        })
}])

.controller('ProfileController', ['$scope', 'profile', function($scope, profile){
    $scope.profile = profile;
}])
