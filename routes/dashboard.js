var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
var _ = require('lodash');
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
var {newMember} = require('./../utils/users');
var {findAllMember} = require('./../utils/mess');

/* GET home page. */
router.get('/', function(req, res) {
  if(req.session.login){
    var resdata = {
      title : 'Dashboard',
      msg : null,
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
  	findAllMember({mess_id:req.session.mess_id},(response)=>{
  		if(response.msg == 'success'){
			var resdata = {
		      title : 'Member',
		      msg : null,
		      ses_msg : req.session.msg,
		      member_list : response.data,
		      _ : _,
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

/* GET member page. */
router.get('/meal', function(req, res) {
	if(req.session.msg == undefined){
	      req.session.msg = null;
	  }
  if(req.session.login){
    findAllMember({mess_id:req.session.mess_id},(response)=>{
  		if(response.msg == 'success'){
        var resdata = {
          title : 'Meal',
          msg : null,
          ses_msg : req.session.msg,
          member_list : response.data,
          _ : _,
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
		 	res.redirect('/');
		 }
  	});
  }else{
    res.redirect('/login');
    
  }
});

module.exports = router;