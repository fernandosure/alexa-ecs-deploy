function checkAuthentication($transition$) {
    var $state = $transition$.router.stateService;
    var auth = $transition$.injector().get('authService');
    if (!auth.isAuthenticated()) {
        return $state.target('home');
    }
}

function checkForScopes(scopes) {
    return function checkAuthentication($transition$) {
        var $state = $transition$.router.stateService;
        var auth = $transition$.injector().get('authService');
        if (!auth.isAuthenticated() || !auth.userHasScopes(scopes)) {
            return $state.target('home');
        }
    }
}