var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var footerTitle = 'Rich IT';
var _ = require('lodash');
const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'richitbd@gmail.com',
      pass: 'ritBD007',
  }
 });

 var siteAddress = require('../config/siteInfo').siteAddress;

 var {

  findAllManager,
  findAllMess,
  updateUser

  } = require('./../utils/super_admin');


router.get('/login/:email',function(req,res){
  console.log('17');
  if(req.session.admin_login == undefined){
    req.session.admin_login = false;
  }

  req.session.verification_code = 0;
  var adminEmailArray = ['dalimchyjony@gmail.com','ahn.nayeem@gmail.com'];
  if(req.session.admin_login){
    res.redirect('/admin/dashboard');
  }else{
    if(adminEmailArray.indexOf(req.params.email) !== -1){
        var randomNumber = Math.floor(Math.random() * 99999999);
        req.session.verification_code = randomNumber;
        const mailOptions = {
          from: 'RichITBD@gmail.com', // sender address
          to:adminEmailArray[adminEmailArray.indexOf(req.params.email)], // list of receivers
          subject: 'Rich IT MMS Admin Verification', // Subject line
          html: '<p>Admin Login Verification Code: <h2>'+randomNumber+'</h2></p>'// plain text body
        };
        transporter.sendMail(mailOptions, function (err, info) {
          if(err){
            console.log(78,err)
          }else{
            var data = {
                title : 'Admin Verification',
                ses_msg:'Check your email and get vrification code.',
            }
            res.render('pages/dashboard/admin_email_verification', data);
          }
       });
    }else{
      res.send({msg:'Your are not permitted user.'})
    }
  }
});


router.get('/',function(req,res){
  console.log('55');
  if(req.session.admin_login == undefined){
    req.session.admin_login = false;
  }
  if(req.session.msg == undefined){
        req.session.msg = null;
    }
  if(req.session.admin_login){
    res.redirect('/admin/dashboard');
  }else{
    if(req.session.msg == null){
       res.send({msg:'Your are not permitted user.'})
    }else{

      var data = {
            title : 'Admin Verification',
            ses_msg:req.session.msg,
        }
        req.session.msg = null;
       res.render('pages/dashboard/admin_email_verification', data);
    }
  }
});
router.get('/dashboard',function(req,res){
  console.log('79');
  console.log(req.session.admin_login)
  if(req.session.admin_login == undefined){
    req.session.admin_login = false;
  }
  if(req.session.msg == undefined){
        req.session.msg = null;
    }
  if(req.session.admin_login){
    var data = {
        title : 'Admin dashboard'
    }
   res.render('pages/dashboard/admin_dashboard', data);
  }else{
    res.redirect('/admin');
  }
});
router.post('/checkVerification',function(req,res){
  console.log('97');
  if(req.body.verification_code == req.session.verification_code){
    req.session.admin_login = true;
    res.redirect('/admin/dashboard');
  }else{
    req.session.admin_login = false;
    req.session.msg = 'Verification code does not matched.';
    res.redirect('/admin');
  }
});

router.get('/logout', function(req,res){
    req.session.destroy();
    res.redirect('/login');
});

router.get('/manage-mess',function(req,res){
  if(req.session.admin_login){
    findAllManager(function(manager){
      findAllMess(function(allmess){
        if(allmess.msg == 'success'){
          var data = {
              title : 'Manage Mess',
              all_manager :manager.data,
              all_mess :allmess.data,
              footerTitle:footerTitle,
              _:_
          }
         res.render('pages/dashboard/super_mess_manage', data);
        }
      })
    })
  }else{
    res.redirect('/login');
  }
});

router.post('/manage-mess/active-inactive',function(req,res){
    updateUser(req.body,function(docs){
      if(docs.msg == 'success'){
        res.send({msg:'success'});
      }
    })
})

module.exports = router;
