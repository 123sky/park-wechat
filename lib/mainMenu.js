var baseUrl = 'http://chenjp.ittun.com';
var mainMenu = {
    tourGuide:{
        name:"智慧导览",
        index:{
            name:"导览首页"
            url：baseUrl+"/main"
        },
        scenicIntroduction:{
            name:"景点推荐"
            url：baseUrl+"/main/scenicIntroduction"
        },
        routeRecommend:{
            name:"路线推荐"
            url：baseUrl+"/main/routeRecommend"
        }
    },
    service:{
        name:"公园服务",
        information:{
            name:"信息发布"
            url：baseUrl+"/main/information"
        },
        bike:{
            name:"租车服务"
            url：baseUrl+"/main/parkService/bike"
        },
        parking:{
            name:"停车服务"
            url：baseUrl+"/main/parkService/parking"
        },
        toilet:{
            name:"公厕服务"
            url：baseUrl+"/main/parkService/toilet"
        }
    }
}
module.exports = mainMenu;
