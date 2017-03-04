var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var RouteRecommendSchema = new Schema({
    title: {type:String,required:true},
    content: {type:String,required:true},
    image: {type:String,required:true},
    published: {type:Boolean,deafault:true},
    recommend: {type:Boolean,deafault:false},
    favorite: {type: Number, deafault: 0},
    created: {type:Date}
});

mongoose.model('RouteRecommend', RouteRecommendSchema);