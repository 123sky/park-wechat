var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  ParkService = mongoose.model('ParkService'),
  File = mongoose.model('File');
module.exports = function (app) {
  app.use('/main/parkService', router);
};

router.get('/bike', function (req, res, next) {
  var sortObj = {
    created:'desc'
  };
  
  ParkService.findOne({type:'bike'})
    .populate('images')
    .exec(function (err, service) {
      if (err) return next(err);      
      res.render('main/ParkService/ParkService', {
        service: service,
        pageTitle:service.title,
        pretty: true
      });
    });
});

router.get('/parking', function (req, res, next) {
  var sortObj = {
    created:'desc'
  };
  
  ParkService.findOne({type:'parking'})
    .populate('images')
    .exec(function (err, service) {
      if (err) return next(err);      
      res.render('main/ParkService/ParkService', {
        service: service,
        pageTitle:service.title,
        pretty: true
      });
    });
});

router.get('/toilet', function (req, res, next) {
  var sortObj = {
    created:'desc'
  };
  
  ParkService.findOne({type:'toilet'})
    .populate('images')
    .exec(function (err, service) {
      if (err) return next(err);      
      res.render('main/ParkService/ParkService', {
        service: service,
        pageTitle:service.title,
        pretty: true
      });
    });
});
