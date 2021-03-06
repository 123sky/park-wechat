var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    fs = require('fs');
    path = require("path");
    ParkService = mongoose.model('ParkService'),
    File = mongoose.model('File');
    user = require('./user');
    
module.exports = function (app) {
    app.use('/admin/parkService', router);
};

router.get('/', user.requireLogin, function (req, res, next) {
    var sortby = req.query.sortby?req.query.sortby:"created";
    var sortdir = req.query.sortdir?req.query.sortdir:"desc";

    if(['title','created','published'].indexOf(sortby)=== -1){
        sortby = 'created';
    }
    if(['desc','asc'].indexOf(sortdir)=== -1){
        sortdir = 'desc';
    }

    var sortObj = {};
    sortObj[sortby] = sortdir;
    
    ParkService.find()
        .populate('images')
        .exec(function (err, services) {
            if (err) return next(err);      
            res.render('admin/ParkService/index', {
                services: services,
                pageTitle:'园区服务列表',
                pretty: true
            });
        });
});

router.get('/view/:id', user.requireLogin, function (req, res, next){
    ParkService.finndOne({_id: req.params.id}).ecec(function(err, services){
        if(err){
            return next(new Error('no ParkService id'));
        }

        res.render('/admin/parkService/view', {
            services: services,
        });

    });

});

router.get('/add', user.requireLogin, function (req, res, next) {
    res.render('admin/parkService/add', {
        pretty: true,
        pageTitle:'添加园区服务',
        parkService: {}
    });
});

router.post('/add', user.requireLogin, function (req, res, next) {
    var request = req.body;

    //后端校验
    req.checkBody('title', '园区服务名称不能为空').notEmpty();
    req.checkBody('info', '简介不能为空').notEmpty();
    req.checkBody('content', '内容不能为空').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        return res.send({code:0,error:errors});
    }

    //保存文字信息
    var title = request.title.trim();
    var info = request.info;
    var type = request.type;        
    var content = request.content;
    var coverImage = request.coverImageId;
    var published = request.published;
    
    var parkService = new ParkService({
        title: title,
        info: info,
        type: type,
        content: content,
        published: published,
        created: new Date(),
        coverImage:coverImage,
    });
    parkService.save(function (err, parkService) {
        if (err) {
            console.log('文字信息添加失败:', err);
            return res.send({code:0,msg:'文字信息添加失败'});
        } else {
            console.log('文字信息添加成功');
                //在文件信息中被引用的图片，标记好被谁引用
                File.findByIdAndUpdate(coverImage,{$addToSet:{quote:parkService._id}},function(err,newFile){
                if(err){
                    return res.send({code:0,error:"图片增加关联关系失败"})
                }
                console.log('图片增加关联关系成功');
                return res.send({code:1});
                });             
        }
    });
});

router.post('/delFile', user.requireLogin, function (req, res, next) {
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

    ParkService.find(obj)
        .populate('coverImage')
        .exec(function (err, services) {
            if (err) 
                return next(err);
            res.render('admin/parkService/add', {
                pretty: true,
                pageTitle:'修改园区服务',
                parkService: services[0]
            });
        });
});

