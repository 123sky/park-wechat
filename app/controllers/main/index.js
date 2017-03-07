var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Weather = mongoose.model('Weather'),
  http = require("http"),
  moment = require("moment");

module.exports = function (app) {
  app.use('/main', router);
};

router.get('/', function (req, res, next) {

	Weather.find()
    .sort({'created':'desc'})
    .exec(function (err, weathers) {
        if (err) 
            return next(err);
        if(weathers.length>0){
        	var timeSpace = moment(weathers[0].created).fromNow().split(" ");
        	if(timeSpace[1]>15&&timeSpace[2]==='minutes'){
        		//超过15分钟则重新获取最新天气
        		getWeather(weathers[0].id)
        	}else{
        		//否则
        		res.render('main/index', {
	            	weather:weathers[0],
					pretty: true,
			    	pageTitle: "智慧导览"
			  	});
			  	console.log("天气数据未过期");
        	}
        }else{
        	//初始化没有天气记录的时候
			getWeather();
        }
    });

    //天气获取api网址：http://www.yytianqi.com/api.html
    //获取天气，并更新或保存
    function getWeather(id){
		var options = {   
		    method:'GET',
		    hostname: 'api.yytianqi.com',
			port: '',
		    path:'/observe?city=CH240101&key=e3o19t9mvgmsbb43',  
		    headers:{  
		        "Content-Type": 'text/html'
		    }  
		}  
		var resData = "";
		http.get(options, function(httpRes) {
	        httpRes.on("data",function(data){
	            resData += data;
	        });
	        httpRes.on("end", function() {
	            var weatherObj = JSON.parse(resData);
	            if(weatherObj.code===1){
	            	weatherObj.data.created = new Date();
	            	if(id){
	            		updateWeather(weatherObj.data);
	            	}else{
						addWeather(weatherObj.data);
	            	}
	            }
        	});
    	})

		//新建天气
    	function addWeather(obj){
    		var weather = new Weather(obj);
    		weather.save(function(err,saveWeather){
	            		if(err){
	            			console.log(err);
	            			res.render('main/index', {
						    	pretty: true,
						    	pageTitle: "智慧导览"
						  	});
						  	console.log("新建天气出错");
	            		}else{
	            			res.render('main/index', {
	            				weather:saveWeather,
						    	pretty: true,
						    	pageTitle: "智慧导览"
						  	});
						  	console.log("新建天气成功");
	            		}
	            		return 
	            	})
    	}

    	//更新天气
    	function addWeather(obj){
    		weather.findByIdAndUpdate(id,{$set:obj},function(err,updateWeather){
		        if(err){
        			console.log(err);
        			res.render('main/index', {
				    	pretty: true,
				    	pageTitle: "智慧导览"
				  	});
				  	console.log("更新天气出错");
        		}else{
        			res.render('main/index', {
        				weather:updateWeather,
				    	pretty: true,
				    	pageTitle: "智慧导览"
				  	});
				  	console.log("新建天气成功");
        		}
        		return
		    }); 
    	}
    }
});