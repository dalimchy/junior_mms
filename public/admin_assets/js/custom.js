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


var allMonthReport = [];
$(function () {
    // sortable
    $(".sortable").sortable({
        connectWith: '.sortable',
        items: '.card-draggable',
        revert: true,
        placeholder: 'card-draggable-placeholder',
        forcePlaceholderSize: true,
        opacity: 0.77,
        cursor: 'move'
    });

    $.ajax({
        type: "POST",
        url: '/findAllMonthReport',
        data: '',
        success: function(res) {
            if(res.msg == 'success'){
              $.each(res.data,function(k,v){
                var design = '<option value="'+v.month_id+'"><a href="/monthly-calculation/'+v.month_id+'">'+moment(v.month+' '+v.year,'MM YYYY').format('MMMM YYYY')+'</a></option>';
                $('#changeMonthSelect').append(design);
                
              })
            }
        },
        error: function() {
            console.log('failed');
        }
    });
});

function toggleMsgBar(type){
    var wid = $('.side-bar.right-bar').width();
    console.log(wid);

    socket.emit('getMessUsers',{mess_id:mess_id},function(res){
        $('#convAllUserList').html('');
        $.each(res.data,function(k,v){
            if(user_id !== v.user_id){
                $('#convAllUserList').append(conv_listDesign(v));
                $.each(allUconv,function(ka,va){
                    if(va.participants.indexOf(v.user_id) > -1){
                        var totalumsg = 0;
                        $.each(allUmsg,function(km,vm){
                            if(vm.conversation_id == va.conversation_id){
                                totalumsg = totalumsg + 1;
                            }
                        });
                        if(totalumsg == 0 ){
                            $('.conv_list_user_'+v.user_id).find('.countunread').text('');
                        }else{
                            $('.conv_list_user_'+v.user_id).find('.countunread').text(totalumsg);
                        }
                    }
                });


            }
        });

        $('#msgContainer').hide();
        $('#convAllUserList').show();
        $('#Conv_list_label').show();
        if(type == 'open'){
            $('.side-bar.right-bar').css('right','0px');
            $('html').css('overflow','hidden');
        }else{
            $('.side-bar.right-bar').css('right','-400px');
            $('html').css('overflow','auto');
        }
    })
    
}

