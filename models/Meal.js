const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create schema
const mealSchema = new Schema({
    meal_id:{
        type:String,
        required:true
    },
    mess_id:{
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
    lunch:{
        type:Number,
        default:0
    },
    dinner:{
        type:Number,
        default:0
    },
    breakfast:{
        type:Number,
        default:0
    },
    guest:{
        type:Number,
        default:0
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
    date_of_meal:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    }

});



module.exports = mongoose.model('meal',mealSchema);