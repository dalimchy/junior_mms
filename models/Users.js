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
    status:{
        type:String,
        default:1
    },
    rich_it_approval:{
        type:Boolean,
        default:false
    },
    email_validation:{
        type:Boolean,
        default:false
    },
    validation_code:{
        type:Number,
        default:0
    },
    created_at:{
        type:Date,
        default:Date.now
    }

});



module.exports = mongoose.model('users',usersSchema);