var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/inde', function(req, res, next) {
  res.render('inde', { title: 'hello' });
});


module.exports = router;
