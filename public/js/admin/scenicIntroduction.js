$(function () {

    //前端校验
    $("#scenic-form").validate();
    /*var validator = $("#scenic-form").validate({
        errorPlacement: function(error, element){
            // Append error within linked label
            $( element )
                .closest( "#scenic-form" )
                    .find( "label" )
                        .append( error );
        },
        errorElement: "h",
    });*/
    //富文本编辑器
    if (typeof CKEDITOR !== 'undefined') {
        CKEDITOR.replace('content');
    }

    //封面图片
    chooseImg.init($("#add-cover"));
    chooseVoice.init($("#add-voice"));


    //提交表单
    $("#submit-btn").on('click',function(){
        if($("#scenic-form").valid() === false){

        }else
        if($("#_id").val()){
            //更新
            var newObj = {
                obj:{
                    id:$("#_id").val(),
                    title:$("#title").val(),
                    info:$("#info").val(),
                    content:CKEDITOR.instances.content.getData(),
                    //favorite:$("#favorite").val(),
                    recommend:false,
                    coverImage:$("#add-cover input").val(),
                    voice:$("#add-voice input").val(),
                    published:$("#published").prop("checked")
                },
                oldCoverImageId:$("#add-cover input").attr("data-old"),
                oldVoice:$("#add-voice input").attr("data-old")
            };
            $.postJSON(urlData.scenic.edit,newObj,function(result){
                if(result.code === 1){
                    alert("景点更新成功");

                    //location.pathname = '/admin/scenicIntroduction' 
                }else{
                    alert("景点更新失败");
                }
            });
        }else{
            //添加
            var obj={
                _id:$("#_id").val(),
                title:$("#title").val(),
                info:$("#info").val(),
                content:CKEDITOR.instances.content.getData(),
                //favorite:$("#favorite").val(),
                recommend:false,
                coverImageId:$("#add-cover input").val(),
                voice:$("#add-voice input").val(),
                published:$("#published").prop("checked")
            }
            $.postJSON(urlData.scenic.add,obj,function(result){

                if(result.code === 1){
                    alert("景点添加成功");
                    //location.pathname = '/admin/scenicIntroduction' 
                }else{
                    alert("景点添加失败");
                }

            })
        }
    }); 
});