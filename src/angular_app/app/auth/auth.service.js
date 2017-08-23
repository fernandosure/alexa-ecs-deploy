angular.module('app').service('authService', ['$state', 'angularAuth0', '$timeout', function ($state, angularAuth0, $timeout) {

  var userProfile;

  function login() {
    angularAuth0.authorize();
  }

  function handleAuthentication() {
    angularAuth0.parseHash(function(err, authResult) {
      if (authResult && authResult.idToken) {
        setSession(authResult);
        $state.go('home');
      } else if (err) {
        $timeout(function() {
          $state.go('home');
        });
        console.log(err);
        alert('Error: ' + err.error + '. Check the console for further details.');
      }
    });
  }

  function getProfile() {

    var accessToken = localStorage.getItem('access_token');

    return new Promise(function(resolve, reject){

      if (!accessToken) {
        reject('Access token must exist to fetch profile')
      }

      if (getCachedProfile()){
          resolve(getCachedProfile())
      }

      angularAuth0.client.userInfo(accessToken, function(err, profile) {

        if (profile) {
            setUserProfile(profile);
        }

        if (profile)
          resolve(profile)
        else
          reject(err)
      })
    })
  }

  function setUserProfile(profile) {
    userProfile = profile;
  }

  function getCachedProfile() {
    return userProfile;
  }

  function setSession(authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());

    // If there is a value on the `scope` param from the authResult,
    // use it to set scopes in the session for the user. Otherwise
    // use the scopes as requested. If no scopes were requested,
    // set it to nothing
    var scopes = authResult.scope || REQUESTED_SCOPES || '';

    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    localStorage.setItem('scopes', JSON.stringify(scopes));
  }

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('scopes');
    $state.go('home');
  }

  function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  function userHasScopes(scopes) {
    var grantedScopes = JSON.parse(localStorage.getItem('scopes')).split(' ');
    for (var i = 0; i < scopes.length; i++) {
      if (grantedScopes.indexOf(scopes[i]) < 0) {
        return false;
      }
    }
    return true;
  }

  return {
    login: login,
    getProfile: getProfile,
    getCachedProfile: getCachedProfile,
    handleAuthentication: handleAuthentication,
    logout: logout,
    isAuthenticated: isAuthenticated,
    userHasScopes: userHasScopes
  }
}])
