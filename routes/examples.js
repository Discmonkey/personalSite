var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var db = req.db;
		var entries = db.get('entries');
		entries.findOne({'number': 1}).on('success',function(doc) {
		res.render('index', { 
			title: "Max's Website",
			testScript: "$('#mainTransform').css('transform','translateZ(-180px) rotateY(90deg)');$('#transform-container').addClass('active-background');$('#blog').addClass('active');",
			entry: doc
		});
	});
});

router.get('/create', function(req, res, next) {
	res.render('subPages/createBlog', {
		title: 'Ceate Blog Entry'
	});
});

module.exports = router;