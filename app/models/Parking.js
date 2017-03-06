var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ParkingSchema = new Schema({
  	title: {type:String,required:true},
  	info: {type:String,required:true},
    content: {type:String,required:true},
    images: [{ type: Schema.Types.ObjectId, ref: 'File' }],
    published: {type:Boolean,deafault:true},
    created: {type:Date}
});

mongoose.model('Parking', ParkingSchema);

