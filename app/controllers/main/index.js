var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');
module.exports = function (app) {
  app.use('/main', router);
};

router.get('/', function (req, res, next) {
  res.render('main/index', {
    pretty: true,
    pageTitle: "智慧导览"
  });
});