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
        required:true
    },
    total_amount:{
        type:String,
        required:true
    },
    assign_id:{
        type:String,
        required:true
    },
    bazar_date:{
        type:String,
        default:Date.now
    },
    created_at:{
        type:Date,
        default:Date.now
    }

});



module.exports = mongoose.model('bazar',bazarSchema);