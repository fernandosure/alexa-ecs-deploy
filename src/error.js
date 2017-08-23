var Error = function(code, message, errors){

	if((message === undefined) && (errors === undefined)){
		err = code;

		this.code ='validation_error',
		this.message = 'There was a validation issue with your request see [errors] for more info'
	}
	else{
		this.code 		= code;
		this.message 	= message;
		this.errors 	= errors;	
	}
	
}


Error.prototype = {
}

Error.prototype.setCode = function(code) {
	this.code = code;
};

Error.prototype.setMessage = function(message) {
	this.message = message;
};

Error.prototype.setErrors = function(errors) {
	this.errors = new Array();
	this.errors.push(errors);
};

Error.prototype.getCode = function() {
	return this.code;
};

Error.prototype.getMessage = function() {
	return this.message;
};

Error.prototype.getErrors = function() {
	return this.errors;
};


module.exports = Error;