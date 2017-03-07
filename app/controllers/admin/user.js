var express = require('express'),
    passport = require('passport');
    router = express.Router(),
    mongoose = require('mongoose'),
    fs = require('fs');
    path = require("path");
    User = mongoose.model('User'),
    File = mongoose.model('File');
module.exports = function (app) {
    app.use('/admin/users', router);
};

router.get('/signin', function (req, res, next) {

    res.render('admin/users/signin', {
    pageTitle:'请登录',
    pretty: true
    });
});

router.post('/signin', passport.authenticate('local',{
    successRedirect: '/admin/scenicIntroduction',
    failureRedirect: '/admin/users/signin'
    }) ,function (req, res, next) {

    console.log('user sign in success:');
     


});
