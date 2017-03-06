var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ParkServiceSchema = new Schema({
  	title: {type:String,required:true},
  	info: {type:String,required:true},
    content: {type:String,required:true},
    image: {type:String,required:true},
    published: {type:Boolean,deafault:true},
    recommend: {type:Boolean,deafault:false},
    created: {type:Date}
});

mongoose.model('ParkService', ParkServiceSchema);

