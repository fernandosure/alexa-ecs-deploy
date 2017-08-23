var mongoose = require('mongoose');

// Connect to MongoDB
mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true }).then(function() {
    // if all is ok we will be here
    console.log('MongoDB Connected');
})
.catch(function(err) { // if error we will be here
    console.error('MongoDB connection error:', err.stack);
    process.exit(1);
});


// Create a schema
var AWSCredentialsSchema = new mongoose.Schema({
    user_id: String,
    aws_access_key_id: String,
    aws_secret_access_key: String,
    aws_default_region: String
},{
    collection: 'aws_credentials'
});

module.exports = {
    AWSCredentials : mongoose.model('AWSCredentials', AWSCredentialsSchema)
}