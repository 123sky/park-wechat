/*选择图片*/
var chooseImg = (
	function(){
		return{
			init:function(element){
				element.on("click",function(){
					var url = window.open(urlData.origin+urlData.imageLibrary+"?from:"+element.attr("id"));
				})
			}
		}

	}
)();

/*选择语音*/
var chooseVoice = (
	function(){
		return{
			init:function(element){
				element.on("click",function(){
					var url = window.open(urlData.origin+urlData.voiceLibrary+"?from:"+element.attr("id"));
				})
			}
		}

	}
)();