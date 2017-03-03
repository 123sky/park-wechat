/*
 * AJAX 请求
 */
(function($){
	/*
	 * 日期格式化
	 */
	Date.prototype.format = function(format){ 
		var week=["日","一","二","三","四","五","六"];
		var o = { 
		"M+" : this.getMonth()+1, //month 
		"d+" : this.getDate(), //day 
		"h+" : this.getHours(), //hour 
		"m+" : this.getMinutes(), //minute 
		"s+" : this.getSeconds(), //second 
		"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
		"S" : this.getMilliseconds() //millisecond 
		};

		if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
		} 
		if(/(w)/.test(format)) { 
			format = format.replace(RegExp.$1, "星期"+week[this.getDay()]); 
		} 
		for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
		format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
		} 
		return format; 
		};
	/*
	 * Ajax请求无同步
	 */
	function ajaxWithAsync(url,type,data){
		/*$(".waiting").removeClass("displayNone");*/
		var json = undefined;
		$.ajax({
			url:url,
			type:type,
			async:false,
			contentType:"application/json",
			dataType:"json",
			timeout:60000,
			beforeSend:function(request){
			},
			statusCode:{
			403:function(errorObject,error,errorText){
				console.log(errorText)
				location.href="login.html";
				/*$(".waiting").addClass("displayNone");*/
			},
			500:function(errorObject,error,errorText){
				console.log(errorText)
				/*$(".waiting").addClass("displayNone");*/
			}},
			data:JSON.stringify(data),
			success:function(result){
				if(typeof result ==="string"){
					var a=JSON.parse(result);
					if(a!=undefined&&a.code!=undefined){
						
					}
				}
				/*$(".waiting").addClass("displayNone");*/
				json = result;
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				/*$(".waiting").addClass("displayNone");*/
			}
		});
		return json;
	}
	
	/*
	 * Ajax请求同步
	 */
	function ajaxWithUnAsync(url,type,data,callback){
		/*$(".waiting").removeClass("displayNone");*/
		$.ajax({
			url:url,
			type:type,
			async:true,
			contentType:"application/json",
			dataType:"json",
			timeout:60000,
			beforeSend:function(request){
			},
			statusCode:{
			403:function(errorObject,error,errorText){
				console.log(errorText)
				location.href="login.html";
				/*$(".waiting").addClass("displayNone");*/
			},
			500:function(errorObject,error,errorText){
				console.log(errorText)
				/*$(".waiting").addClass("displayNone");*/
			}},
			data:JSON.stringify(data),
			success:function(msg){
				if(typeof msg ==="string"){
					var a=JSON.parse(msg);
					if(a!=undefined&&a.code!=undefined){
						
					}
				}
				callback(msg);
				/*$(".waiting").addClass("displayNone");*/
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				/*$(".waiting").addClass("displayNone");*/
			}
		});
	}


	/*
	* 文件读取
	* */
	function readFile(url,type){
		/*$(".waiting").removeClass("displayNone");*/
		var resultData = undefined;
		$.ajax({
			url:url,
			type:type,
			async:false,
			//contentType:"application/json",
			dataType:"text",
			timeout:60000,
			beforeSend:function(request){
			},
			statusCode:{
				403:function(errorObject,error,errorText){
					console.log(errorText)
					location.href="login.html";
					/*$(".waiting").addClass("displayNone");*/
				},
				500:function(errorObject,error,errorText){
					console.log(errorText)
					/*$(".waiting").addClass("displayNone");*/
				}},
			success:function(result){
				resultData = result;
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				/*$(".waiting").addClass("displayNone");*/
			}
		});
		return resultData;
	}


	return $.extend({

		readFile:function(url,method){
			return readFile(url,method);
		},

		/* GET*/
		getJSONData:function(url){
			return ajaxWithAsync(url,"GET");
		},
		/*GET*/
		getJSON:function(url,callback){
			ajaxWithUnAsync(url,"GET",undefined,callback);
		},
		/*DEL*/
		delJSONData:function(url){
			return ajaxWithAsync(url,"DELETE");
		},
		/* DEL*/
		delJSON:function(url,callback){
			ajaxWithUnAsync(url,"DELETE",undefined,callback);
		},
		/*POST*/
		postJSONData:function(url,data){
			return ajaxWithAsync(url,"POST",data);
		},
		/* POST*/
		postJSON:function(url,data,callback){
			 ajaxWithUnAsync(url,"POST",data,callback);
		},
		/*PUT*/
		putJSONData:function(url,data){
			return ajaxWithAsync(url,"PUT",data);
		},
		/* PUT*/
		putJSON:function(url,data,callback){
			ajaxWithUnAsync(url,"PUT",data,callback);
		},
		/*PUT*/
		methodJSONData:function(url,method,data){
			return ajaxWithAsync(url,method,data);
		},
		/* PUT*/
		methodJSON:function(url,method,data,callback){
			ajaxWithUnAsync(url,method,data,callback);
		}
	});
})(jQuery);
