var express = require('express');
var router = express.Router();
// select random from mongodb
/* GET home page. */
router.get('/', function(req, res, next) {
	var db = req.db;
	var entries = db.get('entries');
	var random = Math.random();
	console.log(random);
	entries.findOne({'randKey':{'$gt': random}}).on('success', function(doc) {
		console.log(doc);
		if ( doc ) {
			res.render('index', { title: "Max's Website", entry: doc});
		} else {
			entries.findOne({'randKey':{'$lt': random}}).on('success', function(doc) {
				res.render('index', { title: "Max's Website", entry: doc});
			});
		}
	});	
});

module.exports = router;
