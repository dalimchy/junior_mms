const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create schema
const monthlyReportSchema = new Schema({
    month_id:{
        type:String,
        required:true
    },
    mess_id:{
        type:String,
        required:true
    },
    month:{
        type:String,
        required:true
    },
    year:{
        type:String,
        required:true
    },
    info:{
        type:String,
        default:null
    },
    report:{
        type:Object,
        default:null
    },
    users:{
        type:Array,
        default:[]
    },
    status:{
        type:Number,
        default:0
    },
    created_at:{
        type:Date,
        default:Date.now
    }

});



module.exports = mongoose.model('monthly_report',monthlyReportSchema);