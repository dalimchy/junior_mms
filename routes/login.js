var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.login){
    res.redirect('/');
  }else{
    var resdata = {
      title : 'Login',
      msg : null
    }
    res.render('pages/dashboard/login', resdata);
  }
});

module.exports = router;