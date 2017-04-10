var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  fs = require('fs');
  path = require("path");
  Information = mongoose.model('Information'),
  ParkService = mongoose.model('ParkService'),
  RouteRecommend = mongoose.model('RouteRecommend'),
  ScenicIntroduction = mongoose.model('ScenicIntroduction'),  
  File = mongoose.model('File');
  user = require('./user');
module.exports = function (app) {
  app.use('/admin/resourcesLibrary', router);
};

/*弹窗中选择图片*/
router.get('/imageLibraryInDialog', user.requireLogin, function (req, res, next) {
  var sortObj = {created:'desc'};
  File.find({fieldname:'imageFile'})
    .sort(sortObj)
    .exec(function (err, images) {
      if (err) 
        return next(err);      
      res.render('admin/resourcesLibrary/imageLibraryInDialog', {
        images: images,
        pageTitle:'图片素材库',
        pretty: true
      });
    });
});

/*图片管理界面*/
router.get('/imageLibrary', user.requireLogin, function (req, res, next) {
  var sortObj = {created:'desc'};
  File.find({fieldname:'imageFile'})
    .sort(sortObj)
    .exec(function (err, images) {
      if (err) 
        return next(err);      
      res.render('admin/resourcesLibrary/imageLibrary', {
        images: images,
        pageTitle:'图片素材库',
        pretty: true
      });
    });
});

/*弹窗中选择音频*/
router.get('/voiceLibraryInDialog', user.requireLogin, function (req, res, next) {
  var sortObj = {created:'desc'};
  File.find({fieldname:'voiceFile'})
    .sort(sortObj)
    .exec(function (err, voices) {
      if (err) 
        return next(err); 

      var pageNum = Math.abs(parseInt(req.query.page || 1,10));
      var pageSize = 1000;
      var totalCount = voices.length;
      var pageCount = Math.ceil(totalCount / pageSize);

      if(pageNum>pageCount){
        pageNum = pageCount;
      }

      res.render('admin/resourcesLibrary/voiceLibraryInDialog', {
        voices: voices,
        pageTitle:'音频素材库',
        pageNum:pageNum,
        pageCount:pageCount,
        sortby:'created',
        sortdir:'desc',
        pretty: true
      });
    });
});

/*音频管理界面*/
router.get('/voiceLibrary', user.requireLogin, function (req, res, next) {

  var sortObj = {created:'desc'};
  File.find({fieldname:'voiceFile'})
    .sort(sortObj)
    .exec(function (err, voices) {
      if (err) 
        return next(err); 

      var pageNum = Math.abs(parseInt(req.query.page || 1,10));
      var pageSize = 1000;
      var totalCount = voices.length;
      var pageCount = Math.ceil(totalCount / pageSize);

      if(pageNum>pageCount){
        pageNum = pageCount;
      }

      res.render('admin/resourcesLibrary/voiceLibrary', {
        voices: voices,
        pageTitle:'音频素材库',
        pageNum:pageNum,
        pageCount:pageCount,
        sortby:'created',
        sortdir:'desc',
        pretty: true
      });
    });
});

/*添加文件*/
router.post('/add', user.requireLogin, function (req, res, next){
  var request = req.body;
  if(request.length === 0){
    return res.send({code:2,msg:"文件数组为空"});
  }

  for(var index in request){
    request[index].created = new Date();
    request[index].quote = [];
  }

  //保存文件信息
  File.insertMany(request, (err, fileArray)=>{
    console.log(fileArray);
    if (err) {
      console.log('文件信息添加失败:', err);
      return res.send({code:0,msg:'文件信息添加失败'});
    } else {
      console.log('文件信息添加成功');
      return res.send({code:1,msg:'文件信息添加成功'});
    }
  })
});

/*修改文件*/
router.post('/edit', user.requireLogin, function (req, res, next){
  var request = req.body;
  if(request.length === 0){
      return res.send({code:2,msg:"文件数组为空"});
  }
  //保存文件信息
  File.insertMany(request, (err, fileArray)=>{
    if (err) {
      console.log('文件信息添加失败:', err);
      return res.send({code:0,msg:'文件信息添加失败'});
    } else {
      console.log('文件信息添加成功');
      return res.send({code:1,msg:'文件信息添加成功'});
    }
  })
});

/*删除文件*/
router.get('/delete/:id', user.requireLogin, function (req, res, next){
  if(!req.params.id){
    return next(new Error('删除ID不存在'))
  }
  var conditions = {
    _id:new mongoose.Types.ObjectId(req.params.id)
  };
  File.find(conditions).exec(function(err, file){
    console.log(file.length);   
    console.log(file[0]);
    console.log(file[0].fieldname);
    if(err){
      return next(error);
    }else
      if(file[0].quote.length === 0){
        File.remove(conditions).exec(function (err, rowsRemoved){
         if (err) {
            return next(err);
          }

          if (rowsRemoved) {
            console.log('删除成功');      
          } 
          else {
            console.log('删除失败');
          }
          if(file[0].fieldname === "imageFile"){         
            res.redirect('/admin/resourcesLibrary/imageLibrary');
          }
          else{
            res.redirect('/admin/resourcesLibrary/voiceLibrary');
          }
        });        
      }else
        if(file[0].fieldname === "imageFile"){         
          req.flash('error','图片已被引用，无法进行该操作')
          res.redirect('/admin/resourcesLibrary/imageLibrary');
        }else{
          req.flash('error','语音已被引用，无法进行该操作')
          res.redirect('/admin/resourcesLibrary/voiceLibrary');
        }
  })
});
