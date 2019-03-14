var express = require('express');
var router = express.Router();
const uuidv4 = require('uuid/v4');
var bcrypt = require('bcryptjs');
var _ = require('lodash');
const User = require('../models/Users');
const Mess = require('../models/Mess_info');

var salt = bcrypt.genSaltSync(10);

var newManager =(data,callback)=>{
    var mess_id = uuidv4();
    var user_id = uuidv4();
    var messData = {
        mess_id:mess_id,
        mess_name : data.mess_name
    }
    var newMess = new Mess(messData);
    Mess.findOne({mess_name:data.mess_name}, function(error,docs){
        if(error){
            console.log(error);
        }else{
            if(docs == null){
                newMess.save().then(res =>{
                    var hash = bcrypt.hashSync(data.user_password, salt);
                    var userdata = {
                        user_id: user_id,
                        mess_id: messData.mess_id,
                        user_name: data.user_name,
                        user_email : data.user_email,
                        user_phone : data.user_phone,
                        user_img : data.user_img,
                        user_role : 1,
                        user_password : hash
                    }
                    var newUser = new User(userdata);
                    User.findOne({user_email:userdata.user_email}, function (err, result) {
                        if(err){
                            console.log(err)
                        }else{
                            if(result == null){
                                newUser.save().then(res =>{
                                    callback({msg:'success',data:userdata});
                                })
                                .catch(err => console.log(err));
                            }else{
                                callback({msg:'Email already exist.', data:null});
                            }
                
                        }
                    });
                })
                .catch(err => console.log(err));
            }else{
                callback({msg:'Is mess already exist.', data:null});
            }
        }
    });
}

var loginCheck = (data,callback)=>{
    User.findOne({user_email:data.user_email}, function (err, result) {
        if(err){
            console.log(err);
        }else{
            if(result == null){
                callback({msg:'Email does not exist.'});
            }else{
                bcrypt.compare(data.user_password, result.user_password, function(err, res) {
                    if(err){
                        console.log(err);
                    }else{
                        if(res == true){
                            var data ={
                                user_id:result.user_id,
                                user_name:result.user_name,
                                user_email:result.user_email,
                                user_img:result.user_img,
                                mess_id:result.mess_id,
                                user_role:result.user_role
                            }
                            callback({msg:'success',data});
                        }else{
                            callback({msg:'Password does not match.'})
                        }
                    }
                });
            }
        }
    });
}

var messCheck = (data,callback)=>{
    Mess.findOne({mess_id:data.mess_id}, function (err, result) {
        if(err){
            console.log(err);
        }else{
            if(result == null){
                callback({msg:'Mess does not exist.'});
            }else{
                callback({msg:'success',mess_name:result.mess_name});
            }
        }
    });

}


var newMember = (data,callback)=>{
    var hash = bcrypt.hashSync(data.user_password, salt);
    var user_id = uuidv4();
    var userdata = {
        user_id: user_id,
        mess_id: data.mess_id,
        user_name: data.user_name,
        user_email : data.user_email,
        user_phone : data.user_phone,
        user_img : data.user_img,
        user_role : 2,
        user_password : hash
    }
    var newUser = new User(userdata);
    User.findOne({user_email:userdata.user_email}, function (err, result) {
        if(err){
            console.log(err)
        }else{
            if(result == null){
                newUser.save().then(res =>{
                    callback({msg:'success',data:userdata});
                })
                .catch(err => console.log(err));
            }else{
                callback({msg:'Email already exist.', data:null});
            }

        }
    });
}

var updateAccount = (data,callback)=>{
    console.log(data);
    User.updateOne({user_id:data.assign_user_id},{$inc: { account: data.total_amount}},function(err,result){
        if(err){
            console.log(err);
        }else{
             callback({msg:'success'});
        }
    })
}

var addPayment = (data,callback)=>{
    User.updateOne({user_id:data.payment_user_id},{$inc: { account: data.amount}},function(err,result){
        if(err){
            console.log(err);
        }else{
             callback({msg:'success'});
        }
    })
}

var updateMemberAccount = (data,callback)=>{
    var i = 0;
    _.each(data.data, function(v,k){i++;
        User.updateOne({user_id:v.user_id},{$inc: { account: - v.cost}},function(err,result){
            if(i == data.data.length){
                callback({msg:'success'});
            }
        })
    });
}


module.exports = {
    newManager,
    loginCheck,
    messCheck,
    newMember,
    updateAccount,
    addPayment,
    updateMemberAccount
};
