$(functoin (){

	//提交表单
    $("#submit-btn").on('click',function(){

        if($("#_id").val()){
            //更新
            var newObj = {
                obj:{
                    username:$("#username").val(),
                    password:$("#password").val(),
                },
                id:$("#_id").val(),
             
            };
            var delImage = $("#img-preview .image-item.hide");
            $.each(delImage,function(i,n){
                newObj.oldDelImage.push($(n).attr("data-id"));
            });
            console.log(newObj);
            $.postJSON(urlData.users.edit,newObj,function(result){
                if(result.code === 1){
                    alert("用户信息更新成功");

                    //location.pathname = '/admin/users/' 
                }else{
                    alert("用户信息更新失败");
                }
            });
        }else{
            //添加
            var obj={
                _id:$("#_id").val(),
                username:$("#username").val(),
                password:$("#password").val(),
            }
            console.log(obj);
            $.postJSON(urlData.users.add,obj,function(result){
                console.log(obj);
                console.log(urlData.users.add);

                if(result.code === 1){
                    alert("用户信息添加成功");
                    //location.pathname = '/admin/users/' 
                }else{
                    alert("用户信息添加失败");
                }

            })
        }
    }); 
})