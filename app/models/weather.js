var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var WeatherSchema = new Schema({
    cityId: {type:String,required:true},
    cityName: {type:String,required:true},
    fl: {type:String,required:true},
    fx: {type:String,required:true},
    lastUpdate: {type:String,required:true},
    numfl: {type:String,required:true},
    numfx: {type:String,required:true},
    numtq: {type:String,required:true},
    qw: {type:String,required:true},
    sd: {type:String,required:true},
    tq: {type:String,required:true},
    created: {type:Date}
});

mongoose.model('Weather', WeatherSchema);