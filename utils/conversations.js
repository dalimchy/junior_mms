var express = require('express');
var router = express.Router();
const uuidv4 = require('uuid/v4');
var bcrypt = require('bcryptjs');
var _ = require('lodash');
const User = require('../models/Users');
const Mess = require('../models/Mess_info');
const Message = require('../models/Messages');
const Conversation = require('../models/Conversations');


var findConv_and_Messages = (data,callback)=>{
    Conversation.findOne({mess_id:data.mess_id,participants:data.participants,conv_type:data.conv_type},function(err,docs){
        if(err){
            console.log(err);
        }else{
            if(docs == null){
                var query = {
                    conversation_id:uuidv4(),
                    conv_type:'personal',
                    mess_id:data.mess_id,
                    created_by:data.created_by,
                    participants:data.participants
                }
                var newConv = new Conversation(query);
                newConv.save().then(res =>{
                    callback({msg:'success',type:'convNew',conv_data:query,messages:null})
                })
                .catch(err => console.log(err));
            }else{
                Message.findOne({conversation_id:docs.conversation_id},function(err,allMsg){
                    if(err){
                        console.log(err);
                    }else{
                        callback({msg:'success',type:'oldConv',conv_data:docs,messages:allMsg})
                    }
                })
            }
        }
    })
}

module.exports = {
    findConv_and_Messages
};
