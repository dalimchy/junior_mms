const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create schema
const catering_menuSchema = new Schema({
    menu_id:{
        type:String,
        required:true
    },
    menu_name:{
        type:String,
        required:true
    },
    mess_id:{
        type:String,
        required:true
    },
    day_name:{
        type:Array,
        default:[1,2,3,4,5,6,7]
    },
    breakfast:{
        type:Array,
        default:[]
    },
    lunch:{
        type:Array,
        default:[]
    },
    dinner:{
        type:Array,
        default:[]
    },
    status:{
        type:Number,
        default:1
    },
    created_at:{
        type:Date,
        default:Date.now
    }

});



module.exports = mongoose.model('catering_menu',catering_menuSchema);