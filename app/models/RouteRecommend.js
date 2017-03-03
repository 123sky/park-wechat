var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var RouteRecommendSchema = new Schema({
    tilte: {type:String,required:true},
    content: {type:String,required:true},
    image: {type:String,required:true},
    published: {type:Boolean,deafault:true},
    comments: [{type:Schema.Types.Mixed}],
    created: {type:Date}
});

mongoose.model('RouteRecommend', RouteRecommendSchema);