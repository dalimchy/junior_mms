var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'richitbd@gmail.com',
      pass: 'ritBD007',
  }
 });

 var siteAddress = require('../config/siteInfo').siteAddress;

var {loginCheck,
      messCheck,
      userFindByEmail,
      userValidationUpdate,
      findAndUpdatePassword
    } = require('./../utils/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.msg == undefined){
      req.session.msg = null;
  }
  if(req.session.login){
    res.redirect('/');
  }else{
    var data = {
      title : 'Login',
      msg : null,
      ses_msg:req.session.msg
    }
    req.session.msg = null;
    res.render('pages/dashboard/login', data);
  }
});
router.post('/', function(req, res) {
  if(req.session.login){
    res.redirect('/');
  }else{
    var data = {
      user_email : req.body.email,
      user_password : req.body.password
    }
    loginCheck(data,(response)=>{
      if(response.msg == 'success'){
        messCheck({mess_id:response.data.mess_id},(response2)=>{
          if(response2.msg == 'success'){
            if(response.data.email_validation){
              req.session.success = true;
              req.session.login = true;
              req.session.user_id = response.data.user_id;
              req.session.user_name = response.data.user_name;
              req.session.user_email = response.data.user_email;
              req.session.user_img = response.data.user_img;
              req.session.mess_id = response.data.mess_id;
              req.session.mess_name = response2.mess_name;
              req.session.user_role = response.data.user_role;
              res.redirect('/');
            }else{
              req.session.msg = 'Your Email Not Verified ! Please Submit Your Verification Code.';
              res.redirect('/email-verification/'+response.data.user_id+'');
              req.session.msg = null;
            }
          }else{
            req.session.msg = response.msg;
            res.redirect('/login');
          }
        });
        
      }else{
        req.session.msg = response.msg;
        res.redirect('/login');
      }
    });
  }
});

router.post('/forgotPassword',function(req,res){
    userFindByEmail({user_email:req.body.user_email},function(userDoc){
      if(userDoc.msg == 'success'){
        if(userDoc.data !== null){
          var randomNumber = Math.floor(Math.random() * 99999999);
          userValidationUpdate({user_id:userDoc.data.user_id,validation_code:randomNumber},function(sendCode){
            if(sendCode.msg == 'success'){
              const mailOptions = {
                from: 'RichITBD@gmail.com', // sender address
                to:userDoc.data.user_email, // list of receivers
                subject: 'Rich IT MMS Email Verification', // Subject line
                html: '<p>Verification Code: <h2>'+randomNumber+'</h2></p>'// plain text body
              };
              transporter.sendMail(mailOptions, function (err, info) {
                if(err){
                  console.log(78,err)
                }else{
                  res.send({msg:'success',data:userDoc.data});
                }
             });
            }
          });
          
        }else{
          res.send({msg:'Email does not exist !'});
        }
      }
    });
});

router.post('/newPassword',function(req,res){
  findAndUpdatePassword(req.body,function(docs){
    if(docs.msg == 'success'){
      if(docs.data !== null){
        res.send({msg:'success'});
      }else{
        res.send({msg:'Verification not match !'});
      }
    }
  });
})

module.exports = router;
