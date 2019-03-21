var socket = io();
var onlineUserList = [];
/**
 * When connect event occured
 **/
socket.on('connect', function(){
    
  // emait the user as 'login' and send 'user_id' and 'user_fullname' which save into database
  // then update the database table field, that user is loged in by ajax calling.
  // console.log('client-socket 9 ', {from: user_id, text: user_fullname});
  socket.emit('login', {from: user_id, text: user_name });

  // logout emait received from server
  socket.on("logout", function(data) {
    removeA(onlineUserList,data.userdata.from);
    setInterval(function(){
        if(onlineUserList.indexOf(data.userdata.from) == -1){
            // console.log("logout ", data);
            $('.user_activity_'+data.userdata.from).addClass('offline').removeClass('online');
        }
    }, 10000);
  });

});
/* reconnect_attempt attempt */
socket.on('reconnect_attempt', () =>{
    socket.emit('has_login', function(res){
        if(! res){
            window.location.href="/";
        }
    });
});

/**
* after login,
* receive a welcome message with all online user lists, handled by socket.
**/
socket.on('online_user_list', function(message) {
  onlineUserList = [];
  $.each(message, function(k, v) {
    // console.log(v);
    onlineUserList.push(v);
    // $('.online_'+v).addClass('online').removeClass('offline');
    $('.user_activity_' + v).addClass('online').removeClass('offline');
  });
});


/**
* When a new user login,
* broadcast to other user, that someone joined.
* and user list marked as online
**/
socket.on('new_user_notification', function(notification) {
  if(onlineUserList.indexOf(notification.from) == -1){
      onlineUserList.push(notification.from);
  }
  $('.user_activity_' + notification.from).addClass('online').removeClass('offline');
});


/**
 * When disconnect event occured
 **/
socket.on('disconnect', function(){
    console.log('Disconnected');
});
