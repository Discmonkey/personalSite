
var express = require('express');
var router = express.Router();
// select random from mongodb
/* GET home page. */
router.get('/test', function(req, res, next) {
    res.render('test', { title: "Max's Website"});
});

module.exports = router;
