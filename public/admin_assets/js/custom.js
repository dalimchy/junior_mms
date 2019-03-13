function selectMenuIcon(ele){
    var value = $(ele).find('i').attr('class');
    $('#menuIconName').val(value);
    $('#v_s_i').html('<i class="'+value+'" ></i>');
    $('#v_s_i').show();
    Custombox.close();
}

function selectIcon(ele,type){
    var value = $(ele).find('i').attr('class');
    if(type == 'category'){
        $('#category_icon_holder i').attr('class', value);
        $('#category_icon_holder').css('visibility', 'visible');
        $('#category_icon').val(value)
        Custombox.close();
    }
}

function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

function update_appear(ele,type){
    if(type == 'status'){
        if($(ele).attr('data-status') == 'active'){
            var data = {type:"status",id:$(ele).parent('td').attr('data-id'),value:0}
            appearance_update(data);
            $(ele).removeClass('btn-success').addClass('btn-danger').attr('data-status', 'inactive').text('In-Active');
        }else{
            var data = {type:"status",id:$(ele).parent('td').attr('data-id'),value:1}
            appearance_update(data)
            $(ele).removeClass('btn-danger').addClass('btn-success').attr('data-status', 'active').text('Active');
        }
    }
}


function appearance_update(data){
    $.ajax({
        type: "POST",
        url: '/dashboard/appearance_update',
        data: data,
        error: function() {
            return false;
         },
         success: function(res) {
             if(res.msg == 'success'){
                 return true;
            }
        }
    });
}
function category_update(data){
    $.ajax({
        type: "POST",
        url: '/dashboard/category_update',
        data: data,
        error: function() {
            return false;
         },
         success: function(res) {
             if(res.msg == 'success'){
                 return true;
            }
        }
    });
}

function appearance_delete(ele){
    var dataid = $(ele).parent('td').attr('data-id')
    $.ajax({
        type: "POST",
        url: '/dashboard/appearance_delete',
        data: {id:dataid},
        error: function() {
            console.log('failed');
         },
         success: function(res) {
             if(res.msg == 'success'){
                 $('#_menu'+dataid).remove();
                 $('#_slider'+dataid).remove();
            }
        }
    });
}

function category_delete(ele){
    var dataid = $(ele).parent('td').attr('data-id')
    $.ajax({
        type: "POST",
        url: '/dashboard/category_delete',
        data: {id:dataid},
        error: function() {
            console.log('failed');
         },
         success: function(res) {
             if(res.msg == 'success'){
                 $('#_main_cate'+dataid).remove();
            }
        }
    });
}


function update_category(ele,type){
    if(type == 'status'){
        if($(ele).attr('data-status') == 'active'){
            var data = {type:"status",id:$(ele).parent('td').attr('data-id'),value:0}
            category_update(data);
            $(ele).removeClass('btn-success').addClass('btn-danger').attr('data-status', 'inactive').text('In-Active');
        }else{
            var data = {type:"status",id:$(ele).parent('td').attr('data-id'),value:1}
            category_update(data);
            $(ele).removeClass('btn-danger').addClass('btn-success').attr('data-status', 'active').text('Active');
        }
    }
}

function changeProductStatus(ele){
    var id = $(ele).parent('td').attr('data-id');
    var action = $(ele).attr('data-status');

    if(action == 'active'){

        $.ajax({
            type: "POST",
            url: '/dashboard/changeProductStatus',
            data: {id:id,status:0},
             success: function(res) {
                 if(res.msg == 'success'){
                     $(ele).removeClass('btn-success').addClass('btn-danger').attr('data-status', 'inactive').text('In-Active');
                }
            },
            error: function() {
                console.log('failed');
            }
        });
    }else{

        $.ajax({
            type: "POST",
            url: '/dashboard/changeProductStatus',
            data: {id:id,status:1},
            success: function(res) {
                if(res.msg == 'success'){
                     $(ele).removeClass('btn-danger').addClass('btn-success').attr('data-status', 'active').text('Active');
                }
            },
            error: function() {
                console.log('failed');
            }
        });

    }

}