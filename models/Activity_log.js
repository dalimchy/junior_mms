const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create schema
const activiLogSchema = new Schema({
    log_id:{
        type:String,
        required:true
    },
    mess_id:{
        type:String,
        required:true
    },
    creator_id:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    log_data:{
        type:Object,
        required:true,
    },
    created_at:{
        type:Date,
        default:Date.now
    }

});



module.exports = mongoose.model('activity_log',activiLogSchema);