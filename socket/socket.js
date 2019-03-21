var _ = require('lodash');
var moment = require('moment');
const nodemailer = require("nodemailer");

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
      console.log('disconnect*********************',socket.handshake.session.userdata.text);
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
  });
  return router;
}
