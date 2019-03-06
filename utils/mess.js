var express = require('express');
var router = express.Router();
const uuidv4 = require('uuid/v4');
var bcrypt = require('bcryptjs');

const User = require('../models/Users');
const Mess = require('../models/Mess_info');

var salt = bcrypt.genSaltSync(10);

var findAllMember = (data,callback)=>{
    User.find({mess_id:data.mess_id}, function (err, result) {
        if(err){
            console.log(err)
        }else{
            callback({msg:'success',data:result});
        }
    });
}
module.exports = {findAllMember};
