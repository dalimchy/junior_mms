var express = require('express');
var router = express.Router();
const uuidv4 = require('uuid/v4');
var bcrypt = require('bcryptjs');

const User = require('../models/Users');
const Mess = require('../models/Mess_info');
const Meal = require('../models/Meal');
const Bazar = require('../models/Bazar');
const FixedCost = require('../models/Fixed_cost');
const ActivityLog = require('../models/Activity_log');
const MonthlyReport = require('../models/Monthly_report');
const CateringMenu = require('../models/Catering_menu');

var {
	updateAccount,
	deleteAmount
} = require('./../utils/users');

var salt = bcrypt.genSaltSync(10);


var findMonthlyReport = (data,callback)=>{
	MonthlyReport.findOne(data,function(err,result){
		if(err){
			console.log(err);
		}else{
			if(result == null){
				var qvalue = {
					month_id:uuidv4(),
					mess_id:data.mess_id,
					month:data.month,
					year:data.year,
					status:0
				}
				var newMonth = new MonthlyReport(qvalue);
				newMonth.save().then(res =>{
			        callback({msg:'success',data:qvalue});
			    })
			    .catch(err => console.log(err));
			}else{
				callback({msg:'success',data:result});
			}
		}
	});
}

var findAllMember = (data,callback)=>{
    User.find({mess_id:data.mess_id}, function (err, result) {
        if(err){
            console.log(err)
        }else{
            callback({msg:'success',data:result});
        }
    });
}

var deactiveUser = (data, callback)=>{
	User.updateOne({user_id:data.id},{status: 0}, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			result['status'] = 0;
			callback({msg:'success',data:result});
		}
	});
}
var activeUser = (data, callback)=>{
	User.updateOne({user_id:data.id},{status: 1}, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			result['status'] = 1;
			callback({msg:'success',data:result});
		}
	});
}

var findAllActiveMembers = (data,callback)=>{
    User.find({mess_id:data.mess_id,status:1}, function (err, result) {
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
	updateAccount(data,function(res){
		if(res.msg == 'success'){
		var newBazar = new Bazar(data);
			newBazar.save().then(res =>{
				callback({msg:'success',data:data});
			})
			.catch(err => console.log(err));
		}
	})
}

var datebyBazar = (data,callback)=>{
	Bazar.find(data, function (err,result) {
		if (err) {
			console.log(err);
		} else {
			callback({msg: 'success',data: result});
		}
	});
}

// var updateBazar = (data, callback)=>{
// 	Bazar.findOneAndUpdate({bazar_id:data.bazar_id},{bazar_details:data.details,total_amount:data.amount}, function (err, result) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			callback({msg: 'success'});
// 		}
// 	});
// }

var updateBazar = (data, callback)=>{
	Bazar.findOne({bazar_id:data.bazar_id}, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			var b = result.total_amount;
			var c = data.amount;
			var d = c - b;
			data['total_amount'] = d
			updateAccount(data, function (res) {
				if (res.msg == 'success') {
					Bazar.updateOne({bazar_id:data.bazar_id},{bazar_details:data.details,total_amount:data.amount,created_at:data.c_time}, function (err, result) {
						if (err) {
							console.log(err);
						} else {
							callback({msg: 'success'});
						}
					});
				}
			});
		}
	});
}

