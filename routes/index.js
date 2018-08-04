var express = require('express');
var sanitize = require('google-caja-sanitizer').sanitize;
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/crosstag';
/* GET home page. */
router.get('/', function(req, res, next) {
	var resultArray = [];
  //res.render('index', { title: 'Express' });
  mongo.connect(url, function(err, db){
	assert.equal(null, err);
	var cursor = db.db().collection('matches').find();
	cursor.forEach(function(doc, err){
		assert.equal(null, err);
		resultArray.push(doc);
	}, function(){
		db.close();
		res.render('index', {items: resultArray});
	});
});
});

router.get('/get-data', function(req, res, next){
	var resultArray = [];
	var title = sanitize(req.query.title);
	title = new RegExp(title, 'i');
	var channel = new RegExp(sanitize(req.query.channel), 'i');
	console.log(title);
	mongo.connect(url, function(err, db){
		assert.equal(null, err);
		var cursor = db.db().collection('matches').find({title: {$regex: title},
			channel: {$regex: channel}});
		cursor.forEach(function(doc, err){
			assert.equal(null, err);
			resultArray.push(doc);
		}, function(){
			db.close();
			res.render('index', {items: resultArray});
		});
	});
});
router.post('/insert', function(req, res, next){
	var item = {
		title: req.body.title,
		content: req.body.link,
		channel: req.body.channel,
		pone: req.body.pone,
		ptwo: req.body.ptwo,
		ponecharone: req.body.charoneone,
		ponechartwo: req.body.charonetwo,
		ptwocharone: req.body.chartwoone,
		ptwochartwo: req.body.chartwotwo,
		date: req.body.date
	};
	mongo.connect(url, function(err, db){
		assert.equal(null, err);
		db.db().collection('matches').insertOne(item, function(err, result){
			assert.equal(null, err);
			console.log('inserted!');
			db.close();
		});
	});
	res.redirect('/');
});
/*

router.post('/insert', function(req, res, next){

});
router.post('/insert', function(req, res, next){

});*/


module.exports = router;
