/*
 * 自定义验证
 */
;(function($){
	$.validator.addMethod("mainRequire", function(value, element,param) {
		return this.optional(element) || ($.trim(value)!="");
	}, "输入不能为空值");
	/*
	 * 是否是手机号码
	 */
	$.validator.addMethod("mobile", function(value, element) {   
	    var mobile = /^1[3578]{1}\d{9}$|^14[57]{1}\d{8}$|^17[0678]{1}\d{8}$/;
	    return this.optional(element) || (mobile.test(value));
	}, "手机号码格式不正确");
	
	/*
	 * 是否是固定电话
	 */
	$.validator.addMethod("tel", function(value, element) {   
	    var tel =/^\d{3,4}-?\d{7,9}$/;
	    return this.optional(element) || (tel.test(value));
	}, "电话号码格式不正确");
	
	/*
	 * 是否是邮编
	 */
	$.validator.addMethod("zipCode", function(value, element) {   
	    var zip = /^[0-9]{6}$/;
	    return this.optional(element) || (zip.test(value));
	}, "邮编格式不正确");
	
	/*
	 * 输入只为[0-9A-Za-z]
	 */
	$.validator.addMethod("alpha", function(value, element) {   
	    var alpha = /^[0-9A-Za-z]+$/g;
	    return this.optional(element) || (alpha.test(value));
	}, "只能输入数字和字母");
	
	/*
	 * 比较大小
	 */
	$.validator.addMethod("compare", function(value, element,params) {   
		params=params.replace(/'/g,"\"");
		params=JSON.parse(params);
		var relation=params.relation;
		var target=$(params.target);
		if(target.length==0){
			throw new Error("目标不能为空");
		}
		var num=0;
		try{
			value=parseFloat(value);
			num=parseFloat(target.val());
		}catch(e){
			throw new Error("无法解析为数字");
		}
		if(_.isNullOrUndefined(relation)){
			throw new Error("关系不能为空");
		}
		if(relation=="<"){
			 return this.optional(element)||value<num;
		}else if(relation=="<="){
			 return this.optional(element)||value<=num;
		}else if(relation==">"){
			 return this.optional(element)||value>num;
		}else if(relation==">="){
			 return this.optional(element)||value>=num;
		}else if(relation=="!="){
			 return this.optional(element)||value!=num;
		}
	   return false;
	}, "比较大小出错");
	
	/*
	 * 正则表达式验证
	 * params包括俩部分：pattern，attributes
	 * pattern：正则表达式的模式或其他正则表达式
	 * attributes：是一个可选的字符串，包含属性 "g"、"i" 和 "m"，分别用于指定全局匹配、区分大小写的匹配和多行匹配，默认为g
	 */
	$.validator.addMethod("regular", function(value, element,params) {
		params=params.replace(/'/g,"\"");
		params=JSON.parse(params);
		params=$.extend({attributes:"g"},params);
		var reg=new RegExp(params.pattern,params.attributes);
	    return this.optional(element) || (reg.test(value));
	}, "正则表达式无法匹配");
	
	/*
	 * 输入只能为中文、数字和字母
	 */
	$.validator.addMethod("alphaC", function(value, element) {   
	    var alphaC =/^[0-9A-Za-z\u4E00-\u9FA5]+$/g;
	    return this.optional(element) || (alphaC.test(value));
	}, "只能输入中文、数字和字母");
	
	/*
	 * 输入只能是中文
	 */
	$.validator.addMethod("chinese", function(value, element) {   
	    var chinese =/^[\u4E00-\u9FA5]+$/g;
	    return this.optional(element) || (chinese.test(value));
	}, "只能输入中文");
	
	/*
	 * ajax验证
	 */
	$.validator.addMethod("ajax", function(value, element,params) {
		return this.optional(element)||ajaxFun(value, element,params,true,"get");
	}, "已经存在");
	
	/*
	 * ajax验证,不存在
	 */
	$.validator.addMethod("ajaxN", function(value, element,params) {
		return this.optional(element)||ajaxFun(value, element,params,false,"get");
	}, "不存在");
	
	/*
	 * Post Ajax验证
	 */
	$.validator.addMethod("ajaxPost", function(value, element,params) {
		return this.optional(element)||ajaxFun(value, element,params,true,"post");
	}, "已经存在");
	
	/*
	 * Post Ajax验证，不存在
	 */
	$.validator.addMethod("ajaxPostN", function(value, element,params) {
		return this.optional(element)||ajaxFun(value, element,params,false,"post");
	}, "不存在");
	
	/*
	 * Ajax 请求
	 * value 内容
	 * element 元素
	 * params  参数
	 * flag 是否是验证存在
	 * type 请求方式
	 */
	function ajaxFun(value, element,params,flag,type){
		if(_.isNullOrUndefined(value)||value.trim().length==0){
			return false;
		}
		var oldValue=$(element).attr("data-oldValue");
		if(!_.isNullOrUndefined(oldValue)&&oldValue.trim().length>0){
			if(oldValue===value){
				return true;
			}
		}
		form=$(element).parents(".form-horizontal");
		if(_.isNullOrUndefined(params)){
			throw Error("异步验证地址不存在");
		}
		var pas=params.match(/{[.#]{1}[0-9A-Za-z]+}/g);
		if(!_.isNullOrUndefined(pas)){
			for(var i=0;i<pas.length;i++){
				var temp=pas[i].substring(1,pas[i].length-1);
				var tempInput=form.find(temp);
				if(tempInput.size()==0){
					throw Error("未找到元素的值:"+temp);
				}
				var val=tempInput.val();
				if(_.isNullOrUndefined(val)||val.trim().length==0){
					return false;
				}
				params.replace(params[i],form.find(temp).val());
			}
		}
		var r;
		if(type=="get"){
			r=$.getJSONData(params+"/"+value);
		}else{
			r=$.postJSONData(params,value);
		}
		return r==undefined?false:flag^r;
	}
})(jQuery);