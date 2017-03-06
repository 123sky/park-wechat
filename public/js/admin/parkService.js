$(function () {

    //富文本编辑器
    if (typeof CKEDITOR !== 'undefined') {
        CKEDITOR.replace('content');
    }

    var fileArray = [];
    //图片文件上传
    $("#image").uploadFile({
        url:"/fileupload1/",
        fileName:"imageFile",
        preview:true,
        allowedTypes : 'gif,jpg,png',
        acceptFiles:'gif,jpg,png',
        allowDuplicates:false,
        multiple:true,
        dragDrop:true,
        showDownload:false,
        showDelete: true,
        maxFileSize : 52428800,
        statusBarWidth:600,
        dragdropWidth:600,
        onSuccess: function (files, response, xhr, pd) {
            //console.log(response);
            for(var i=0;i<response.length;i++){
                fileArray.push(response[i]);
            }

            for(var i=0;i<pd.preview.length;i++){
                $(pd.preview[i]).attr('src',location.origin+'/uploads/image/'+response[i].filename);
            }
        },
        deleteCallback: function (data, pd) {
            removeFile(data,pd);
        }
    });

    //音频文件上传
    

    //修改时移除旧的图片
    $("#img-preview").on('click','.remove-image',function(){
        $(this).parent().parent().addClass('hide');
    });

    //移除文件
    function removeFile(data,pd){
        for (var i = 0; i < data.length; i++) {

            refreshFileArray (data[i].filename);

            file = {path:data[i].destination+data[i].filename}
            $.postJSON(urlData.route.delFile,file,function(data){
                if(data.code !== 1){
                    alert("移除文件出错");
                }else{
                    pd.statusbar.hide();
                }
            })
        }
    }

    //更新文件数组
    function refreshFileArray (delFileName){
        var newFileArray = []
        for(var j=0;j<fileArray.length;j++){
            if(delFileName !== fileArray[j].filename) {
                newFileArray.push(fileArray[j]);
            }
        }
        fileArray = newFileArray;
    }

    //提交表单
    $("#submit-btn").on('click',function(){

        if($("#_id").val()){
            //更新
            var newObj = {
                obj:{
                    title:$("#title").val(),
                    info:$("#info").val(),
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
                title:$("#title").val(),
                content:CKEDITOR.instances.content.getData(),
                published:$("#published").prop("checked"),
                file:fileArray
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