router.post('/edit', user.requireLogin, function (req, res, next) {
    //关于图片文件的更新在delFile的接口中已经做了，所以这里不用更新了
    var request = req.body;
    //var serviceId = request.id;//服务ID
    //var file = request.file;//新添加的文章数组
    //var oldDelImage = request.oldDelImage;//被移除的旧的图片ID字符串数组
    //var oldDelImageObjId = [];//被移除的旧的图片objectID数组
    var oldCoverImageId = request.oldCoverImageId.replace(/\"/g,"");
    var newObj = request.obj;//修改后的景点
    var serviceId = newObj.id;//服务ID
    var coverImage = newObj.coverImage;
    
    /*console.log(oldDelImage);
    for(var i=0;i<oldDelImage.length;i++){
        oldDelImageObjId.push(new mongoose.Types.ObjectId(oldDelImage[i]))
    }

    removeImage();
    
    //删除旧的图片
    function removeImage(){
        //如果存在被删除的图片
        if(oldDelImage.length>0){
            ParkService.findById(sericeId)
                .populate('images')
                .exec(function (err, service) {
                    if(err){
                        return res.send({code:0,error:"没有查到相应内容"})
                    }
                    //移除旧图片的关联
                    var images = service.images;
                    var newImageArray = [];
                    for(var i=0;i<images.length;i++){
                            if(oldDelImage.indexOf(images[i].id)<0){
                                newImageArray.push(new mongoose.Types.ObjectId(images[i].id));
                            }
                    }
                    if(newImageArray.length>0){
                        newObj.images = newImageArray;
                    }
                    //删除旧图片记录
                    console.log(oldDelImageObjId);
                    File.find({"_id":{ $in: oldDelImageObjId}},function(err,delFile){
                        if(err){
                            return res.send({code:0,error:"获取文件信息出错"})
                        }
                        console.log(delFile);
                        File.remove({"_id":{$in: oldDelImageObjId}},function(err,rowsRemoved){
                            if(err){
                                return res.send({code:0,error:"删除文件信息出错"})
                            }
                            console.log("成功删除文件信息:"+rowsRemoved);
                            //移除目录中文件
                            for(var i=0;i<delFile.length;i++){
                                var filePath = delFile[i].destination+delFile[i].filename;
                                fs.unlink(filePath, function(err){
                                    if(err){
                                        console.log(err) ;
                                        return res.send({code:0,error:err});
                                    }else{
                                        console.log('文件删除成功') ;
                                        addNewImage();
                                    }
                                }) ;
                            }
                        })
                    });
                });
        }else{
            addNewImage()
        }
    }

    //添加新的图片
    function addNewImage(){
        //如果有新的文件
        if(file.length>0){
            File.insertMany(file, (err, fileArray)=>{
                if (err) {
                    console.log('文件信息添加失败:', err);
                    return res.send({code:0,msg:'文件信息添加失败'});
                } else {
                    console.log('文件信息添加成功');
                    var tempImage = [],tempVoice = [];
                    for(var i=0;i<fileArray.length;i++){
                        if(fileArray[i].fieldname === 'imageFile'){
                            tempImage.push(new mongoose.Types.ObjectId(fileArray[i]._id));
                        }
                        else if(fileArray[i].fieldname === 'voiceFile'){
                            tempVoice.push(new mongoose.Types.ObjectId(fileArray[i]._id));
                        }
                    }
                    if(tempImage.length>0){
                        if(newObj.images){
                            newObj.images = newObj.images.concat(tempImage);//合并新图片和旧图片两个数组
                        }else{
                            newObj.images = tempImage;//只有新图片
                        }
                    }
                    if(tempVoice.length>0){
                        newObj.voices = tempVoice;
                    }
                    updateParkService();
                }
            })
        }else{
            updateParkService();
        }
    }

    //更新文章内容
    function updateParkService(){*/
        ParkService.findByIdAndUpdate(serviceId,{$set:newObj},function(err,newService){
            if(err){
                return res.send({code:0,error:"更新文章失败"})
            }
            console.log('更新文章成功');
            if(oldCoverImageId !== coverImage){
                File.findByIdAndUpdate(coverImage,{$addToSet:{quote:serviceId}}, function(err, newFile){
                if(err){
                return res.send({code:0,error:"图片增加关联关系失败"})
                }
                console.log('图片增加关联关系成功');
                console.log(newFile);
                //return res.send({code:1});
                })
                File.findByIdAndUpdate(oldCoverImageId,{$pull:{quote:serviceId}}, function(err, newFile){
                console.log("111");
                if(err){
                return res.send({code:0,error:"图片删除关联关系失败"})
                }
                console.log('图片删除关联关系成功');
                console.log(newFile);
                });
            }
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
    //删除文章引用图片和语音的关联
    ParkService.find(conditions)
    .populate('coverImage')
    .exec(function(err, service){
        console.log(service);
        if(err){
        return next(err);
        }
        var coverImage = service[0].coverImage;
        var voice = service[0].voice;
        var serviceId = service[0]._id;
        console.log(coverImage);
        console.log(serviceId);
        File.findByIdAndUpdate(coverImage,{$pull:{quote:serviceId}}, function(err, newFile){
         if(err){
        return res.send({code:0,error:"图片删除关联关系失败"});
         } 
         console.log('图片删除关联关系成功');
        });
    });
    ParkService.remove(conditions).exec(function (err, rowsRemoved) {
        if (err) {
            return next(err);
        }

        if (rowsRemoved) {
            console.log('删除成功');
        } else {
            console.log('删除失败');
        }

        res.redirect('/admin/parkService');
    });
});

router.get('/recommend/:id/:status', user.requireLogin, function (req, res, next) {
    if (!req.params.id||!req.params.status) {
        req.flash('error','缺少参数')
        res.redirect('/admin/parkService');
    }

    ParkService.count({recommend:true}, function(err,count){
        var newRecommend = {recommend:req.params.status==="true"?true:false};


        if(count+1>3&&newRecommend.recommend===true){
            req.flash('error','推荐景点最多为三个')
            res.redirect('/admin/parkService');
            return;
        }      
        ParkService.findByIdAndUpdate(req.params.id,{$set:newRecommend},function(err,newInfor){
            if(err){
                return next(err);
            }
            console.log('更新推荐状态成功');
            res.redirect('/admin/parkService');
        });   
    });
});

router.get('/published/:id/:status', user.requireLogin, function (req, res, next) {
    if (!req.params.id||!req.params.status) {
        req.flash('error','缺少参数')
        res.redirect('/admin/parkService');
    }

    var newPublished = {published:req.params.status==="true"?true:false};
    ParkService.findByIdAndUpdate(req.params.id,{$set:newPublished},function(err,newInfor){
        if(err){
            return next(err);
        }
        console.log('更新发布状态成功');
        res.redirect('/admin/parkService');
    });
});
