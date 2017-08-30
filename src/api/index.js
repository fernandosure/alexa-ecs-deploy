var express         = require('express');
var bodyParser      = require('body-parser');
var Error 		    = require('../error');
var morgan		    = require('morgan');
var jwt             = require('express-jwt');
var jwks            = require('jwks-rsa');
var jwtAuthz        = require('express-jwt-authz');
var bearerToken     = require('express-bearer-token');
var alexa           = require("alexa-app");
var cors            = require('cors');
var util            = require('util');
var db              = require('./db');
var router          = express.Router();
var alexaApp        = new alexa.app("ecs-deploy");


var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://alexa-ecs-deploy.auth0.com/.well-known/jwks.json",
    }),
    audience: 'http://alexa-ecs-deploy',
    issuer: "https://alexa-ecs-deploy.auth0.com/",
    algorithms: ['RS256']
});


router.use(cors())
router.use(morgan('combined'))


// setup the alexa app and attach it to express before anything else
alexaApp.express({
    router: router,
    // verifies requests come from amazon alexa. Must be enabled for production.
    // You can disable this if you're running a dev environment and want to POST
    // things to test behavior. enabled by default.
    checkCert: false,

    // sets up a GET route when set to true. This is handy for testing in
    // development, but not recommended for production. disabled by default
    debug: false
});

alexaApp.launch(function(request, response) {
    response.say("You launched the app!");
});

alexaApp.intent("DeployIntent",
    {
        "slots": {
            "Service": "Service",
            "Environment": "Environment"
        }
    },
    function(request, response) {
        var service = request.slot("Service");
        var environment = request.slot("Environment");

        var message = util.format('Deploying %s to %s',service,environment)
        console.log(message);
        response.say(message);
    }
);


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
// router.use(bodyParser.json({
//     verify: function getRawBody(req, res, buf) {
//         req.rawBody = buf.toString();
//     }
// }));
router.use(bearerToken());
// router.use(jwtCheck);





//
//
// requestVerifier = function (req, res, next) {
//     alexaVerifier(
//         req.headers.signaturecertchainurl,
//         req.headers.signature,
//         req.rawBody,
//         function verificationCallback(err) {
//             if (err) {
//                 res.status(401).json({ message: 'Verification Failure', error: err });
//             } else {
//                 next();
//             }
//         }
//     );
// };


router.get('/credentials', jwtAuthz(['read:credentials']), function(req, res) {
    db.AWSCredentials.findOne({'user_id': req.user.sub}, function(err, data){
        if (!data)
            data = {
                aws_access_key_id: '',
                aws_secret_access_key: '',
                aws_default_region:''
            }
        res.json(data._doc);
    });
});

router.post('/credentials', jwtAuthz(['write:credentials']), function(req, res) {
    db.AWSCredentials.findOneAndUpdate({'user_id': req.user.sub}, {
        $set: {
            user_id: req.user.sub,
            aws_access_key_id : req.body.aws_access_key_id,
            aws_secret_access_key: req.body.aws_secret_access_key,
            aws_default_region: req.body.aws_default_region
        }
    },{upsert:true}, function(err, data){
        res.json(data);
    })
});
//
// router.post('/deploy', jwtAuthz(['ecs:deploy']), requestVerifier, function(req, res) {
//     if (req.body.request.type === 'LaunchRequest') {
//         res.json({
//             "version": "1.0",
//             "response": {
//                 "shouldEndSession": true,
//                 "outputSpeech": {
//                     "type": "SSML",
//                     "ssml": "<speak>Hmm <break time=\"1s\"/> What service do you want me to deploy to ecs?</speak>"
//                 }
//             }
//         })
//     }
//     else if (req.body.request.type === 'SessionEndedRequest') {
//         // Per the documentation, we do NOT send ANY response... I know, awkward.
//         console.log('Session ended', req.body.request.reason);
//     }
//     else if (req.body.request.type === 'IntentRequest' &&
//         req.body.request.intent.name === 'DeployIntent') {
//
//         if (!req.body.request.intent.slots.Service ||
//             !req.body.request.intent.slots.Service.value) {
//             // Handle this error by producing a response like:
//             // "Hmm, what day do you want to know the forecast for?"
//         }
//
//         var service = req.body.request.intent.slots.Service.value;
//         var
//
//         // Do your business logic to get weather data here!
//         // Then send a JSON response...
//
//         res.json({
//             "version": "1.0",
//             "response": {
//                 "shouldEndSession": true,
//                 "outputSpeech": {
//                     "type": "SSML",
//                     "ssml": "<speak>Looks like a great day!</speak>"
//                 }
//             }
//         });
// });


//Global Error Handling
router.use(function(err, req, res, next){
    console.log(err)

    if (err instanceof SyntaxError)
        res.status(400).send(new Error("json_object_expected", "Bad request, the request body should be a JSON object"));

    if (err.name === 'UnauthorizedError') {
        res.status(401).send(err);
    }
    next()
})

module.exports = router;
