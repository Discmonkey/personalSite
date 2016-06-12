var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { 
  	title: "Max's Website",
  	testScript: "$('#mainTransform').css('transform','rotateY(90deg)');$('#transform-container').addClass('active-background');$('#blog').addClass('active');"});
});

module.exports = router;