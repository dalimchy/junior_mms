const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create schema
const catering_menuSchema = new Schema({
    catering_id:{
        type:String,
        required:true
    },
    menu_item:{
        type:Array,
        default:[]
    },
    mess_id:{
        type:String,
        required:true
    },
    day_name:{
        type:Array,
        default:['Saturday','Sunday','Monday','Tuesday','Wednesday','Thusday','Friday']
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
    created_at:{
        type:Date,
        default:Date.now
    }

});



module.exports = mongoose.model('catering_menu',catering_menuSchema);