var supertest = require('supertest');
var should = require('should');
var globals = require('./tests_globals');

var api = supertest.agent(globals.host + '/v1/insurers/' + globals.insurer.slug);
var api_without_ssl = supertest.agent(globals.host.replace('https','http') + '/v1/insurers/' + globals.insurer.slug);


describe("API General tests", function() {

	
	it ('it should return https required', function(done){
		api_without_ssl
		.get('/authorizations/1')
		.auth(globals.insurer.key,'')
		.expect(403)		
		.end(function(err,res){
			//console.log(res.body);
			res.body.code.should.equal('https_required')
			done()
		})
	});


});