$(function () {

    //前端校验
    var validator = $("#service-form").validate({
        errorPlacement: function(error, element){
            // Append error within linked label
            $( element )
                .closest( "#service-form" )
                    .find( "label" )
                        .append( error );
        },
        errorElement: "h",
    });
    //富文本编辑器
    if (typeof CKEDITOR !== 'undefined') {
        CKEDITOR.replace('content');
    }

    //封面图片
    chooseImg.init($("#add-cover"));

    //提交表单
    $("#submit-btn").on('click',function(){
        if($("#service-form").valid() === false){

        }else
        if($("#_id").val()){
            //更新
            var newObj = {
                obj:{
                    title:$("#title").val(),
                    info:$("#info").val(),
                    type:$("#type").val(),
                    content:CKEDITOR.instances.content.getData(),
                    recommend:false,
                    published:$("#published").prop("checked")
                },
                id:$("#_id").val(),
                file:fileArray,
                oldDelImage:[]
            };
            var delImage = $("#img-preview .image-item.hide");
            $.each(delImage,function(i,n){
                newObj.oldDelImage.push($(n).attr("data-id"));
            });
            console.log(newObj);
            $.postJSON(urlData.service.edit,newObj,function(result){
                if(result.code === 1){
                    alert("信息更新成功");

                    //location.pathname = '/admin/parkService' 
                }else{
                    alert("信息更新失败");
                }
            });
        }else{
            //添加
            var obj={
                _id:$("#_id").val(),
                info:$("#info").val(),
                type:$("#type").val(),
                title:$("#title").val(),
                content:CKEDITOR.instances.content.getData(),
                published:$("#published").prop("checked"),
                coverImageId:$("#add-cover input").val(),
            }
            $.postJSON(urlData.service.add,obj,function(result){
                if(result.code === 1){
                    alert("信息添加成功");
                    //location.pathname = '/admin/parkService' 
                }else{
                    alert("信息添加失败");
                }

            })
        }
    }); 
});