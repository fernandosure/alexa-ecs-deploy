var supertest = require('supertest');
var should = require('should');
var globals = require('./tests_globals');

var api = supertest.agent(globals.host + '/v1/insurers/' + globals.insurer.slug);


describe("Insurer Authorizations", function() {
	
	it ('it should return authorization required', function(done){
		api
		.get('/authorizations/1')
		.expect(401)		
		.end(function(err,res){
			//console.log(res.body);
			res.body.code.should.equal('no_user_info')
			done()
		})
	})


	it ('it should return unauthorized', function(done){
		api
		.get('/authorizations/1')
		.auth(globals.insurer.key,'')
		.expect(404)		
		.end(function(err,res){
			//console.log(res.body);
			res.body.code.should.equal('no_data_found')
			done()
		})
	})


	it ('post must fail because missing fields', function(done){
		api
		.post('/authorizations',
			{			    
			    "authorization_date": "2015-08-05T08:40:51.620Z",
			    "expires_at": "2015-09-05T08:40:51.620Z",
			    "policy" : {
			        "country_code": "US",
			        "number": "55222",
			        "certificate": "0000011255",
			        "expiration_date":"2016-08-05T08:40:51.620Z",
			        "policy_holder": {
			            "id": "022165654654654",
			            "name": "William Smith",
			            "email": "william.smith@gmail.com",
			            "cellphone": "(734) 555-1212"
			        }
			    }
			    // "items": [
			    //         {
			    //             "product_id": "P101",
			    //             "quantity": 1,
			    //             "copay_percentage": 20
			    //         },{
			    //             "product_id": "P100",
			    //             "quantity": 5,
			    //             "copay_percentage": 20
			    //         }
			    //     ]
			}
		)
		.auth(globals.insurer.key,'')
		.expect(404)		
		.end(function(err,res){
			//console.log(res.body);
			res.body.code.should.equal('object_expected')
			done()
		})
	})


	it('it should return not found', function(done){
		api
		.get('/authorizations/1')
		.auth(globals.insurer.key,'')
		.expect(404)		
		.end(function(err,res){
			//console.log(res.body);
			res.body.code.should.equal('no_data_found')
			done()
		})
	})

});