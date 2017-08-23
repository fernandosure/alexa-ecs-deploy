var express = require('express');
var logger = require('morgan');
var path = require('path');
var app = express();

var dotenv = require('dotenv');
dotenv.load();

app.set('views', path.join(__dirname, 'angular_app', 'views'));
app.set('view engine', 'ejs');

app.use(logger());
app.use('/api'  , require('./api'));
app.use('/'     , require('./angular_app'));


console.log('************************************************');
console.log('Deploy ECS Apps With Alexa Server');
console.log('************************************************');
console.log('');
console.log('- Listening on localhost port 3000');

app.listen(process.env.PORT || 3000);
