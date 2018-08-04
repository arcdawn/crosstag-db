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
	var characterArray = [];
		var characters = db.db().collection('characters').find();
		characters.forEach(function(doc, err){
			assert.equal(null, err);
			characterArray.push(doc);
		});
	var cursor = db.db().collection('matches').find();
	cursor.forEach(function(doc, err){
		assert.equal(null, err);
		resultArray.push(doc);
	}, function(){
		db.close();
		res.render('index', {title: "Can't escape from Crossing Fate", items: resultArray, characters: characterArray});
	});
});
});

router.get('/get-data', function(req, res, next){
	var resultArray = [];
	var title = sanitize(req.query.title);
	title = new RegExp(title, 'i');
	var channel = new RegExp(sanitize(req.query.channel), 'i');
	var playerone = new RegExp(sanitize(req.query.playerone), 'i');
	var playertwo = new RegExp(sanitize(req.query.playertwo), 'i');
	var p1c1 = new RegExp(sanitize(req.query.charoneone), 'i');
	var p1c2 = new RegExp(sanitize(req.query.charonetwo), 'i');
	var p2c1 = new RegExp(sanitize(req.query.chartwoone), 'i');
	var p2c2 = new RegExp(sanitize(req.query.chartwotwo), 'i');
	console.log(title);
	mongo.connect(url, function(err, db){
		assert.equal(null, err);
		var characterArray = [];
		var characters = db.db().collection('characters').find();
		characters.forEach(function(doc, err){
			assert.equal(null, err);
			characterArray.push(doc);
		});
		var cursor = db.db().collection('matches').find({title: {$regex: title},
			channel: {$regex: channel},
			pone: {$regex: playerone},
			ptwo: {$regex: playertwo},
			ponecharone: {$regex: p1c1},
			ponechartwo: {$regex: p1c2},
			ptwocharone: {$regex: p2c1},
			ptwochartwo: {$regex: p2c2}
		});
		cursor.forEach(function(doc, err){
			assert.equal(null, err);
			resultArray.push(doc);
		}, function(){
			db.close();
			res.render('index', {title: "Can't escape from Crossing Fate", items: resultArray, characters: characterArray});
		});
	});
});
router.post('/insert', function(req, res, next){
	var item = {
		title: sanitize(req.body.title),
		content: sanitize(req.body.link),
		channel: sanitize(req.body.channel),
		pone: sanitize(req.body.pone),
		ptwo: sanitize(req.body.ptwo),
		ponecharone: sanitize(req.body.charoneone),
		ponechartwo: sanitize(req.body.charonetwo),
		ptwocharone: sanitize(req.body.chartwoone),
		ptwochartwo: sanitize(req.body.chartwotwo),
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
