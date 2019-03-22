const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create schema
const messagesSchema = new Schema({
    conversation_id:{
        type:String,
        required:true
    },
    msg_id:{
        type:String,
        required:true
    },
    msg_body:{
        type:String,
        required:true
    },
    attach_img:{
        type:String,
        default:null
    },
    mess_id:{
        type:String,
        required:true
    },
    created_by:{
        type:String,
        required:true
    },
    has_delivered:{
        type:Number,
        default:0
    },
    created_at:{
        type:Date,
        default:Date.now
    }

});



module.exports = mongoose.model('messages',messagesSchema);