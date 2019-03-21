var _ = require('lodash');
var moment = require('moment');
const nodemailer = require("nodemailer");

module.exports = function (io) {
  var app = require('express');
  var router = app.Router();

  io.on('connection', function (socket) {
    socket.join('1');

    socket.on('login', function (userdata) {
      console.log('Socket Connected:',userdata)
      socket.join('richIT-2019');
      socket.join(userdata.from);
      socket.handshake.session.userdata = userdata;
      socket.handshake.session.save();
      
    });

    socket.on('disconnect', function () {
      console.log('disconnect*********************',socket.handshake.session.confdata);
      if(socket.handshake.session.userdata){
        console.log(22,'socket.js',socket.handshake.session.userdata);
      }else{
        io.sockets.in('richIT-2019').emit('logout', { userdata: socket.handshake.session.userdata });
        if (socket.handshake.session.userdata) {
          delete socket.handshake.session.userdata;
          socket.handshake.session.save();
        }
      }
      
    });
  });
  return router;
}
