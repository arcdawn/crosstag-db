var express = require('express');
var router = express.Router();
//var mongodb = require('mongodb');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('about', { title: 'Express' });
});

module.exports = router;