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
    Conversation.findOne({mess_id:data.mess_id,participants:{ "$all": data.participants },conv_type:data.conv_type},function(err,docs){
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
                Message.find({conversation_id:docs.conversation_id},function(err,allMsg){
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
var sendMessage = (data,callback)=>{
    var query = {
        msg_id:uuidv4(),
        conversation_id:data.conversation_id,
        msg_body:data.msg_body,
        mess_id:data.mess_id,
        sender_id:data.sender_id,
        created_at: new Date()
    }
    var newMsg =  new Message(query);

    newMsg.save().then(res =>{
        callback({msg:'success',data:query})
    })
    .catch(err => console.log(err));

}

var getAllunreadMsg=(data,callback)=>{
    Conversation.find({mess_id:data.mess_id,participants:{"$in": data.user_id}},function(err,docs){
        if(err){
            console.log(err);
        }else{
            console.log(docs);
            var allUnreadMsgCount = 0;
            var allUnreadMsg = [];
            var i = 0;
            _.each(docs,function(v,k){ i++ ;
                Message.find({conversation_id:v.conversation_id, has_delivered:0, sender_id:{ $ne: data.user_id }},function(err,uMsg){
                    if(err){
                        console.log(err);
                    }else{
                       allUnreadMsgCount = allUnreadMsgCount + Number(uMsg.length);
                        _.each(uMsg,function(v,k){
                            allUnreadMsg.push(v);

                            if(docs.length === i ){
                                callback({msg:'success',count:allUnreadMsgCount,allUnreadMsg:allUnreadMsg});
                            }
                        });
                    }
                })
            });
            // callback({msg:'success'})
        }
    })
}

module.exports = {
    findConv_and_Messages,
    sendMessage,
    getAllunreadMsg
};
