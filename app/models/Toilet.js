var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ToiletSchema = new Schema({
  	tilte: {type:String,required:true},
    content: {type:String,required:true},
    image: {type:String,required:true},
    published: {type:Boolean,deafault:true},
    created: {type:Date}
});

mongoose.model('Toilet', ToiletSchema);