function conv_listDesign(data){
    var html = '<li class="list-group-item conv_list_user_'+data.user_id+'" onclick="startConversation(this)" user-id="'+data.user_id+'" user-name="'+data.user_name+'" user-img="'+data.user_img+'">';
        html +=     '<a href="javascript:void(0);" class="user-list-item">';
        html +=         '<div class="avatar" style="width:30px;height:30px;">';
        html +=             '<img style="width:100%;height:100%;" src="/admin_assets/images/users/'+data.user_img+'" alt="">';
        html +=             '<div class="user-activity-status user-status  '+((onlineUserList.indexOf(data.user_id) > -1 )? 'online':'offline') +' user_activity_'+data.user_id+'"><i class="zmdi zmdi-dot-circle"></i></div>';
        html +=         '</div>';
        html +=         '<div class="user-desc">';
        html +=             '<span class="name">'+data.user_name+'</span>';
        html +=             '<span class="desc">'+((data.user_role == 1)? 'Manageer':'Member')+'</span>';
        html +=         '</div>';
        html +=         '<a href="javascript:void(0);" style="top: 15px;right: 40px;position: absolute;">';
        html +=              '<span class="badge badge-danger countunread" style="font-size: 10px;" ></span>';
        html +=         '</a>';
        html +=     '</a>';
        html +='</li>';

        return html;
}
function hideMsgContainer(){
  $('#msgContainer').hide();
  $('#convAllUserList').show();
  $('#Conv_list_label').show();
}
var activeConversation_id = '';
function startConversation(ele){
    var data_user = $(ele).attr('user-id');
    var data_name = $(ele).attr('user-name');
    var data_img = $(ele).attr('user-img');
    if(data_user !== ''){
        var data = {
            participants:[user_id,data_user],
            mess_id :mess_id,
            conv_type:'personal',
            created_by:user_id
        }
        socket.emit('findConv_and_Messages',data,function(res){
            if(res.msg == 'success'){
                $('#userHeadLabelimg').attr('src','/admin_assets/images/users/'+data_img+'');
                $('#userHeadLabelName').text(data_name);
                $('#userHeadLabelActivity').attr('class', '');
                $('#userHeadLabelActivity').attr('class', 'font-13 text-muted m-b-0 '+((onlineUserList.indexOf(data_user) > -1 )? 'online':'offline') +' user_activity_'+data_user+'');
                $('#sendMsgUserImg').attr('src','/admin_assets/images/users/'+data_img+'');
                $('#sendMsgUserImg').attr('user-id',data_user);
                $('#msgBodyContainer').html('');
                $('#msgBodyContainer').attr('data-conv-id', res.conv_data.conversation_id);
                $('#userHeadLabelimg').attr('data-img', data_img)
                $('#msgBox').attr('data-conv-id', res.conv_data.conversation_id);
                activeConversation_id = res.conv_data.conversation_id;
                if(res.messages !== null){

                    $.each(res.messages, function(k,v){
                        $('#msgBodyContainer').append(drawMsg(v));
                    });
                }
                
                $('#convAllUserList').hide();
                $('#msgContainer').show();
                $('#msgBox').focus();
                $('#Conv_list_label').hide();
                var scrollHeight = $('#msgBodyContainer').get(0).scrollHeight;
                $('#msgBodyContainer').animate({ scrollTop: scrollHeight });

                var allUmsgId = []
                $.each(allUmsg,function(km,vm){
                    if(vm.conversation_id == res.conv_data.conversation_id){
                        allUmsgId.push(vm.msg_id);
                    }
                })

                socket.emit('msg_seen',{conversation_id:res.conv_data.conversation_id, msg_array:allUmsgId,receiver_id:user_id,type:'multiple'},function(redata){

                    var newUmsgCount = Number($('#allunreadMsgCount').text()) - allUmsgId.length;
                    if( newUmsgCount == 0){
                        $('#allunreadMsgCount').text('');
                    }else{
                         $('#allunreadMsgCount').text(newUmsgCount);
                    }
                  
                   $('.conv_list_user_'+data_user).find('.countunread').text('');

                    var lastUmsg = [];
                   $.each(allUmsg,function(kum,vum){
                        if(vum.conversation_id !== res.conv_data.conversation_id){
                            lastUmsg.push(vum);
                        }
                   });

                    allUmsg = lastUmsg;
                })
            }
        })
        
    }
}

function sendMsg(ele){
    var msg_body = $('#msgBox').html();
    var conv_id =  $('#msgBodyContainer').attr('data-conv-id');
    $('#msgBox').html("")

    var data = {
        msg_body:msg_body,
        conversation_id:activeConversation_id,
        sender_id:user_id,
        mess_id:mess_id,
        receiver_id: $('#sendMsgUserImg').attr('user-id'),
        sender_img:user_img,
        sender_name:user_name
    }
    socket.emit('sendNewMsg',data,function(res){
        if(res.msg == 'success')
            $('#msgBodyContainer').append(drawMsg(res.data));

            var scrollHeight = $('#msgBodyContainer').get(0).scrollHeight;
            $('#msgBodyContainer').animate({ scrollTop: scrollHeight });
    });
}

