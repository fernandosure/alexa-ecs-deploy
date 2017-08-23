
// var getUserInfo = function (req, res, next){
//
//     if (req && req.hasOwnProperty('token')){
//         var request = require('request');
//
//         var options = {
//             url: 'https://alexa-ecs-deploy.auth0.com/userinfo',
//             headers: {
//                 'Accept': 'application/json',
//                 'Accept-Charset': 'utf-8',
//                 'Authorization': 'Bearer ' + req.token
//             }
//         }
//
//         request.get(options, function (error, response, body) {
//             // console.log('error:', error); // Print the error if one occurred
//             // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//             // console.log('body:', body); // Print the HTML for the Google homepage.
//             req.userInfo = body;
//         })
//     }
//     return next();
// };
