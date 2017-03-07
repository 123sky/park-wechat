var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  fs = require('fs');
  path = require("path");
  ScenicIntroduction = mongoose.model('ScenicIntroduction'),
  File = mongoose.model('File');
module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.redirect('/admin/scenicIntroduction');
});

router.get('/admin', function (req, res, next) {
  res.redirect('/admin/scenicIntroduction');
});
