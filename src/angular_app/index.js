var express = require('express');
var router = express.Router();
var path = require('path');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));

// serve static files
router.use('/assets', express.static(path.join(__dirname, 'assets')));
router.use('/app', express.static(path.join(__dirname, 'app')));

// serve the config file for the angular app
router.get('/app/configs.js', function(req,res){
    var vars = {
        AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
        AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
        AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
        REQUESTED_SCOPES: process.env.REQUESTED_SCOPES,
        AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL,
        API_BASE_URL: process.env.API_BASE_URL
    };
    res.set('Content-Type', 'application/javascript');
    res.render('angular_configs.ejs', vars)
})

// serve everything else
router.get('/*', function(req, res) {
    res.render('index');
});


module.exports = router;
