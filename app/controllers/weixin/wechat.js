var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    wechat = require('wechat'),
    jssdk = require("../../../lib/jssdk.js"),
    request = require('request');

module.exports = function (app) {
    app.use('/wechat', router);
};

/*初始化*/
router.get('/hello', function (req, res, next) {
    jssdk.getSignPackage('http://jswechat.ngrok.cc' + req.url, function (err, signPackage) {
        if (err) {
            return next(err);
        }

        res.render('index', {
            title: 'Hello Wechat Success !',
            signPackage: signPackage,
            pretty: true
        });
    });
});

var config = {
    token: 'HB6Ed1hWFR7Ljsdu43f8',
    appid: 'wx5c957ab9c6d5195f'
};

/*文字消息请求的处理*/
var textReq = function (req, res, next){

    var message = req.weixin;

    if(!message.Content){
        return res.reply('啥都不输入让我差个毛线:)');
    }

    var question = encodeURIComponent(message.Content);
    request.get({
        url:'https://www.baidu.com/s?ie=UTF-8&wd='+question,
        headers:{
            'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36'
        }
    },function(searchErr,searchRes,searchBody){

        if(searchErr){
            console.error(searchErr);
            return res.reply('妈蛋，竟然出错了！');
        }

        var $ = cheerio.load(searchBody);
        var results = $(".result.c-container");

        if(results.length === 0){
            return res.reply('啥都没找到啊！能再把问题描述好一点吗？');
        }

        var result = $(results.get(0));
        var answer = result.find('.c-abstract').text();

        res.reply(answer?answer:'竟然能找到空的答案，奇了怪了，你问的啥啊');

        /*保存会话历史*/
        var conversation = new Conversation({
            user:req.user,
            question:message.Content,
            answer:answer,
            createdAt:new Date()
        });
        conversation.save(function(saveErr,conversation){
            if(saveErr){
                return console.error("conversation save error",saveErr)
            };

            req.user.conversationCount=req.user.conversationCount+1;
            req.user.save(function(e,u){
                if(e){
                    return console.error("conversationCount of user save error",e);
                }
            })
        })
    });
};

/*用户中心单击事件*/
var personCenterReq = function(req,res,next){

    var message = req.weixin;
    var answer =
        '<xml>' +
        '<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'+
        '<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'+
        '<CreateTime>'+Math.round(Date.now()/1000)+'</CreateTime>'+
        '<MsgType><![CDATA[news]]></MsgType>'+
        '<ArticleCount>1</ArticleCount>'+
        '<Articles>'+
        '<item>'+
        '<Title><![CDATA[用户注册]]></Title>'+
        '<Description><![CDATA[点击此处立即出册]]></Description>'+
        '<PicUrl><![CDATA[http://img.taopic.com/uploads/allimg/120301/6388-12030121462846.jpg]]></PicUrl>'+
        '<Url><![CDATA[http://de5e0128.ngrok.io/main]]></Url>'+
        '</item>'+
        '</Articles>'+
        '</xml>';

    console.log(answer);
    res.set('Content-Type','text/xml');
    res.send(answer);

};

/*针对不同的消息类型进行不同的处理*/
var handleWechatRequest = wechat(config, function (req, res, next) {
    var message = req.weixin;
    console.log(message,req.query);

    switch(message.MsgType){
        case'text':
            textReq(req, res, next);
            break;
        case 'event':
            switch(message.Event){
                case 'CLICK':
                    switch(message.EventKey){
                        case 'person-center':
                            personCenterReq(req,res,next);
                            break;
                        default :
                            return res.reply('无法处理的地址');
                            break;
                    }
                    break;
                default :
                    return res.reply('无法处理的事件类型');
                    break;
            }
            break;
        default:
            return res.reply('无法处理的消息类型');
            break;
    }
});

router.get('/index',handleWechatRequest);
router.post('/index',handleWechatRequest);
