var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    wechat = require('wechat'),
    jssdk = require("../../../lib/jssdk.js"),
    menu = require("../../../menu.js"),
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

var getTextResponse = function(message,text){
    var msg = 
        '<xml>'+
        '<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'+
        '<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'+
        '<CreateTime>'+Math.round(Date.now()/1000)+'</CreateTime>'+
        '<MsgType><![CDATA[text]]></MsgType>'+
        '<Content><![CDATA['+text+']]></Content>'+
        '</xml>';
    return msg;
}

/*用户关注回复*/
var subscribeReq = function (req, res, next){
    var message = req.weixin;
    var answer = getTextResponse(message,'欢迎关注艾溪湖微信公众号');
    res.set('Content-Type','text/xml');
    res.send(answer);
};

/*文字消息请求的处理*/
var textReq = function (req, res, next){

    var message = req.weixin;

    if(!message.Content){
        return res.reply('消息为空');
    }
    res.set('Content-Type','text/xml');

    /*找厕所*/
    var toilet = new RegExp('厕|卫生|屎|尿');
    if(toilet.test(message.Content)){
        var text = '<a href="'+menu.button[1].sub_button[3].url+'">点击进入-'+menu.button[1].sub_button[3].name+'</a>';
        res.send(getTextResponse(message,text));
        return;
    }

    /*找停车场*/
    var parking = new RegExp('停|车');
    if(parking.test(message.Content)){
        var text = '<a href="'+menu.button[1].sub_button[2].url+'">点击进入-'+menu.button[1].sub_button[2].name+'</a>';
        res.send(getTextResponse(message,text));
        return;
    }

    /*租自行车*/
    var bike = new RegExp('租|自行|单车');
    if(bike.test(message.Content)){
        var text = '<a href="'+menu.button[1].sub_button[1].url+'">点击进入-'+menu.button[1].sub_button[1].name+'</a>';
        res.send(getTextResponse(message,text));
        return;
    }

    /*智慧首页*/
    var index = new RegExp('智慧|首页|公园');
    if(index.test(message.Content)){
        var text = '<a href="'+menu.button[0].sub_button[0].url+'">点击进入-'+menu.button[0].sub_button[0].name+'</a>';
        res.send(getTextResponse(message,text));
        return;
    }

    /*景点*/
    var scenic = new RegExp('景');
    if(scenic.test(message.Content)){
        var text = '<a href="'+menu.button[0].sub_button[1].url+'">点击进入-'+menu.button[0].sub_button[1].name+'</a>';
        res.send(getTextResponse(message,text));
        return;
    }

    /*推荐路线*/
    var route = new RegExp('路');
    if(route.test(message.Content)){
        var text = '<a href="'+menu.button[0].sub_button[2].url+'">点击进入-'+menu.button[0].sub_button[2].name+'</a>';
        res.send(getTextResponse(message,text));
        return;
    }

    res.send(getTextResponse(message,"您可以尝试输入‘智慧公园’"));
};

/*联系我们单击事件*/
var contactUsReq = function(req,res,next){

    var message = req.weixin;
    var text = '艾溪湖管理处联系方式\n电话：12345678910\n邮件：123456789@163.com'
    var answer =
        '<xml>'+
        '<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'+
        '<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'+
        '<CreateTime>'+Math.round(Date.now()/1000)+'</CreateTime>'+
        '<MsgType><![CDATA[text]]></MsgType>'+
        '<Content><![CDATA['+text+']]></Content>'+
        '</xml>';

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
                        case 'contact-us':
                            contactUsReq(req,res,next);
                            break;
                        default :
                            return res.reply('无法处理的地址');
                            break;
                    }
                    break;
                case 'subscribe':
                    subscribeReq(req,res,next);
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
