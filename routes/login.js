var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var {loginCheck,
      messCheck
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

module.exports = router;
