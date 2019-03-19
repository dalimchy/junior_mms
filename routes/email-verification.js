var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var {findUserOne,updateEmailVerification} = require('../utils/users');

/* GET home page. */
router.get('/:user_id', function(req, res, next) {
  if(req.session.msg == undefined){
      req.session.msg = null;
  }
  if(req.session.login){
    res.redirect('/');
  }else{
    findUserOne({user_id:req.params.user_id},function(docs){
      if(docs.msg == 'success'){
        if(docs.data == null){
          res.redirect('/register');
        }else{
          if(req.session.login){
            res.redirect('/');
          }else{
            if(docs.data.email_validation){
              res.redirect('/login');
            }else{
              var data = {
                title : 'Verification',
                msg : null,
                user_email : docs.data.user_email,
                user_id : docs.data.user_id,
                user_name : docs.data.user_name,
                user_img : docs.data.user_img,
                user_role : docs.data.user_role,
                ses_msg:req.session.msg
              }
              req.session.msg = null;
              res.render('pages/dashboard/email_verification', data);
            }
          }
        }
      }
    });
  }
});

router.get('/:user_id/:verification_code', function(req, res, next) {
  if(req.session.msg == undefined){
      req.session.msg = null;
  }
  if(req.session.login){
    res.redirect('/');
  }else{
    findUserOne({user_id:req.params.user_id},function(docs){
      if(docs.msg == 'success'){
       if(docs.data.validation_code == req.params.verification_code){
         updateEmailVerification({user_id:req.params.user_id,validation_code: req.params.verification_code},function(response){
            // req.session.success = true;
            // req.session.login = true;
            // req.session.user_id = docs.data.user_id;
            // req.session.user_name = docs.data.user_name;
            // req.session.user_email = docs.data.user_email;
            // req.session.user_img = docs.data.user_img;
            // req.session.user_role = 1;
            // req.session.mess_id = docs.data.mess_id;
            // req.session.mess_name = docs.data.mess_name;
            req.session.msg = 'Your account is not active. Please contact with Rich IT Support.';
            res.send({msg:'success'});
            // res.redirect('/login');
         });
       }else{
         res.send({msg:'Your verification your code doesn\'t match'})
       }
      }
    });
  }
});

module.exports = router;
