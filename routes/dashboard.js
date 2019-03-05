var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  if(req.session.login){
    var resdata = {
      title : 'Dashboard',
      msg : null
    }
    res.render('pages/dashboard/index', resdata);
  }else{
    res.redirect('/login');
    
  }
});

module.exports = router;