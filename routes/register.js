var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.login){
    res.redirect('/');
  }else{
    var resdata = {
      title : 'Register',
      msg : null
    }
    res.render('pages/dashboard/register', resdata);
  }
});

module.exports = router;