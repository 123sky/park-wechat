var mongoose = require('mongoose'),
  	Schema = mongoose.Schema;
var md5 = require('md5');

var UserSchema = new Schema({
    username: {type:String,required:true},
    password: {type:String,required:true},
    created: {type:Date}
});

UserSchema.methods.validPassword = function(password){
	var isMatch =  md5(password) === this.password;
	console.log('UserSchema.methods.validPassword:', password, this.password, isMatch);

	return isMatch;
}

mongoose.model('User', UserSchema);