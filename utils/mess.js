var express = require('express');
var router = express.Router();
const uuidv4 = require('uuid/v4');
var bcrypt = require('bcryptjs');

const User = require('../models/Users');
const Mess = require('../models/Mess_info');
const Meal = require('../models/Meal');
const Bazar = require('../models/Bazar');

var salt = bcrypt.genSaltSync(10);

var findAllMember = (data,callback)=>{
    User.find({mess_id:data.mess_id}, function (err, result) {
        if(err){
            console.log(err)
        }else{
            callback({msg:'success',data:result});
        }
    });
}

var addMeal = (data,callback)=>{
	Meal.findOne({mess_id:data.mess_id,assign_user_id:data.assign_user_id,day:data.day,month:data.month,year:data.year}, function (err, result) {
        if(err){
            console.log(err)
        }else{

            if(result == null){
            	var newMeal = new Meal(data);
				newMeal.save().then(res =>{
			        callback({msg:'success',data:data});
			    })
			    .catch(err => console.log(err));
            }else{
            	Meal.updateOne({meal_id:result.meal_id},{breakfast:data.breakfast,lunch:data.lunch,dinner:data.dinner,guest:data.guest},function(err,result2){
            		if(err){
            			console.log(err);
            		}else{
            			callback({msg:'update',data:data});
            		}
            	})
            }
        }
    });
	
}
var addBazar = (data,callback)=>{
	var newBazar = new Bazar(data);
		newBazar.save().then(res =>{
			callback({msg:'success',data:data});
		})
		.catch(err => console.log(err));
	
}
var findTodayMeal = (data,callback)=>{
	Meal.find(data,function(err,result){
		if(err){
			console.log(err);
		}else{
			callback({msg:'success',data:result});
		}
	})
}
var findThisMonthMeal = (data,callback)=>{
	Meal.find(data,function(err,result){
		if(err){
			console.log(err);
		}else{
			callback({msg:'success',data:result});
		}
	})
}
var findTodayBazar = (data,callback)=>{
	Bazar.find(data,function(err,result){
		if(err){
			console.log(err);
		}else{
			callback({msg:'success',data:result});
		}
	})
}
var findThisMonthBazar = (data,callback)=>{
	Bazar.find(data,function(err,result){
		if(err){
			console.log(err);
		}else{
			callback({msg:'success',data:result});
		}
	})
}

var getbydate = (data,callback)=>{
	Meal.find(data, function (err,result) {
		if (err) {
			console.log(err);
		} else {
			callback({msg: 'success',data: result});
		}
	});
}

module.exports = {
	findAllMember,
	addMeal,
	findTodayMeal,
	findTodayBazar,
	addBazar,
	findThisMonthMeal,
	findThisMonthBazar,
	getbydate
};
