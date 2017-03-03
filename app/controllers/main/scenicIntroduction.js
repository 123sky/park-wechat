var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  ScenicIntroduction = mongoose.model('ScenicIntroduction');
module.exports = function (app) {
    app.use('/main/scenicIntroduction', router);
};

router.get('/', function (req, res, next) {
    ScenicIntroduction.find()
    .sort({'created':'desc'})
    .populate('images')
    .populate('voices')
    .exec(function (err, scenics) {
        if (err) 
            return next(err);
      res.render('main/scenicIntroduction/list', {
        scenics: scenics,
        pageTitle: "景点推荐",
        pretty: true
      });
    });
});

router.get('/:id', function (req, res, next) {
    ScenicIntroduction.findById(req.params.id)
    .populate('images')
    .populate('voices')
    .exec(function (err, scenic) {
        if (err) 
            return next(err);
      res.render('main/scenicIntroduction/view', {
        scenic: scenic,
        pageTitle: scenic.title,
        pretty: true
      });
    });
});