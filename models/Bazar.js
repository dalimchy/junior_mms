const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create schema
const bazarSchema = new Schema({
    bazar_id:{
        type:String,
        required:true
    },
    mess_id:{
        type:String,
        required:true
    },
    bazar_details:{
        type:String,
        default:''
    },
    total_amount:{
        type:String,
        required:true
    }, 
    assign_user_id:{
        type:String,
        required:true
    },
    creator_id:{
        type:String,
        required:true
    },
    day:{
        type:Number,
        required:true
    },
    month:{
        type:Number,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
    date_of_bazar:{
        type:String,
        default:Date.now
    },
    created_at:{
        type:Date,
        default:Date.now
    }

});



module.exports = mongoose.model('bazar',bazarSchema);