var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var FileSchema = new Schema({
    destination: {type:String,required:true},
    encoding: {type:String,required:true},
    fieldname: {type:String,required:true},
    filename: {type:String,required:true},
    mimetype: {type:String,required:true},
    originalname: {type:String,required:true},
    path: {type:String,required:true},
    size: {type:Number,required:true,max:10485170,min:0},
    created: {type:Date}
});

mongoose.model('File', FileSchema);