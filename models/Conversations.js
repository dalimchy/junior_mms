const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create schema
const conversationSchema = new Schema({
    conversation_id:{
        type:String,
        required:true
    },
    conv_type:{
        type:String,
        required:true
    },
    conv_title:{
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
    participants:{
        type:Array,
        default:[]
    },
    created_at:{
        type:Date,
        default:Date.now
    }

});



module.exports = mongoose.model('conversations',conversationSchema);