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

var menuText = '欢迎关注艾溪湖微信公众号\n您可以回复下列编号获取内容\n'+
        '1：智慧首页\n2：景区列表\n3：推荐路线\n4：信息服务\n5：租车服务\n6：停车服务\n7：公厕服务';

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

/*获取文字消息*/
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

/*获取图文消息*/
var getImageTextResponse = function(message,title,description,picUrl,url){
    var msg = 
        '<xml>' +
        '<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'+
        '<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'+
        '<CreateTime>'+Math.round(Date.now()/1000)+'</CreateTime>'+
        '<MsgType><![CDATA[news]]></MsgType>'+
        '<ArticleCount>1</ArticleCount>'+
        '<Articles>'+
        '<item>'+
        '<Title><![CDATA['+title+']]></Title>'+
        '<Description><![CDATA['+description+']]></Description>'+
        '<PicUrl><![CDATA['+picUrl+']]></PicUrl>'+
        '<Url><![CDATA['+url+']]></Url>'+
        '</item>'+
        '</Articles>'+
        '</xml>';
    return msg;
}

/*用户关注回复*/
var subscribeReq = function (req, res, next){
    var message = req.weixin;
    var answer = getTextResponse(message,menuText);
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
    var toilet = new RegExp('厕|卫生|屎|尿|7');
    if(toilet.test(message.Content)){
        var title = '点击进入'+menu.button[1].sub_button[3].name;
        var description = '点击即可查看公共厕所的具体位置，为您游园提供最便捷的服务';
        var picUrl = 'http://img.taopic.com/uploads/allimg/120301/6388-12030121462846.jpg';
        var url = menu.button[1].sub_button[3].url;

        res.send(getImageTextResponse(message,title,description,picUrl,url));
        return;
    }

    /*找停车场*/
    var parking = new RegExp('停|车|6');
    if(parking.test(message.Content)){
        var title = '点击进入'+menu.button[1].sub_button[2].name;
        var description = '点击即可查看停车场的具体位置，为您游园提供最便捷的服务';
        var picUrl = 'http://img.taopic.com/uploads/allimg/120301/6388-12030121462846.jpg';
        var url = menu.button[1].sub_button[2].url;

        res.send(getImageTextResponse(message,title,description,picUrl,url));
        return;
    }

    /*租自行车*/
    var bike = new RegExp('租|自行|单车|5');
    if(bike.test(message.Content)){
        var title = '点击进入'+menu.button[1].sub_button[1].name;
        var description = '点击即可查看自行车租赁点的具体位置，为您游园提供最便捷的服务';
        var picUrl = 'http://img.taopic.com/uploads/allimg/120301/6388-12030121462846.jpg';
        var url = menu.button[1].sub_button[1].url;

        res.send(getImageTextResponse(message,title,description,picUrl,url));
        return;
    }

    /*信息服务*/
    var bike = new RegExp('信息|4');
    if(bike.test(message.Content)){
        var title = '点击进入'+menu.button[1].sub_button[0].name;
        var description = '点击即可查看公告信息，为您游园提供最便捷的服务';
        var picUrl = 'http://img.taopic.com/uploads/allimg/120301/6388-12030121462846.jpg';
        var url = menu.button[1].sub_button[0].url;

        res.send(getImageTextResponse(message,title,description,picUrl,url));
        return;
    }

    /*智慧首页*/
    var index = new RegExp('智慧|首页|公园|1');
    if(index.test(message.Content)){
        var title = '点击进入'+menu.button[0].sub_button[0].name;
        var description = '点击即可进入智慧首页，为您全面的导览服务';
        var picUrl = 'http://img.taopic.com/uploads/allimg/120301/6388-12030121462846.jpg';
        var url = menu.button[0].sub_button[0].url;

        res.send(getImageTextResponse(message,title,description,picUrl,url));
        return;
    }

    /*景点*/
    var scenic = new RegExp('景|2');
    if(scenic.test(message.Content)){
        var title = '点击进入'+menu.button[0].sub_button[1].name;
        var description = '点击即可查看景点列表，为您游园提供最便捷的服务';
        var picUrl = 'http://img.taopic.com/uploads/allimg/120301/6388-12030121462846.jpg';
        var url = menu.button[0].sub_button[1].url;

        res.send(getImageTextResponse(message,title,description,picUrl,url));
        return;
    }

    /*推荐路线*/
    var route = new RegExp('路|3');
    if(route.test(message.Content)){
        var title = '点击进入'+menu.button[0].sub_button[2].name;
        var description = '点击即可查看推荐路线列表，为您游园提供最便捷的服务';
        var picUrl = 'http://img.taopic.com/uploads/allimg/120301/6388-12030121462846.jpg';
        var url = menu.button[0].sub_button[2].url;

        res.send(getImageTextResponse(message,title,description,picUrl,url));
        return;
    }

    res.send(getTextResponse(message,menuText));
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
