var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  fs = require('fs');
  path = require("path");
  ScenicIntroduction = mongoose.model('ScenicIntroduction'),
  File = mongoose.model('File');
  user = require('./user');

module.exports = function (app) {
  app.use('/admin/scenicIntroduction', router);
};

router.get('/', user.requireLogin,function (req, res, next) {
  var sortby = req.query.sortby?req.query.sortby:"created";
  var sortdir = req.query.sortdir?req.query.sortdir:"desc";

  if(['title','created','published','favorite','recommend'].indexOf(sortby)=== -1){
    sortby = 'created';
  }
  if(['desc','asc'].indexOf(sortdir)=== -1){
    sortdir = 'desc';
  }

  var sortObj = {};
  sortObj[sortby] = sortdir;
  
  ScenicIntroduction.find()
    .sort(sortObj)
    .populate('coverImage')
    .populate('voices')
    .exec(function (err, scenics) {
      //console.log(scenics);
      if (err) return next(err);

      var pageNum = Math.abs(parseInt(req.query.page || 1,10));
      var pageSize = 1000;
      var totalCount = scenics.length;
      var pageCount = Math.ceil(totalCount / pageSize);

      if(pageNum>pageCount){
        pageNum = pageCount;
      }

      res.render('admin/scenicIntroduction/index', {
        scenics: scenics.slice((pageNum-1)*pageSize,pageNum*pageSize),
        pageTitle:'景点列表',
        pageNum:pageNum,
        pageCount:pageCount,
        sortby:sortby,
        sortdir:sortdir,
        pretty: true
      });
    });
});

router.get('/view',user.requireLogin,function(req,res,next){

})

router.get('/add',user.requireLogin, function (req, res, next) {
  res.render('admin/scenicIntroduction/add', {
    pretty: true,
    pageTitle:'添加景点',
    scenicIntroduction: {}
  });
});

router.post('/add', user.requireLogin, function (req, res, next) {
  var request = req.body;

  //后端校验
  req.checkBody('title', '景点名称不能为空').notEmpty();
  req.checkBody('content', '内容不能为空').notEmpty();
  req.checkBody('info', '简介不能为空').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    return res.send({code:0,error:errors});
  }

  var title = request.title.trim();
  var content = request.content;
  var info = request.info;
  var coverImage = request.coverImageId;
  var voice = request.voice;
  //var favorite = request.favorite;
  var published = request.published;

  //添加新的景点
  var scenicIntroduction = new ScenicIntroduction({
    title: title,
    info: info,
    content: content,
    published: published,
    //favorite: favorite,
    created: new Date(),
    coverImage:coverImage,
    voice:voice
  });
  scenicIntroduction.save(function (err, scenicIntroduction) {
    if (err) {
      console.log('文字信息添加失败:', err);
      return res.send({code:0,msg:'文字信息添加失败'});
    } else {

      console.log('文字信息添加成功');

      //在文件信息中被引用的图片，标记好被谁引用
      File.findByIdAndUpdate(coverImage,{$addToSet:{quote:scenicIntroduction._id}},function(err,newFile){
        if(err){
          return res.send({code:0,error:"图片增加关联关系失败"})
        }
        console.log('图片增加关联关系成功');
        return res.send({code:1});
      }); 
    }
  });
      
});

router.post('/delFile', user.requireLogin,function (req, res, next) {
  var filePath = req.body.path;

  //移除服务器路径下文件
  fs.unlink(filePath, function(err){
    if(err){
      console.log(err) ;
      return res.send({code:0,error:err});
    }else{
      console.log('文件删除成功') ;
      return res.send({code:1});
    }
  }) ;
});

router.get('/edit/:id', user.requireLogin, function (req, res, next) {
  if (!req.params.id) {
    return next(new Error('删除id不存在'));
  }

  var obj = {
    _id: new mongoose.Types.ObjectId(req.params.id)
  }

  ScenicIntroduction.find(obj)
    .populate('coverImage')
    .populate('voice')
    .exec(function (err, scenics) {
      console.log(scenics);
      if (err) 
        return next(err);
      res.render('admin/scenicIntroduction/add', {
        pretty: true,
        pageTitle:'修改景点',
        scenicIntroduction: scenics[0]
      });
    });
});

router.post('/edit', user.requireLogin, function (req, res, next) {
  
  var request = req.body;
  console.log(request);
  //var scenicId = request.id;//景点ID
  var oldCoverImageId = request.oldCoverImageId
  var oldVoice = request.oldVoice
  var newObj = request.obj;//修改后的景点
  var scenicId = newObj.id;//景点ID

  /*if(oldCoverImageId !== newObj.coverImageId){
    File.findByIdAndUpdate(coverImage,{$pull:{quote:oldCoverImageId},$addToSet:{quote:newObj.coverImageId}},function(err,newFile){
      if(err){
        return res.send({code:0,error:"图片增加关联关系失败"})
      }
      
      console.log('图片增加关联关系成功');
      return res.send({code:1});
    }); 
  }

  if(oldVoice !== newObj.voice){
    File.findByIdAndUpdate(coverImage,{$pull:{quote:oldCoverImageId},$addToSet:{quote:newObj.coverImageId}},function(err,newFile){
      if(err){
        return res.send({code:0,error:"图片增加关联关系失败"})
      }
      console.log('图片增加关联关系成功');
      return res.send({code:1});
    });
  }*/

  ScenicIntroduction.findByIdAndUpdate(scenicId,{$set:newObj},function(err,newScenic){
    if(err){
      return res.send({code:0,error:"更新文章失败"})
    }
    console.log('更新文章成功');
    return res.send({code:1});
  });    
});


router.get('/delete/:id', user.requireLogin, function (req, res, next) {
  if (!req.params.id) {
    return next(new Error('删除id不存在'));
  }

  var conditions = {
    _id:new mongoose.Types.ObjectId(req.params.id)
  };

  ScenicIntroduction.remove(conditions).exec(function (err, rowsRemoved) {
    if (err) {
      return next(err);
    }

    if (rowsRemoved) {
      console.log('删除成功');      
    } else {
      console.log('删除失败');
    }

    res.redirect('/admin/scenicIntroduction');
  });
});

router.get('/recommend/:id/:status', user.requireLogin, function (req, res, next) {
  if (!req.params.id||!req.params.status) {
    req.flash('error','缺少参数')
    res.redirect('/admin/scenicIntroduction');
  }

  ScenicIntroduction.count({recommend:true}, function(err,count){
    var newRecommend = {recommend:req.params.status==="true"?true:false};


    if(count+1>3&&newRecommend.recommend===true){
      req.flash('error','推荐景点最多为三个')
      res.redirect('/admin/scenicIntroduction');
      return;
    }      
    ScenicIntroduction.findByIdAndUpdate(req.params.id,{$set:newRecommend},function(err,newScenic){
      if(err){
        return next(err);
      }
      console.log('更新推荐状态成功');
      res.redirect('/admin/scenicIntroduction');
    });   
  });
});

router.get('/published/:id/:status', user.requireLogin,function (req, res, next) {
  if (!req.params.id||!req.params.status) {
    req.flash('error','缺少参数')
    res.redirect('/admin/scenicIntroduction');
  }

  var newPublished = {published:req.params.status==="true"?true:false};
  ScenicIntroduction.findByIdAndUpdate(req.params.id,{$set:newPublished},function(err,newScenic){
    if(err){
      return next(err);
    }
    console.log('更新推荐状态成功');
    res.redirect('/admin/scenicIntroduction');
  });
});
