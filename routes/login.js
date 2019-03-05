var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var {loginCheck} = require('./../utils/users');

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
        req.session.success = true;
        req.session.login = true;
        req.session.user_id = response.data.user_id;
        req.session.user_name = response.data.user_name;
        req.session.user_email = response.data.user_email;
        req.session.user_img = response.data.user_img;
        res.redirect('/');
      }else{
        req.session.msg = response.msg;
        res.redirect('/login');
      }
    });
  }
});

module.exports = router;
