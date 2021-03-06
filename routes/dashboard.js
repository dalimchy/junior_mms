var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var _ = require('lodash');
const uuidv4 = require('uuid/v4');
const fs = require('fs')
var footerTitle = '2019 © Rich IT.';
var moment = require('moment');
// var totaldays = moment(moment().format('MMMM YYYY'), "MMMM YYYY").daysInMonth();

function returnTotalDays(mm,yyyy){
    var totaldays = moment(mm+' '+yyyy, "MM YYYY").daysInMonth();

    return totaldays;
}
var today = moment().format('DD');
var thisMonth = moment().format('MM');
var thisYear = moment().format('YYYY');
var _Obj = (obj,key,value)=>{ for (var i = 0; i < obj.length; i++) { if (obj[i][key] === value) { return obj[i]; } } return false;}
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/admin_assets/images/users/')
    },
    filename: (req, file, cb) => {
      if(file.fieldname == 'profile_pic'){
        var fileType = file.originalname.split('.');
        cb(null, fileType[0].split(' ').join('_')+ '@' + Date.now()+'.'+fileType[fileType.length - 1]);
      }
      
    }
});
var upload = multer({storage: storage}).single('profile_pic');
var {newMember,
    addPayment,
    updateMemberAccount,
    findMonthRe,
    updateUser,
    updateProPic
  } = require('./../utils/users');
var {findAllMember,findAllActiveMembers,deactiveUser,activeUser,monthlyReportClose,findMonthlyReportOne} = require('./../utils/mess');
var {findMonthlyReport,addMeal,
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
    deleteBazar,
    updateBazar,
    deletePayment,
    findAllCatering
  } = require('./../utils/mess');

