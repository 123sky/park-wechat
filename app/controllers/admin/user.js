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
//权限校验
module.exports.requireLogin = function(req, res, next){
    if (req.user){
        next();
    }else {
      req.flash('error','登录用户才能使用')
      res.redirect('/admin/users/signin');  
    }
};

router.get('/', module.exports.requireLogin,function (req, res, next) {
  var sortby = req.query.sortby?req.query.sortby:"created";
  var sortdir = req.query.sortdir?req.query.sortdir:"desc";

  if(['username','created'].indexOf(sortby)=== -1){
    sortby = 'created';
  }
  if(['desc','asc'].indexOf(sortdir)=== -1){
    sortdir = 'desc';
  }

  var sortObj = {};
  sortObj[sortby] = sortdir;
  
  User.find()
    .sort(sortObj)
    .exec(function (err, users) {
      //console.log(users);
      if (err) return next(err);

      var pageNum = Math.abs(parseInt(req.query.page || 1,10));
      var pageSize = 1000;
      var totalCount = users.length;
      var pageCount = Math.ceil(totalCount / pageSize);

      if(pageNum>pageCount){
        pageNum = pageCount;
      }

      res.render('admin/users/index', {
        users: users.slice((pageNum-1)*pageSize,pageNum*pageSize),
        pageTitle:'用户列表',
        pageNum:pageNum,
        pageCount:pageCount,
        sortby:sortby,
        sortdir:sortdir,
        pretty: true
      });
    });
});
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

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/admin/users/signin');
});

router.get('/add',module.exports.requireLogin, function (req, res, next) {
  res.render('admin/users/add', {
    pretty: true,
    pageTitle:'添加用户',
    users: {}
  });
});

router.post('/add', module.exports.requireLogin, function (req, res, next) {
  var request = req.body;

  //后端校验
  req.checkBody('username', '景点名称不能为空').notEmpty();
  req.checkBody('password', '内容简介不能为空').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    return res.send({code:0,error:errors});
  }

    

        //保存文字信息
        var username = request.username.trim();
        var password = request.password;
        
        var users = new Users({
          username: username,
          password: password,         
        });
        users.save(function (err, users) {
          if (err) {
            console.log('文字信息添加失败:', err);
            return res.send({code:0,msg:'文字信息添加失败'});
          } else {
            console.log('文字信息添加成功');
            return res.send({code:1,msg:'文字信息添加成功'});

            res.redirect('/admin/users');
          }
        });
});