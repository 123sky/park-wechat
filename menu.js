/*微信菜单同步*/
var request = require('request');
var jssdk = require('./lib/jssdk');

request.debug = true;

var menuItems = {
    "button":[
        {
            "name":"智慧导览",
            "sub_button":[
                {    
                   "type":"view",
                   "name":"智慧首页",
                   "url":"http://bf734694.ngrok.io/main"
                },
                {
                   "type":"view",
                   "name":"景点推荐",
                   "url":"http://bf734694.ngrok.io/main/scenicIntroduction"
                },
                {
                   "type":"view",
                   "name":"路线推荐",
                   "url":"http://bf734694.ngrok.io/main/routeRecommend"
                }
            ]
        },{
            "name":"景区服务",
            "sub_button":[
                {    
                   "type":"view",
                   "name":"信息发布",
                   "url":"http://bf734694.ngrok.io/main/information"
                },
                {    
                   "type":"view",
                   "name":"园区服务",
                   "url":"http://bf734694.ngrok.io/main/parkService"
                },
                {
                   "type":"view",
                   "name":"停车服务",
                   "url":"http://bf734694.ngrok.io/main/parking"
                },
                {
                   "type":"view",
                   "name":"公厕服务",
                   "url":"http://bf734694.ngrok.io/main/toilet"
                }
            ]
        },{
            "type":"click",
            "key":"contact-us",
            "name":"联系我们"
        }
    ]
};

jssdk.getAccessToken(function(err,token){
    if(err || !token){
        return console.error.log("获取access_token失败");
    }

    console.log({token:token});

    /*var sch = schedule.scheduleJob({second:0},function(){
        console.log((new Date())+"：start to refresh menu");
        refreshMenu();
    });*/
    refreshMenu();

    /*先删除菜单，再添加菜单*/
    function refreshMenu(){
        var delUrl = "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token="+token;
        request.get(delUrl,function(delErr,delRep,delBody){
            if(delErr){
                return console.log('菜单删除失败',delErr);
            }

            console.log('菜单删除成功',delBody);

            var createObj = {
                url:"https://api.weixin.qq.com/cgi-bin/menu/create?access_token="+token,
                json:menuItems
            }
            request.post(createObj,function(createErr,createRep,createBody){
                if(createErr){
                    return console.log('菜单创建失败',createErr);
                }

                console.log('菜单创建成功',createBody);
            })
        })
    };
})
