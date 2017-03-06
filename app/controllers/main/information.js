var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Information = mongoose.model('Information'),
  File = mongoose.model('File');
module.exports = function (app) {
  app.use('/main/information', router);
};

router.get('/', function (req, res, next) {
  var sortObj = {
  	created:'desc'
  };
  
  Information.find()
    .populate('images')
    .exec(function (err, infos) {
      if (err) 
      	return next(err);      
      res.render('main/information/list', {
        infos: infos,
        pageTitle:'信息服务',
        pretty: true
      });
    });
});

router.get('/:id',function (req, res, next){

	Information.findById(req.params.id)
    .populate('images')
    .exec(function (err, info) {
	    if (err) 
	        return next(err);
	    res.render('main/information/view', {
	      	info: info,
	        pageTitle: info.title,
	        pretty: true
	     });
    });

});
