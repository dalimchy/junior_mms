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
            var alldocsid = [];
            _.each(docs,function(v,k){
                alldocsid.push(v.conversation_id);
            })
            Message.find({conversation_id:{$in: alldocsid}, has_delivered:0, sender_id:{ $ne: data.user_id }},function(err,umsg){
                if(err){
                    console.log(err);
                }else{
                   callback({msg:'success',count:umsg.length,allUnreadMsg:umsg,uConv:docs});
                }
            })
            // callback({msg:'success'})
        }
    })
}

var msgSeen = (data,callback)=>{
    if(data.type == 'single'){
        Message.updateOne({msg_id:data.msg_id},{has_delivered:1},function(err,umsg){
            if(err){
                console.log(err);
            }else{
                callback({msg:'success'});
            }
        });

    }else{
        _.each(data.msg_array,function(v,k){
            Message.updateOne({msg_id:v},{has_delivered:1},function(err,umsg){
                if(err){
                    console.log(err);
                }else{
                    if(data.msg_array.length == k +1 ){
                        callback({msg:'success'});
                    }
                }
            });
        });
    }
}

module.exports = {
    findConv_and_Messages,
    sendMessage,
    getAllunreadMsg,
    msgSeen
};
