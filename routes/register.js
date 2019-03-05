var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var multer = require('multer');
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


var {newManager} = require('./../utils/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.msg == undefined){
      req.session.msg = null;
  }
  if(req.session.login){
    res.redirect('/');
  }else{
    var data = {
      title : 'Register',
      msg : null,
      ses_msg:req.session.msg
    }
    req.session.msg = null;
    res.render('pages/dashboard/register', data);
  }
});
router.post('/', function(req, res) {
  if(req.session.login){
    res.redirect('/');
  }else{
    upload(req,res, function(err){
      if(err){
        console.log(err);
      }else{
          var data = {
            user_name : req.body.user_name,
            mess_name : req.body.mess_name,
            user_email : req.body.user_email,
            user_phone : req.body.phone,
            user_password : req.body.password,
            user_img : res.req.file.filename
      
          }
          newManager(data, (response)=>{
            if(response.msg == 'success'){
              req.session.success = true;
              req.session.login = true;
              req.session.user_id = response.data.user_id;
              req.session.user_name = response.data.user_name;
              req.session.user_email = response.data.user_email;
              req.session.user_img = response.data.user_img;
              res.redirect('/');
            }else{
              req.session.msg = response.msg;
              res.redirect('/register');
            }
          });
      }
    });
  }
});

module.exports = router;