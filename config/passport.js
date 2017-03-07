var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
    User = mongoose.model('User');

//在要求Passport验证请求之前，必须配置应用程序使用的策略（或策略）。
module.exports.init = function(){
    console.log('passport.local.init');
    passport.use(new LocalStrategy({ 
        usernameField:'username', 
        passwordField: 'password'
    },function(username, password, done) {
        console.log('passport.local.find:',username);
        User.findOne({ username: username }, function (err, user) {
            console.log('passport.local.find',user, err);
            if (err) { 
                return done(err); 
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }));

    passport.serializeUser(function(user, done) {
        console.log('passport.local.serializeUser:',user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        console.log('passport.local.deserializeUser:', id);
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};