var express = require('express');
var router = express.Router();

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
    var resdata = {
      title : 'Member',
      msg : null,
      ses_msg : req.session.msg,
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
    res.redirect('/login');
    
  }
});

module.exports = router;