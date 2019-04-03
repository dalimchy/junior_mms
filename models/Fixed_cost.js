const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create schema
const fixedCostSchema = new Schema({
    fixed_cost_id:{
        type:String,
        required:true
    },
    mess_id:{
        type:String,
        required:true
    },
    house_rent:{
        type:Number,
        default:0
    },
    electricity_bill:{
        type:Number,
        default:0
    },
    gas_bill:{
        type:Number,
        default:0
    },
    water_bill:{
        type:Number,
        default:0
    },
    garbage_bill:{
        type:Number,
        default:0
    },
    chef_bill:{
        type:Number,
        default:0
    },
    internet_bill:{
        type:Number,
        default:0
    },
    others:{
        type:Number,
        default:0
    },
    created_at:{
        type:Date,
        default:Date.now
    }

});



module.exports = mongoose.model('fixed_cost',fixedCostSchema);