$(function () {

    //前端校验
    $("#scenic-form").validate();
    //富文本编辑器
    if (typeof CKEDITOR !== 'undefined') {
        CKEDITOR.replace('content');
    }

    //封面图片
    chooseImg.init($("#add-cover"));


    //提交表单
    $("#submit-btn").on('click',function(){

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
                favorite:$("#favorite").val(),
                published:$("#published").prop("checked"),
                file:fileArray
            }
            console.log(obj);
            $.postJSON(urlData.scenic.add,obj,function(result){
                console.log(obj);
                console.log(urlData.scenic.add);

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