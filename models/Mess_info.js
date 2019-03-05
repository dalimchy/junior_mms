const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create schema
const mess_infoSchema = new Schema({
    mess_id:{
        type:String,
        required:true
    },
    mess_name:{
        type:String,
        required:true
    },
    house_name:{
        type:String,
        default:null
    },
    house_address:{
        type:String,
        default:null
    },
    contact_info:{
        type:String,
        default:null
    },
    created_at:{
        type:Date,
        default:Date.now
    }

});



module.exports = mongoose.model('mess_info',mess_infoSchema);