function drawMsg(msg){
    var html = '';
        html += '<div class="media m-b-5 m-t-5 '+((msg.sender_id == user_id)? 'right_user':'left_user')+'">';
        if(msg.sender_id !== user_id){

            html +=     '<div class=" '+((msg.sender_id == user_id)? 'media-right':'media-left')+'">';
            html +=         '<a href="#"> <img class="media-object img-circle thumb-sm user_img" alt="30x30" src="/admin_assets/images/users/'+((msg.sender_id == user_id)? user_img:$('#userHeadLabelimg').attr('data-img'))+'"> </a>';
            html +=     '</div>';
        }
        html +=     '<div class="media-body">';
        html +=         '<p class="font-13 text-muted m-b-0 '+((msg.sender_id == user_id)? 'msg_body_right':'msg_body_left')+'">'+msg.msg_body+'</p>';
        html +=     '</div>';
        html += '</div>';
    
        return html;                    
                        
}

function msgBoxKeyup(e,ele){
    var keyCode = 'which' in e ? e.which : e.keyCode;
    if(e.shiftKey && keyCode == 13){
        
    }else if(keyCode == 13){
        e.preventDefault();
        e.stopImmediatePropagation();
        $('#msgSendBtn').trigger('click');

    }
}
function msgboxkeydown(e,ele){
    var keyCode = 'which' in e ? e.which : e.keyCode;
    if(e.shiftKey && keyCode == 13){
       
    }else if(keyCode == 13){
        e.preventDefault();
        e.stopImmediatePropagation();

    }
}

socket.on('newMessage',function(message){
    console.log(message)
    if(message.sender_info.receiver_id == user_id){
        if($('#msgBodyLabel').is(':visible') && (activeConversation_id == message.sender_info.conversation_id)){
            if(message.msg == 'success')
                $('#msgBodyContainer').append(drawMsg(message.data));

                var scrollHeight = $('#msgBodyContainer').get(0).scrollHeight;
                $('#msgBodyContainer').animate({ scrollTop: scrollHeight });
                socket.emit('msg_seen',{conversation_id:message.sender_info.conversation_id, msg_id:message.data.msg_id,receiver_id:user_id,type:'single'},function(response){

                });

        }else{
            var oldUnread = Number($('#allunreadMsgCount').text());
            $('#allunreadMsgCount').text(oldUnread + 1);
            var oldtext = Number($('.conv_list_user_'+message.data.sender_id).find('.countunread').text());
            $('.conv_list_user_'+message.data.sender_id).find('.countunread').text(oldtext + 1);

            if(findConveForCheck(allUconv,'conversation_id',message.data.conversation_id)){

            }else{
                var conv_data = {
                    _id:'',
                    conv_title:'',
                    conv_type:'personal',
                    conversation_id:message.data.conversation_id,
                    created_at:'',
                    created_by:message.data.sender_id,
                    mess_id:message.data.mess_id,
                    participants:[user_id,message.data.sender_id]

                }

                allUconv.push(conv_data);
            }

            var msg_data = {
                _id:'',
                attach_img:null,
                conversation_id:message.data.conversation_id,
                created_at:'',
                has_delivered:0,
                mess_id:message.data.mess_id,
                msg_body:message.data.msg_body,
                msg_id: message.data.msg_id, 
                sender_id: message.data.sender_id 

            }

            allUmsg.push(msg_data);
            toastr.info("New message from "+message.sender_info.sender_name,"Message",{
                "timeOut": "2000",
                "extendedTImeout": "0",
                "closeButton" :true,
                "positionClass": "toast-bottom-right",
            });
        }
    }
});

function findConveForCheck(array,key,value){
    $.each(array,function(k,v){
        if(v.key == value){
            return true
        }
    });

    return false;
}


    var allUconv = [];
    var allUmsg = [];
    $(window).load(function() {
        // Animate loader off screen
        $("#pageLoader").fadeOut("slow");
        socket.emit('getUnreadMsg', {mess_id:mess_id,user_id:user_id},function(res){
            if(res.msg == 'success'){
                if(res.count == 0){

                    $('#allunreadMsgCount').text('');
                }else{

                    $('#allunreadMsgCount').text(res.count);
                }
                allUconv = res.uConv ;
                allUmsg = res.allUnreadMsg;
                console.log(439,res.allUnreadMsg)
            }
        })
    });