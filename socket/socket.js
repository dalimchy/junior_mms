var _ = require('lodash');
var moment = require('moment');
const nodemailer = require("nodemailer");

var {getMessUsers} = require('./../utils/users')
var {findConv_and_Messages,sendMessage,getAllunreadMsg,msgSeen} = require('./../utils/conversations');
var {getbydate,
    datebyBazar,
    addCateringMenuItem,
    findAllCatering,
    updateCatering
  } = require('./../utils/mess');

module.exports = function (io) {
  var app = require('express');
  var router = app.Router();

  io.on('connection', function (socket) {
    socket.join('1');

    socket.on('login', function (userdata) {
      socket.join('richIT-2019');
      socket.join(userdata.from);
      socket.handshake.session.userdata = userdata;
      socket.handshake.session.save();

      if (alluserlist.indexOf(userdata.from) != -1) {
        console.log(userdata.text + ' is connected into socket');
      } else {
        alluserlist.push(userdata.from);
        console.log(userdata.text + ' is connected into socket');
      }

      socket.emit('online_user_list', alluserlist); // this emit receive only who is login
      socket.broadcast.emit('new_user_notification', socket.handshake.session.userdata); // this emit receive all users except me
      console.log(38,alluserlist)
    });

    socket.on('disconnect', function () {
      console.log('disconnect*********************',socket.handshake.session.userdata);
      io.sockets.in('richIT-2019').emit('logout', { userdata: socket.handshake.session.userdata });
      if (socket.handshake.session.userdata) {
          alluserlist = alluserlist.filter(function (el) {
            return el !== socket.handshake.session.userdata.from;
          });
          delete socket.handshake.session.userdata;
          console.log(38,alluserlist)
          socket.handshake.session.save();
        }
    });



    // get mess all users data
    socket.on('getMessUsers',function(data,callback){
      getMessUsers(data,function(usr){
        if(usr.msg == 'success'){
          callback(usr);
        }else{
          console.log(usr);
        }
      })
    });


    socket.on('findConv_and_Messages',function(data,callback){
      findConv_and_Messages(data,function(res){
        if(res.msg == 'success'){
          callback(res);
        }else{
          console.log(res);
        }
      })
    });

    socket.on('sendNewMsg',function(data,callback){
      var receiver_id = data.receiver_id
      sendMessage(data,function(res){
        if(res.msg == 'success'){
          var resdata = res;
          res['sender_info'] = data;
          io.to(receiver_id).emit('newMessage', resdata);
          callback(res);
        }else{
          console.log(res);                                                                                                                                                                                                                                             
        }
      })
    });

    socket.on('getUnreadMsg',function(data,callback){
      getAllunreadMsg(data,function(res){
        if(res.msg == 'success'){
          callback(res);
        }else{
          console.log(res);
        }
      })
    });

    socket.on('msg_seen',function(data,callback){
      msgSeen(data,function(res){
        if(res.msg == 'success'){
          callback(res);
        }else{
          console.log(res);
        }
      })
    });

    socket.on('getDateBy_bazar',function(data,callback){
      datebyBazar(data, (response)=>{
        if (response.msg == 'success') {
          callback(response);
        }
      });
    });

    socket.on('getMealby_date',function(data,callback){
      getbydate(data, (response)=>{
        if (response.msg == 'success') {
          callback(response);
        }
      });
    });

    socket.on('addCateringMenuItem',function(data,callback){
      addCateringMenuItem(data,function(response){
        if(response.msg == 'success'){
          callback(response);
        }
      })
    });

    socket.on('getCatering',function(data,callback){
      findAllCatering(data,function(response){
        if(response.msg == 'success'){
          callback(response);
        }
      });
    });

    socket.on('updateCatering', function(data){
      updateCatering(data,function(response){
        if(response.msg == 'success'){
          console.log('success')
        }
      })
    })

    
  });
  return router;
}
