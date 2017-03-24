var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var InformationSchema = new Schema({
    title: {type:String,required:true},
    info: {type:String,required:true},
    content: {type:String,required:true},
    coverImage: { type: Schema.Types.ObjectId, ref: 'File' },
    published: {type:Boolean,deafault:true},
    recommend: {type:Boolean,deafault:false},
    created: {type:Date}
});

mongoose.model('Information', InformationSchema);