var deleteBazar = (data, callback)=>{
	Bazar.deleteOne({bazar_id:data.id}, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			deleteAmount(data, function (res) {
				if (res.msg == 'success') {
					callback({msg: 'success'})
				}
			});
		}
	});
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
	Bazar.find(data).sort({created_at: 'desc'}).exec(function(err,result){
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

var findFixedCost = (data,callback)=>{
	FixedCost.findOne(data,function(err,docs){
		if(err){
			console.log(err);
		}else{
			if(docs == null){
				var resData ={
					fixed_cost_id :uuidv4(),
					mess_id :data.mess_id,
					house_rent :0,
					electricity_bill :0,
					gas_bill :0,
					water_bill :0,
					garbage_bill :0,
					chef_bill :0,
					internet_bill :0,
					others :0
				}
				new FixedCost(resData).save().then(res =>{
			        callback({msg:'success',data:resData});
			    })
			    .catch(err => console.log(err));

			}else{
				callback({msg:'success',data:docs});
			}
		}
	});
}

var updateFixedCost =(data,callback)=>{
	var updateValue = {
		house_rent:data.house_rent,
		electricity_bill:data.electricity_bill,
		gas_bill:data.gas_bill,
		water_bill:data.water_bill,
		garbage_bill:data.garbage_bill,
		chef_bill:data.chef_bill,
		internet_bill:data.internet_bill,
		others:data.others
	}
	var olddata =  JSON.parse(data.old_fixed_cost);
	FixedCost.updateOne({fixed_cost_id:data.fixed_cost_id},updateValue,function(err,result){
        if(err){
            console.log(err);
        }else{
			var logData = {
				log_id:uuidv4(),
				mess_id:olddata.mess_id,
				creator_id:data.user_id,
				type:'fixed_cost',
				day:data.day,
				month:data.month,
				year:data.year,
				log_data:olddata
			}
			new ActivityLog(logData).save().then(res =>{
			        callback({msg:'success'});
			    })
			    .catch(err => console.log(err));
        }
    })

}

var addPaymentLog = (data,callback)=>{
	var logData = {
		log_id:uuidv4(),
		mess_id:data.mess_id,
		creator_id:data.creator_id,
		type:'payment',
		day:data.day,
		month:data.month,
		year:data.year,
		log_data:{
			payment_info:data.pay_info,
			payment_user_id:data.payment_user_id,
			amount:data.amount
		}
	}
	new ActivityLog(logData).save().then(res =>{
			callback({msg:'success'});
	})
	.catch(err => console.log(err));
}

var deletePayment = (data, callback)=>{
	ActivityLog.deleteOne({log_id:data.id,type:data.type}, function (err, result) {
		if (err) {
			console.log(err)
		} else {
			deleteAmount(data, function (res) {
				if (res.msg == 'success') {
					callback({msg: 'success'})
				}
			});
		}
	});
}

var findLog = (data,callback)=>{
	ActivityLog.find(data).sort({created_at: 'desc'}).exec(function (err, result){
		if(err){
			console.log(err);
		}else{
			callback({msg:'success',data:result});
		}
	})
}

var findMonthlyReportOne = (data,callback)=>{
	MonthlyReport.findOne(data).sort({created_at: 'desc'}).exec(function (err, result){
		if(err){
			console.log(err);
		}else{
			callback({msg:'success',data:result});
		}
	})
}


var monthlyReportClose = (data,callback)=>{
	FixedCost.findOne({mess_id:data.mess_id},function(err,docs){
		if(err){
			console.log(err);
		}else{
			var fixed_cost = {
				fixed_cost:docs
			}
			data.updateQuery['report'] = fixed_cost;
			MonthlyReport.updateOne({month_id:data.month_id},data.updateQuery, function (err, result){
				if(err){
					console.log(err);
				}else{
					callback({msg:'success',data:result});
				}
			})
		}
	})
}

var findAllCatering = (data,callback)=>{
	CateringMenu.findOne({mess_id:data.mess_id},function(err,docs){
		if(err){
			console.log(err);
		}else{
			callback({msg:'success',data:docs});
		}
	})
}

var addCateringMenuItem = (data,callback)=>{
	CateringMenu.findOne({mess_id:data.mess_id},function(err,docs){
		if(err){
			console.log(err);
		}else{
			if(docs !== null){
				CateringMenu.updateOne({catering_id:docs.catering_id},{$push:{menu_item: data.menu_item}},function(err1,result1){
					if(err1){
						console.log(err1);
					}else{
						callback({msg:'success',data:'old'});
					}
				});
			}else{
				var insertData = {
					catering_id : uuidv4(),
					menu_item:[data.menu_item],
					mess_id:data.mess_id,
				}
				new CateringMenu(insertData).save().then(res =>{
			        callback({msg:'success',data:'new'});
			    })
			    .catch(err => console.log(err));
			}
		}
	})
}

var updateCatering = (data,callback)=>{
	CateringMenu.updateOne({mess_id:data.mess_id},{day_catering:data.day_catering}, function(err,result){
		if(err){
			console.log(err);
		}else{
			callback({msg:'success',data:result});
		}
	})
}

module.exports = {
	findMonthlyReport,
	findAllMember,
	addMeal,
	findTodayMeal,
	findTodayBazar,
	addBazar,
	findThisMonthMeal,
	findThisMonthBazar,
	getbydate,
	datebyBazar,
	findFixedCost,
	updateFixedCost,
	findLog,
	addPaymentLog,
	findMonthlyReport,
	findAllActiveMembers,
	deactiveUser,
	activeUser,
	monthlyReportClose,
	findMonthlyReportOne,
	deleteBazar,
	updateBazar,
	deletePayment,
	findAllCatering,
	addCateringMenuItem,
	updateCatering
};
