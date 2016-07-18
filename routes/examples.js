var express = require('express');
var querystring = require('querystring');
var router = express.Router();

//rotate cube towards entries
router.get('/', function(req, res, next) {
	var db = req.db;
	var entries = db.get('entries');

	var random = Math.random();
	entries.findOne({'randKey': {"$gt" : random}}).on('success',function(doc) {
		if (doc) {
			res.render('index', { 
				title: "Max's Website",
				testScript: "$('#mainTransform').css('transform','translateZ(-180px) \
				rotateY(90deg)');$('#transform-container')\
				.addClass('active-background');$('#blog').addClass('active');",
				entry: doc
			});
		} else {
			entries.findOne({'randKey': {"$lt" : random}}).on('success',function(doc) {
				res.render('index', { 
					title: "Max's Website",
					testScript: "$('#mainTransform').css('transform','translateZ(-180px) \
					rotateY(90deg)');$('#transform-container')\
					.addClass('active-background');$('#blog').addClass('active');",
					entry: doc
				});
			});
		}
	});
});

router.get('/create', function(req, res, next) {
	res.render('subPages/createBlog', {
		title: 'Create Blog Entry'
	});
});

router.post('/fetchAll', function(req, res, next) {
	var db = req.db;
	var entries = db.get('entries');

	entries.find({},{'number': 1, 'title': 1, 'content': 0}).on('success', function(docs){
		res.end(JSON.stringify(docs));
	});
});

router.post('/deleteEntry', function(req, res, next) {
	var db = req.db;
	var entries = db.get('entries');

	console.log(req.body);
	var number = req.body.number;

	entries.remove({'number': parseInt(number)}).on('success',function(){
		res.end('success');
	});
});

router.post('/fetchEntry' , function(req, res, next) {
	var db = req.db;
	var entries = db.get('entries');

	console.log(req.body);
	var number = req.body.number;

	entries.findOne({'number': parseInt(number)}).on('success', function(doc) {
		res.end(JSON.stringify(doc));
	});
});

router.post('/create/title', createEntry);
router.post('/create/appendParagraph', createParagraph);
router.delete('/create/appendParagraph', deleteParagraph);
router.patch('/create/appendParagraph', editParagraph);

//post title and insert into database
function createEntry(req, res, next) {

	var title = req.body.title;

	if ( !title ) { 
		res.end("no title");
		return;
	}

	var db = req.db;
	var entries = db.get('entries');
	var randomNum = Math.random();
	entries.count().on('success', function(num) {
		var entryNumber = num + 1;
		entries.insert({
			title: title,
			randKey: randomNum,
			number: entryNumber,
			content: []
		}).on('success', function(entry) {
			res.json(entry);
			res.end();
			return;
		}).on('error', function(){
			res.end('error');
		});
	});
}

//create a pargraph, always append to the end of the current entry
function createParagraph(req, res, next) {
	var entryNumber = req.body.entryNumber;
	var parStyle = req.body.parStyle;
	var par = req.body.par;
	console.log(req.body);
	if ( !entryNumber || !parStyle || !par ) {
		res.end("Missing fields");
	}

	var db = req.db;
	var entries = db.get('entries');

	entries.update({'number':entryNumber}, {$push: {
			"content": {
					parStyle: parStyle,
					par: par
				}
			}
		}
	).on('success' , function(entry) {
		console.log(entry);
		res.end('success');
		return 1;
	}).on('error' , function() {
		res.end('error');
	});
}

//delete a pargraph, for now best option is to $pull the paragraph out of the array
function deleteParagraph(req, res, next) {
	console.log(req);
	var par = req.query.par;
	var number = req.query.number;
	var db = req.db;
	if ( !par ) {
		res.write("Missing paragraph body");
	}
	
	entries = db.get('entries');
	entries.update({"number": parseInt(number)}, {"$pull":{"content":{"par": par}}}).on("success", function(entry) {
		console.log(entry);
		res.end("success");
	});
}

//edit the paragraph, best option is to construct the json object separately of the db request. 
function editParagraph(req,res,next) {
	console.log(req.body);
	var par = req.body.par;
	var parStyle = req.body.parStyle;
	var index = req.body.paragraphNumber;
	var number = req.body.entryNumber;
	var db = req.db;

	var updatePar = 'content.'+index+'.par';
	var updateStyle = 'content.'+index+'.parStyle';

	if ( !par || !number ) {
		res.write("Missing required fields");
	}
	var entries = db.get('entries');
	jsonObject = {};
	jsonObject['$set'] = {};
	jsonObject['$set'][updatePar] = par;
	jsonObject['$set'][updateStyle] = parStyle;

	entries.update({'number': parseInt(number) }, jsonObject).on('success', function(entry) {
		console.log(entry);
		res.end('success');
	});
}

module.exports = router;