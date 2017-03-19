var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ScenicIntroductionSchema = new Schema({
    title: {type:String,required:true},
    info: {type:String,required:true},
    content: {type:String,required:true},
    published: {type:Boolean,deafault:true},
    recommend: {type:Boolean,deafault:false},
    favorite: {type:Number,deafault:0},
    created: {type:Date},
    coverImage: { type: Schema.Types.ObjectId, ref: 'File'},
    voice: { type: Schema.Types.ObjectId, ref: 'File' }
});

mongoose.model('ScenicIntroduction', ScenicIntroductionSchema);