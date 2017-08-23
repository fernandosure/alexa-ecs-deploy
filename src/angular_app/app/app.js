var app = angular.module('app',
    [
        'auth0.auth0',
        'angular-jwt',
        'ui.router',

        // project specific modules
        'profile'
    ])

    .config([
                '$stateProvider'        ,
                '$locationProvider'     ,
                '$urlRouterProvider'    ,
                '$httpProvider'         ,
                'angularAuth0Provider'  ,
                'jwtOptionsProvider'    ,

        function config(
              $stateProvider,
              $locationProvider,
              $urlRouterProvider,
              $httpProvider,
              angularAuth0Provider,
              jwtOptionsProvider) {

                $stateProvider
                  .state('home', {
                    url: '/',
                    controller: 'HomeController',
                    templateUrl: 'app/home/home.html',
                  })
                  .state('awsconfigs', {
                    url: '/awsconfigs',
                    controller: 'AWSConfigController',
                    templateUrl: 'app/awsconfig/awsconfig.html',
                    onEnter: checkAuthentication
                  })
                  .state('ecs', {
                    url: '/ecs',
                    controller: 'ecsController',
                    templateUrl: 'app/ecs/ecs.html',
                    onEnter: checkForScopes(['ecs:deploy'])
                  })
                  .state('callback', {
                    url: '/callback',
                    controller: 'CallbackController',
                    templateUrl: 'app/callback/callback.html',
                  });

                // Initialization for the angular-auth0 library
                angularAuth0Provider.init({
                  clientID: AUTH0_CLIENT_ID,
                  domain: AUTH0_DOMAIN,
                  responseType: 'token id_token',
                  audience: AUTH0_AUDIENCE,
                  redirectUri: AUTH0_CALLBACK_URL,
                  scope: REQUESTED_SCOPES
                });

                jwtOptionsProvider.config({
                  tokenGetter: function() {
                    return localStorage.getItem('access_token');
                  },
                  whiteListedDomains: ['localhost']
                });

                $httpProvider.interceptors.push('jwtInterceptor');

                $urlRouterProvider.otherwise('/');

                $locationProvider.hashPrefix('');

                // Comment out the line below to run the app
                // without HTML5 mode (will use hashes in routes)
                $locationProvider.html5Mode(true);


    }])

    .run(['authService', function (authService) {
        // Handle the authentication
        // result in the hash
        authService.handleAuthentication();
    }])