/* GET home page. */
router.get('/', function(req, res) {
  if(req.session.login){
    findMonthlyReport({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(monthlyReport)=>{
      if(monthlyReport.msg == 'success'){
        findMonthRe({mess_id:req.session.mess_id},function(allmonthRe){
          findThisMonthMeal({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(thisMonthMeal)=>{
            findThisMonthBazar({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(bazarList)=>{
                if(allmonthRe.msg == 'success'){
                  findAllMember({mess_id:req.session.mess_id},(response)=>{
                    var resdata = {
                      title : 'Dashboard',
                      msg : null,
                      user_data : response.data,
                      monthly_report:monthlyReport.data,
                      all_month_report:allmonthRe.data,
                      this_month_meal:thisMonthMeal.data,
                      bazar_list : bazarList.data,
                      footer_name:footerTitle,
                      _:_,
                      mess_name:req.session.mess_name,
                      moment:moment,
                      userData : {
                        user_name : req.session.user_name,
                        user_id:req.session.user_id,
                        user_email:req.session.user_email,
                        user_img:req.session.user_img,
                        mess_name:req.session.mess_name,
                        mess_id:req.session.mess_id,
                        user_role:((req.session.user_role == 1)? 'Manager':'Member')
                      }
                    }
                    res.render('pages/dashboard/index', resdata);
                  });
                }
            });
          })
        })
      }
    });
  }else{
    res.redirect('/login');
    
  }
});
router.get('/users', function(req, res) {
  if(req.session.login){
    findMonthlyReport({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(monthlyReport)=>{
      if(monthlyReport.msg == 'success'){
        findAllMember({mess_id:req.session.mess_id},(response)=>{
          var resdata = {
            title : 'Members',
            msg : null,
            user_data : response.data,
            monthly_report:monthlyReport.data,
            footer_name:footerTitle,
            _:_,
            mess_name:req.session.mess_name,
            userData : {
              user_name : req.session.user_name,
              user_id:req.session.user_id,
              user_email:req.session.user_email,
              user_img:req.session.user_img,
              mess_name:req.session.mess_name,
              mess_id:req.session.mess_id,
              user_role:((req.session.user_role == 1)? 'Manager':'Member')
            }
          }
          res.render('pages/dashboard/all_profile', resdata);
        });
      }
    });
  }else{
    res.redirect('/login');
    
  }
});
/* GET member page. */
router.get('/member', function(req, res) {
	if(req.session.msg == undefined){
	      req.session.msg = null;
	  }
  if(req.session.login){
    findMonthlyReportOne({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(monthlyReport)=>{
      findAllMember({mess_id:req.session.mess_id},(response)=>{
    		if(response.msg == 'success'){
  			var resdata = {
  		      title : 'Member',
  		      msg : null,
  		      ses_msg : req.session.msg,
  		      member_list : response.data,
            monthly_report : monthlyReport.data,
            footer_name:footerTitle,
            _ : _,
            mess_name:req.session.mess_name,
  		      userData : {
  		        user_name : req.session.user_name,
  		        user_id:req.session.user_id,
  		        user_email:req.session.user_email,
  		        user_img:req.session.user_img,
  		        mess_name:req.session.mess_name,
  		        mess_id:req.session.mess_id,
  		        user_role:((req.session.user_role == 1)? 'Manager':'Member')
  		      }
  		    }
  		    req.session.msg = null;
  		    res.render('pages/dashboard/member', resdata);
  		 }else{
  		 	res.redirect('/');
  		 }
    	});
    })
  }else{
    res.redirect('/login');
    
  }
});
router.post('/member', function(req, res) {
	upload(req,res, function(err){
      if(err){
        console.log(err);
      }else{
          var data = {
            user_name : req.body.member_name,
            mess_id : req.session.mess_id,
            user_email : req.body.member_email,
            user_phone : req.body.phone_number,
            user_password : '123456',
            user_img : res.req.file.filename
      
          }
          newMember(data, (response)=>{
            if(response.msg == 'success'){
              req.session.msg = 'Member Added Successfully.';
              res.redirect('/member');
            }else{
              req.session.msg = 'Error!';
              res.redirect('/member');
            }
          });
      }
    });
});

router.post('/deactiveUser', function (req, res) {
  if (req.session.login) {
    var data = {
      id: req.body.id
    }
    deactiveUser(data, (response)=>{
      if (response.msg == 'success') {
        res.send(response);
      }
    });
  } else {
    res.redirect('login');
  }
});
router.post('/activeUser', function (req, res) {
  if (req.session.login) {
    var data = {
      id: req.body.id
    }
    activeUser(data, (response)=>{
      if (response.msg == 'success') {
        res.send(response);
      }
    });
  } else {
    res.redirect('login');
  }
});

router.get('/profile',function (req, res) {
  if (req.session.login) {
    findMonthlyReportOne({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(monthlyReport)=>{

      findAllMember({mess_id:req.session.mess_id},(response)=>{
        console.log(req.session)
        var data = {
          title: 'Profile',
          user_data : response.data,
          monthly_report : monthlyReport.data,
          user_phone:_Obj(response.data,'user_id',req.session.user_id).user_phone,
          _:_,
          mess_name:req.session.mess_name,
          footer_name:footerTitle,
          userData : {
            user_name : req.session.user_name,
            user_id:req.session.user_id,
            user_email:req.session.user_email,
            user_img:req.session.user_img,
            mess_name:req.session.mess_name,
            mess_id:req.session.mess_id,
            user_role:((req.session.user_role == 1)? 'Manager':'Member')
          }
        }
        res.render('pages/dashboard/profile', data);
      });
    });
  }else{
    res.redirect('/login');
  }
});

router.post('/updateUser', function(req, res){
  if(req.session.login){
    updateUser(req.body, (response)=>{
      if(response.msg == 'success'){
        req.session.user_name = response.data.name;
        res.send(response);
      }else{
        res.send(response);
      }
    });
  }else{
    res.redirect('/login');
  }
});


router.post('/profile/updateProPic', function (req, res) {
  if (req.session.login) {
    console.log(req.body)
    upload(req, res, function (err) {
      if (err) {
        console.log(err);
      } else {
        var data = {
          user_id: req.session.user_id,
          user_img: res.req.file.filename,
        }
        updateProPic(data, (response)=>{
          
          if (response.msg == 'success') {
            const path = './public/admin_assets/images/users/'+response.data.oldFile;
            req.session.user_img = response.data.user_img;

            fs.unlink(path, (err) => {
                if (err) {
                  console.log(err);
                }else{
                  console.log('successs')
                  res.send(response);
                }
            });
          }
        });
      }
    });
  } else {
    res.redirect('/login');
  }
});

/* GET member page. */
router.get('/meal', function(req, res) {

  if(req.session.msg == undefined){
        req.session.msg = null;
    }
  if(req.session.login){
    findMonthlyReportOne({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(monthlyReport)=>{
      findAllActiveMembers({mess_id:req.session.mess_id},(response)=>{
        if(response.msg == 'success'){
        findTodayMeal({mess_id:req.session.mess_id,day:today,month:thisMonth,year:thisYear},(response2)=>{
          if(response2.msg == 'success'){
            var resdata = {
              title : 'Meal',
              msg : null,
              ses_msg : req.session.msg,
              member_list : (monthlyReport.data.status == 1)? monthlyReport.data.mess_members:response.data,
              monthly_report : monthlyReport.data,
              meal_list : response2.data,
              footer_name:footerTitle,
              totaldays : returnTotalDays(thisMonth,thisYear),
              month : thisMonth,
              year : thisYear,
              _ : _,
              mess_name:req.session.mess_name,
              userData : {
                user_name : req.session.user_name,
                user_id:req.session.user_id,
                user_email:req.session.user_email,
                user_img:req.session.user_img,
                mess_name:req.session.mess_name,
                mess_id:req.session.mess_id,
                user_role:((req.session.user_role == 1)? 'Manager':'Member')
              }
            }
            req.session.msg = null;
            res.render('pages/dashboard/meal', resdata);
          }else{
            console.log(response2)
          }
        });
       }else{
        console.log(response);
       }
      });
    });
  }else{
    res.redirect('/login');
    
  }
});

router.get('/meal/:month_id', function(req, res) {

  if(req.session.msg == undefined){
        req.session.msg = null;
    }
  if(req.session.login){
    findMonthlyReportOne({month_id:req.params.month_id},(monthlyReport)=>{
      if(monthlyReport.data !== null ){
        findAllActiveMembers({mess_id:req.session.mess_id},(response)=>{
          if(response.msg == 'success'){
          findTodayMeal({mess_id:req.session.mess_id,day:today,month:monthlyReport.data.month,year:monthlyReport.data.year},(response2)=>{
            if(response2.msg == 'success'){
              var resdata = {
                title : 'Meal',
                msg : null,
                ses_msg : req.session.msg,
                member_list : (monthlyReport.data.status == 1)? monthlyReport.data.mess_members:response.data,
                monthly_report : monthlyReport.data,
                meal_list : response2.data,
                footer_name:footerTitle,
                totaldays : returnTotalDays(monthlyReport.data.month,monthlyReport.data.year),
                month : monthlyReport.data.month,
                year : monthlyReport.data.year,
                _ : _,
                mess_name:req.session.mess_name,
                userData : {
                  user_name : req.session.user_name,
                  user_id:req.session.user_id,
                  user_email:req.session.user_email,
                  user_img:req.session.user_img,
                  mess_name:req.session.mess_name,
                  mess_id:req.session.mess_id,
                  user_role:((req.session.user_role == 1)? 'Manager':'Member')
                }
              }
              req.session.msg = null;
              res.render('pages/dashboard/meal', resdata);
            }else{
              console.log(response2)
            }
          });
         }else{
          console.log(response);
         }
        });
      }else{ res.send('Invalid Url')}
    });
  }else{
    res.redirect('/login');
    
  }
});
  
router.get('/meal-details', function(req, res) {
  if(req.session.msg == undefined){
        req.session.msg = null;
    }
  if(req.session.login){
    findMonthlyReportOne({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(monthlyReport)=>{

      findAllActiveMembers({mess_id:req.session.mess_id},(response)=>{
        if(response.msg == 'success'){
        findThisMonthBazar({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(bazarList)=>{
          findThisMonthMeal({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(response2)=>{
            if(response2.msg == 'success'){
              var resdata = {
                title : 'Meal Details',
                msg : null,
                ses_msg : req.session.msg,
                member_list : (monthlyReport.data.status == 1)? monthlyReport.data.mess_members:response.data,
                monthly_report : monthlyReport.data,
                meal_list : response2.data,
                bazar_list : bazarList.data,
                totaldays : returnTotalDays(thisMonth,thisYear),
                month : thisMonth,
                year : thisYear,
                footer_name:footerTitle,
                _ : _,
                mess_name:req.session.mess_name,
                userData : {
                  user_name : req.session.user_name,
                  user_id:req.session.user_id,
                  user_email:req.session.user_email,
                  user_img:req.session.user_img,
                  mess_name:req.session.mess_name,
                  mess_id:req.session.mess_id,
                  user_role:((req.session.user_role == 1)? 'Manager':'Member')
                }
              }
              req.session.msg = null;
              res.render('pages/dashboard/meal_details', resdata);
            }else{
              console.log(response2)
            }
          });
        });
       }else{
        console.log(response);
       }
      });
    });
  }else{
    res.redirect('/login');
    
  }
});
router.get('/meal-details/:month_id', function(req, res) {
  if(req.session.msg == undefined){
        req.session.msg = null;
    }
  if(req.session.login){
    findMonthlyReportOne({month_id:req.params.month_id},(monthlyReport)=>{
      if(monthlyReport.data !== null){
        findAllActiveMembers({mess_id:req.session.mess_id},(response)=>{
          if(response.msg == 'success'){
          findThisMonthBazar({mess_id:req.session.mess_id,month:monthlyReport.data.month,year:monthlyReport.data.year},(bazarList)=>{
            findThisMonthMeal({mess_id:req.session.mess_id,month:monthlyReport.data.month,year:monthlyReport.data.year},(response2)=>{
              if(response2.msg == 'success'){
                var resdata = {
                  title : 'Meal Details',
                  msg : null,
                  ses_msg : req.session.msg,
                  member_list : (monthlyReport.data.status == 1)? monthlyReport.data.mess_members:response.data,
                  monthly_report : monthlyReport.data,
                  meal_list : response2.data,
                  bazar_list : bazarList.data,
                  totaldays : returnTotalDays(monthlyReport.data.month,monthlyReport.data.year),
                  month : monthlyReport.data.month,
                  year : monthlyReport.data.year,
                  footer_name:footerTitle,
                  _ : _,
                  mess_name:req.session.mess_name,
                  userData : {
                    user_name : req.session.user_name,
                    user_id:req.session.user_id,
                    user_email:req.session.user_email,
                    user_img:req.session.user_img,
                    mess_name:req.session.mess_name,
                    mess_id:req.session.mess_id,
                    user_role:((req.session.user_role == 1)? 'Manager':'Member')
                  }
                }
                req.session.msg = null;
                res.render('pages/dashboard/meal_details', resdata);
              }else{
                console.log(response2)
              }
            });
          });
         }else{
          console.log(response);
         }
        });
      }else{res.send('Invalid url')}
    });
  }else{
    res.redirect('/login');
    
  }
});

router.post('/meal/addMeal', function(req, res) {
	 if(req.session.login){
        var data = {
            meal_id :uuidv4(),
            mess_id : req.session.mess_id,
            assign_user_id : req.body.member,
            creator_id : req.session.user_id,
            lunch : req.body.lunch,
            dinner : req.body.dinner,
            breakfast : req.body.breakfast,
            guest : req.body.guest_meal,
            day : req.body.day,
            month : req.body.month,
            year : req.body.year,
            date_of_meal : req.body.date_of_meal,
        }
        addMeal(data,(response)=>{
          if(response.msg == 'success' || response.msg == 'update'){
            if(response.msg == 'success'){
              // req.session.msg = 'Meal Save Successfully.'
            }else{
              // req.session.msg = 'Update Meal Successfully.'
            }
            res.send({msg:'success'});
          }else{
            res.send({msg:'failed'});
          }
        });
   }else{
      res.send('session close');
   }
});

router.post('/bazar/addBazar', function(req, res) {
	 if(req.session.login){
        var data = {
            bazar_id :uuidv4(),
            mess_id : req.session.mess_id,
            assign_user_id : req.body.member,
            creator_id : req.session.user_id,
            bazar_details : req.body.bazar_details,
            total_amount : req.body.amount,
            day : req.body.day,
            month : req.body.month,
            year : req.body.year,
            date_of_bazar : req.body.date_of_meal,
        }
        addBazar(data,(response)=>{
          if(response.msg == 'success'){
              // req.session.msg = 'Bazar Save Successfully.'
              res.send(response);
          }else{
            res.send({msg:'failed'});
          }
        });
   }else{
      res.send('session close');
   }
});

router.get('/bazar', function(req, res) {
  if(req.session.msg == undefined){
        req.session.msg = null;
    }
  if(req.session.login){
    findMonthlyReportOne({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(monthlyReport)=>{
      findAllActiveMembers({mess_id:req.session.mess_id},(response)=>{
        if(response.msg == 'success'){
        findTodayBazar({mess_id:req.session.mess_id,day:today,month:thisMonth,year:thisYear},(response2)=>{
          if(response2.msg == 'success'){
            var resdata = {
              title : 'Bazar',
              msg : null,
              ses_msg : req.session.msg,
              member_list : (monthlyReport.data.status == 1)? monthlyReport.data.mess_members:response.data,
              monthly_report : monthlyReport.data,
              bazar_list : response2.data,
              footer_name:footerTitle,
              moment : moment,
              totaldays : returnTotalDays(thisMonth,thisYear),
              month : thisMonth,
              year : thisYear,
              _ : _,
              mess_name:req.session.mess_name,
              userData : {
                user_name : req.session.user_name,
                user_id:req.session.user_id,
                user_email:req.session.user_email,
                user_img:req.session.user_img,
                mess_name:req.session.mess_name,
                mess_id:req.session.mess_id,
                user_role:((req.session.user_role == 1)? 'Manager':'Member')
              }
            }
            req.session.msg = null;
            res.render('pages/dashboard/bazar', resdata);
          }else{
            console.log(response2)
          }
        });
       }else{
        console.log(response);
       }
      });
    })
  }else{
    res.redirect('/login');
    
  }
});

router.get('/bazar/:month_id', function(req, res) {
  if(req.session.msg == undefined){
        req.session.msg = null;
    }
  if(req.session.login){
    findMonthlyReportOne({month_id:req.params.month_id},(monthlyReport)=>{
      if(monthlyReport.data !== null){
        findAllActiveMembers({mess_id:req.session.mess_id},(response)=>{
          if(response.msg == 'success'){
          findTodayBazar({mess_id:req.session.mess_id,day:today,month:monthlyReport.data.month,year:monthlyReport.data.year},(response2)=>{
            if(response2.msg == 'success'){
              var resdata = {
                title : 'Bazar',
                msg : null,
                ses_msg : req.session.msg,
                member_list : (monthlyReport.data.status == 1)? monthlyReport.data.mess_members:response.data,
                monthly_report : monthlyReport.data,
                bazar_list : response2.data,
                footer_name:footerTitle,
                moment : moment,
                totaldays : returnTotalDays(monthlyReport.data.month,monthlyReport.data.year),
                month : monthlyReport.data.month,
                year : monthlyReport.data.year,
                _ : _,
                mess_name:req.session.mess_name,
                userData : {
                  user_name : req.session.user_name,
                  user_id:req.session.user_id,
                  user_email:req.session.user_email,
                  user_img:req.session.user_img,
                  mess_name:req.session.mess_name,
                  mess_id:req.session.mess_id,
                  user_role:((req.session.user_role == 1)? 'Manager':'Member')
                }
              }
              req.session.msg = null;
              res.render('pages/dashboard/bazar', resdata);
            }else{
              console.log(response2)
            }
          });
         }else{
          console.log(response);
         }
        });
      }else{
        res.send('Invalid Url')
      }
    })
  }else{
    res.redirect('/login');
    
  }
});

router.post('/updateBazar', function(req, res){
  if (req.session.login) {
    updateBazar(req.body, (response)=>{
      if (response.msg == 'success') {
        res.send(response);
      }
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/deleteBazar', function (req, res) {
  if (req.session.login) {
    deleteBazar(req.body, (response)=>{
      if (response.msg == 'success') {
        res.send(response);
      }
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/bazar-details', function(req, res) {
  if(req.session.msg == undefined){
        req.session.msg = null;
    }
  if(req.session.login){
    findMonthlyReportOne({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(monthlyReport)=>{

      findAllActiveMembers({mess_id:req.session.mess_id},(response)=>{
        if(response.msg == 'success'){
        findThisMonthMeal({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(mealList)=>{
          findThisMonthBazar({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(response2)=>{
            if(response2.msg == 'success'){
              var resdata = {
                title : 'Bazar Details',
                msg : null,
                ses_msg : req.session.msg,
                member_list : (monthlyReport.data.status == 1)? monthlyReport.data.mess_members:response.data,
                monthly_report : monthlyReport.data,
                bazar_list : response2.data,
                meal_list : mealList.data,
                totaldays : returnTotalDays(thisMonth,thisYear),
                month : thisMonth,
                year : thisYear,
                footer_name:footerTitle,
                _ : _,
                mess_name:req.session.mess_name,
                userData : {
                  user_name : req.session.user_name,
                  user_id:req.session.user_id,
                  user_email:req.session.user_email,
                  user_img:req.session.user_img,
                  mess_name:req.session.mess_name,
                  mess_id:req.session.mess_id,
                  user_role:((req.session.user_role == 1)? 'Manager':'Member')
                }
              }
              req.session.msg = null;
              res.render('pages/dashboard/bazar_details', resdata);
            }else{
              console.log(response2)
            }
          });
        });
       }else{
        console.log(response);
       }
      });
    });
  }else{
    res.redirect('/login');
    
  }
});
router.get('/bazar-details/:month_id', function(req, res) {
  if(req.session.msg == undefined){
        req.session.msg = null;
    }
  if(req.session.login){
    findMonthlyReportOne({month_id:req.params.month_id},(monthlyReport)=>{
      if(monthlyReport.data !== null){
        findAllActiveMembers({mess_id:req.session.mess_id},(response)=>{
          if(response.msg == 'success'){
          findThisMonthMeal({mess_id:req.session.mess_id,month:monthlyReport.data.month,year:monthlyReport.data.year},(mealList)=>{
            findThisMonthBazar({mess_id:req.session.mess_id,month:monthlyReport.data.month,year:monthlyReport.data.year},(response2)=>{
              if(response2.msg == 'success'){
                var resdata = {
                  title : 'Bazar Details',
                  msg : null,
                  ses_msg : req.session.msg,
                  member_list : (monthlyReport.data.status == 1)? monthlyReport.data.mess_members:response.data,
                  monthly_report : monthlyReport.data,
                  bazar_list : response2.data,
                  meal_list : mealList.data,
                  totaldays : returnTotalDays(monthlyReport.data.month,monthlyReport.data.year),
                  month : monthlyReport.data.month,
                  year : monthlyReport.data.year,
                  footer_name:footerTitle,
                  _ : _,
                  mess_name:req.session.mess_name,
                  userData : {
                    user_name : req.session.user_name,
                    user_id:req.session.user_id,
                    user_email:req.session.user_email,
                    user_img:req.session.user_img,
                    mess_name:req.session.mess_name,
                    mess_id:req.session.mess_id,
                    user_role:((req.session.user_role == 1)? 'Manager':'Member')
                  }
                }
                req.session.msg = null;
                res.render('pages/dashboard/bazar_details', resdata);
              }else{
                console.log(response2)
              }
            });
          });
         }else{
          console.log(response);
         }
        });
      }else{
        res.send('Invalid url');
      }
    });
  }else{
    res.redirect('/login');
    
  }
});



router.get('/fixed-cost', function (req, res) {
  if(req.session.msg == undefined){
      req.session.msg = null;
  }
  if (req.session.login) {
    findLog({mess_id:req.session.mess_id,type:'fixed_cost'}, function(fixedLog){
      findMonthlyReportOne({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(monthlyReport)=>{

        findAllActiveMembers({mess_id:req.session.mess_id},(response)=>{
          findFixedCost({mess_id:req.session.mess_id},function(fixedList){
            if(fixedList.msg == 'success'){
              var resdata = {
                title : 'Fixed Cost',
                msg : null,
                ses_msg : req.session.msg,
                fixed_cost : fixedList.data,
                fixed_cost_log : fixedLog.data,
                moment : moment,
                member_list : (monthlyReport.data.status == 1)? monthlyReport.data.mess_members:response.data,
                monthly_report : monthlyReport.data,
                _:_,
                footer_name:footerTitle,
                mess_name:req.session.mess_name,
                userData : {
                  user_name : req.session.user_name,
                  user_id:req.session.user_id,
                  user_email:req.session.user_email,
                  user_img:req.session.user_img,
                  mess_name:req.session.mess_name,
                  mess_id:req.session.mess_id,
                  user_role:((req.session.user_role == 1)? 'Manager':'Member')
                }
              }
              req.session.msg = null;
              res.render('pages/dashboard/fixed_cost', resdata);
            }
          });
        });
      });
    });
    
  } else {
    res.redirect('/login');
  }
});

router.post('/fixed-cost', function (req, res) {
  if(req.session.msg == undefined){
      req.session.msg = null;
  }
  if (req.session.login) {
    req.body['user_id'] = req.session.user_id;
    req.body['day'] = today;
    req.body['month'] = thisMonth;
    req.body['year'] = thisYear;
    updateFixedCost(req.body, function(docs){
      if(docs.msg == 'success'){
        req.session.msg = 'update Fixed Cost Successfully.';
        res.redirect('/fixed-cost');
      }
    });
  }else {
    res.redirect('/login');
  }
});

router.get('/payment', function(req, res) {
  if(req.session.msg == undefined){
      req.session.msg = null;
  }
  if(req.session.login){
    findLog({mess_id:req.session.mess_id,type:'payment'}, function(paymentLog){
      findMonthlyReportOne({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(monthlyReport)=>{
        findMonthRe({mess_id:req.session.mess_id},function(allmonthRe){
          findAllActiveMembers({mess_id:req.session.mess_id},(response)=>{
            var resdata = {
              title : 'Payment',
              msg : null,
              ses_msg : req.session.msg,
              member_list : (monthlyReport.data.status == 1)? monthlyReport.data.mess_members:response.data,
              monthly_report : monthlyReport.data,
              payment_log : paymentLog.data,
              moment : moment,
              footer_name:footerTitle,
              allmonthRe:allmonthRe,
              thisMonth:thisMonth,
              thisYear:thisYear,
              _:_,
              mess_name:req.session.mess_name,
              userData : {
                user_name : req.session.user_name,
                user_id:req.session.user_id,
                user_email:req.session.user_email,
                user_img:req.session.user_img,
                mess_name:req.session.mess_name,
                mess_id:req.session.mess_id,
                user_role:((req.session.user_role == 1)? 'Manager':'Member')
              }
            }
            req.session.msg = null;
            res.render('pages/dashboard/payment', resdata);
          });
        });
      });
    });
  }else{
    res.redirect('/login');
  }
});

router.post('/payment', function(req, res) {
  if(req.session.msg == undefined){
      req.session.msg = null;
  }
  var reqData = {
    mess_id:req.session.mess_id,
    creator_id:req.session.user_id,
    payment_user_id:req.body.member_id,
    amount:req.body.pay_amount,
    pay_info:req.body.payment_info,
    day:today,
    month:req.body.month,
    year:req.body.year
  }
  if(req.session.login){
    addPayment(reqData,function(response){
        addPaymentLog(reqData,function(response2){
          if(response2.msg == 'success'){
            req.session.msg = 'Payment Added Successfully.';
            res.redirect('/payment');
          }
        })
    });
  }else{
    res.redirect('/login');
  }
});

router.post('/deletePayment', function (req, res) {
  if (req.session.login) {
    deletePayment(req.body, (response)=>{
      if (response.msg == 'success') {
        res.send(response);
      }
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/monthly-calculation', function(req, res) {
  if(req.session.msg == undefined){
      req.session.msg = null;
  }
  if(req.session.login){
    findMonthlyReportOne({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(monthlyReport)=>{
      findAllActiveMembers({mess_id:req.session.mess_id},(allMember)=>{
        findThisMonthMeal({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(mealList)=>{
          findThisMonthBazar({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(bazarList)=>{
            findFixedCost({mess_id:req.session.mess_id},function(fixedCost){
              findLog({mess_id:req.session.mess_id,type:'payment',month:thisMonth,year:thisYear}, function(paymentLog){
                var resdata = {
                    title : 'Monthly Calculation',
                    msg : null,
                    ses_msg : req.session.msg,
                    member_list : (monthlyReport.data.status == 1)? monthlyReport.data.mess_members:allMember.data,
                    meal_list : mealList.data,
                    bazar_list : bazarList.data,
                    fixed_cost_list : (monthlyReport.data.status == 1)? monthlyReport.data.report.fixed_cost:fixedCost.data,
                    payment_log : paymentLog.data,
                    day : today,
                    month : thisMonth,
                    year : thisYear,
                    moment : moment,
                    monthly_report : monthlyReport.data,
                    footer_name:footerTitle,
                    totaldays : returnTotalDays(thisMonth,thisYear),
                    _:_,
                    mess_name:req.session.mess_name,
                    userData : {
                      user_name : req.session.user_name,
                      user_id:req.session.user_id,
                      user_email:req.session.user_email,
                      user_img:req.session.user_img,
                      mess_name:req.session.mess_name,
                      mess_id:req.session.mess_id,
                      user_role:((req.session.user_role == 1)? 'Manager':'Member')
                    }
                  }
                  req.session.msg = null;
                  res.render('pages/dashboard/calculation', resdata);
              });

            });
          });
        });
        
      });
    });
    

  }else{
    res.redirect('/login');
  }
});
router.get('/monthly-calculation/:month_id', function(req, res) {
  if(req.session.msg == undefined){
      req.session.msg = null;
  }
  if(req.session.login){
    findMonthlyReportOne({month_id:req.params.month_id},(monthlyReport)=>{
      findAllActiveMembers({mess_id:req.session.mess_id},(allMember)=>{
        findThisMonthMeal({mess_id:req.session.mess_id,month:monthlyReport.data.month,year:monthlyReport.data.year},(mealList)=>{
          findThisMonthBazar({mess_id:req.session.mess_id,month:monthlyReport.data.month,year:monthlyReport.data.year},(bazarList)=>{
            findFixedCost({mess_id:req.session.mess_id},function(fixedCost){
              findLog({mess_id:req.session.mess_id,type:'payment',month:monthlyReport.data.month,year:monthlyReport.data.year}, function(paymentLog){
                var resdata = {
                    title : 'Monthly Calculation',
                    msg : null,
                    ses_msg : req.session.msg,
                    member_list : (monthlyReport.data.status == 1)? monthlyReport.data.mess_members:allMember.data,
                    meal_list : mealList.data,
                    bazar_list : bazarList.data,
                    fixed_cost_list : (monthlyReport.data.status == 1)? monthlyReport.data.report.fixed_cost:fixedCost.data,
                    payment_log : paymentLog.data,
                    day : today,
                    month : monthlyReport.data.month,
                    year : monthlyReport.data.year,
                    moment : moment,
                    monthly_report : monthlyReport.data,
                    footer_name:footerTitle,
                    totaldays : returnTotalDays(monthlyReport.data.month,monthlyReport.data.year),
                    _:_,
                    mess_name:req.session.mess_name,
                    userData : {
                      user_name : req.session.user_name,
                      user_id:req.session.user_id,
                      user_email:req.session.user_email,
                      user_img:req.session.user_img,
                      mess_name:req.session.mess_name,
                      mess_id:req.session.mess_id,
                      user_role:((req.session.user_role == 1)? 'Manager':'Member')
                    }
                  }
                  req.session.msg = null;
                  res.render('pages/dashboard/calculation', resdata);
              });

            });
          });
        });
        
      });
    });
    

  }else{
    res.redirect('/login');
  }
});



router.post('/closed-calculations',function(req,res){
  if(req.session.msg == undefined){
      req.session.msg = null;
  }
  if(req.session.login){
    findMonthlyReportOne({month_id:req.body.month_id},function(monthlyReport){
      if(req.session.user_role == 1 && monthlyReport.data.status == 0){
        updateMemberAccount(req.body,function(updateAc){
          if(updateAc.msg == 'success'){
            findAllActiveMembers({mess_id:req.session.mess_id},(allMember)=>{
              var updateQuery = {
                status:1,
                mess_members: allMember.data,
                meal_rate:req.body.meal_rate,
                total_bazar:req.body.total_bazar,
                total_meal:req.body.total_meal
              }
              monthlyReportClose({mess_id:req.session.mess_id,month_id:monthlyReport.data.month_id,updateQuery:updateQuery},function(result){
                if(result.msg == 'success'){
                  res.send({msg:'success'});
                }
              });
            });
          }
        })
      }
    })
  }
});

router.post('/findAllMonthReport', function(req,res){
  if(req.session.login){
    findMonthRe({mess_id:req.session.mess_id},function(allmonthRe){
      if(allmonthRe.msg == 'success'){
        res.send(allmonthRe);
      }
    })
  }
});


router.get('/catering-menu', function(req,res){
  if(req.session.login){
    findMonthlyReportOne({mess_id:req.session.mess_id,month:thisMonth,year:thisYear},(monthlyReport)=>{
      findAllCatering({mess_id:req.session.mess_id},(resCatering)=>{
        findAllMember({mess_id:req.session.mess_id},(response)=>{
          var data = {
            title: 'Catering Menu',
            user_data : response.data,
            monthly_report : monthlyReport.data,
            _:_,
            mess_name:req.session.mess_name,
            footer_name:footerTitle,
            all_catering_menu:resCatering.data,
            userData : {
              user_name : req.session.user_name,
              user_id:req.session.user_id,
              user_email:req.session.user_email,
              user_img:req.session.user_img,
              mess_name:req.session.mess_name,
              mess_id:req.session.mess_id,
              user_role:((req.session.user_role == 1)? 'Manager':'Member')
            }
          }
          res.render('pages/dashboard/catering', data);
        });
      });
    });
    
  }else{
    res.redirect('/login');
  }
});

module.exports = router;