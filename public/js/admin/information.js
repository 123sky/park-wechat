$(function () {

    //前端校验
    $("#info-form").validate();
    /*var validator = $("#info-form").validate({
        errorPlacement: function(error, element){
            // Append error within linked label
            $( element )
                .closest( "#info-form" )
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
    

    //提交表单
    $("#submit-btn").on('click',function(){
        if($("#info-form").valid() === false){
        }else
        if($("#_id").val()){
            //更新
            var newObj = {
                obj:{
                    id:$("#_id").val(),
                    title:$("#title").val(),
                    info:$("#info").val(),
                    content:CKEDITOR.instances.content.getData(),
                    recommend:false,
                    published:$("#published").prop("checked"),
                    coverImageId:$("#add-cover input").val(),
                },
                oldCoverImageId:$("#add-cover input").attr("data-old"),
            };
            $.postJSON(urlData.infor.edit,newObj,function(result){
                if(result.code === 1){
                    alert("信息更新成功");

                    //location.pathname = '/admin/information' 
                }else{
                    alert("信息更新失败");
                }
            });
        }else{
            //添加
            var obj={
                _id:$("#_id").val(),
                info:$("#info").val(),
                title:$("#title").val(),
                content:CKEDITOR.instances.content.getData(),
                recommend:false,
                published:$("#published").prop("checked"),
                coverImageId:$("#add-cover input").val(),
            }
            $.postJSON(urlData.infor.add,obj,function(result){
                if(result.code === 1){
                    alert("信息添加成功");
                    //location.pathname = '/admin/information' 
                }else{
                    alert("信息添加失败");
                }

            })
        }
    }); 
});