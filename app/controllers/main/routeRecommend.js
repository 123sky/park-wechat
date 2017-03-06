var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  RouteRecommend = mongoose.model('RouteRecommend'),
  File = mongoose.model('File');
module.exports = function (app) {
  app.use('/main/routeRecommend', router);
};

router.get('/', function (req, res, next) {
  var sortObj = {
    created:'desc'
  };
  
  RouteRecommend.find()
    .sort(sortObj)
    .populate('images')
    .exec(function (err, routes) {
      if (err) return next(err);

      res.render('main/routeRecommend/list', {
        routes: routes,
        pageTitle:'路线推荐列表',
        pretty: true
      });
    });
});

router.get('/:id',function (req, res, next){

  RouteRecommend.findById(req.params.id)
    .populate('images')
    .exec(function (err, route) {
      if (err) 
        return next(err);
      res.render('main/routeRecommend/view', {
        route: route,
        pageTitle: route.title,
        pretty: true
      });
    });

});