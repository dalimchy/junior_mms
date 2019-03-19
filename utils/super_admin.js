var express = require('express');
var router = express.Router();
const uuidv4 = require('uuid/v4');
var bcrypt = require('bcryptjs');
var _ = require('lodash');
const User = require('../models/Users');
const Mess = require('../models/Mess_info');

var findAllManager =(callback)=>{
    User.find({user_role:1},function(err,result){
        if(err){
            console.log(err);
        }else{
             callback({msg:'success',data:result});
        }
    });
}

var findAllMess =(callback)=>{
    Mess.find(function(err,result){
        if(err){
            console.log(err);
        }else{
            callback({msg:'success',data:result});
        }
    });
}

var updateUser = (data,callback)=>{
    var rich_it_approval;
    if(data.type == 1){
        rich_it_approval = true
    }else{
        rich_it_approval = false
    }
    User.findOneAndUpdate({user_id:data.user_id},{rich_it_approval:rich_it_approval},function(err,result){
        if(err){
            console.log(err)
        }else{
            callback({msg:'success'});
        }
    })
}

module.exports = {
    findAllManager,
    findAllMess,
    updateUser
};
