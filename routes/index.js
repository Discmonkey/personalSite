var express = require('express');
var router = express.Router();
// select random from mongodb
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "Max's Website"});
});

module.exports = router;
