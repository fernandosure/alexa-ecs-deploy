var ErrorItem = function(error, message){
	if(message === undefined){
		error.keyPath = error.keyPath.toString().replace('_type', 'type');
		this.path = error.keyPath.toString().replace(/,/g, '.');
		this.message = this.path + ' ' + error.message.toLowerCase();

		if(error.validator == 'required')
			this.message = this.message.replace('key ','');
		
		if(error.validator =='type')
			this.message = this.message.replace('is not','must be');

		if(error.validator ==='unknownKeys')
			this.message = this.message.replace('unknown key.','not known')
	}
	else{
		this.path = error;
		this.message = message;
	}	
}


ErrorItem.prototype = {
}

ErrorItem.prototype.setPath = function(path) {
	this.path = path;
};

ErrorItem.prototype.setMessage = function(message) {
	this.message = message;
};

ErrorItem.prototype.getPath = function() {
	return this.path;
};

ErrorItem.prototype.getMessage = function() {
	return this.message;
};

module.exports = ErrorItem;
