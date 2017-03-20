$(function () {

    //前端校验
    $("#route-form").validate();
    //富文本编辑器
    if (typeof CKEDITOR !== 'undefined') {
        CKEDITOR.replace('content');
    }

    //封面图片
    chooseImg.init($("#add-cover"));

    //提交表单
    $("#submit-btn").on('click',function(){
        if($("#route-form").valid() === false){

        }else
        if($("#_id").val()){
            //更新
            var newObj = {
                obj:{
                    title:$("#title").val(),
                    info:$("#info").val(),
                    content:CKEDITOR.instances.content.getData(),
                    favorite:$("#favorite").val(),
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
            $.postJSON(urlData.route.edit,newObj,function(result){
                if(result.code === 1){
                    alert("路线更新成功");

                    //location.pathname = '/admin/routeRecommend' 
                }else{
                    alert("路线更新失败");
                }
            });
        }else{
            //添加
            var obj={
                _id:$("#_id").val(),
                title:$("#title").val(),
                info:$("#info").val(),
                content:CKEDITOR.instances.content.getData(),
                favorite:$("#favorite").val(),
                published:$("#published").prop("checked"),
                file:fileArray
            }
            $.postJSON(urlData.route.add,obj,function(result){
                if(result.code === 1){
                    alert("路线添加成功");
                    //location.pathname = '/admin/routeRecommend' 
                }else{
                    alert("路线添加失败");
                }

            })
        }
    }); 
});