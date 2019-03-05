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
    assign_member_id:{
        type:String,
        required:true
    },
    creator_id:{
        type:String,
        required:true
    },
    meal:{
        type:Number,
        default:0
    },
    date_of_meal:{
        type:String,
        default:Date.now
    },
    created_at:{
        type:Date,
        default:Date.now
    }

});



module.exports = mongoose.model('meal',mealSchema);