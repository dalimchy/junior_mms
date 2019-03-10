const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create schema
const usersSchema = new Schema({
    user_id:{
        type:String,
        required:true
    },
    mess_id:{
        type:String,
        required:true
    },
    user_role:{
        type:String,
        required:true
    },
    user_name:{
        type:String,
        required:true
    },
    user_email:{
        type:String,
        required:true
    },
    user_phone:{
        type:String,
        required:true
    },
    user_img:{
        type:String,
        required:true
    },
    account:{
        type:Number,
        default:0
    },
    user_password:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    }

});



module.exports = mongoose.model('users',usersSchema);