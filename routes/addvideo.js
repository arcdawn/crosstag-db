var express = require('express');
var sanitize = require('google-caja-sanitizer').sanitize;
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/crosstag';
/* GET home page. */

router.get('/', function(req, res, next) {
	mongo.connect(url, function(err, db){
		var characterArray = [];
		assert.equal(null, err);
		var characters = db.db().collection('characters').find();
		characters.forEach(function(doc, err){
			assert.equal(null, err);
			characterArray.push(doc);
		}, function(){
			db.close();
			res.render('addvideo', {title: "Can't escape from Crossing Fate", characters: characterArray});
		});
	});
  //res.render('addvideo', { title: 'Express' });
});

router.get('/get-data', function(req, res, next){
	var resultArray = [];
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
router.post('/insert', function(req, res, next){
	var item = {
		title: req.body.title,
		content: req.body.link,
		channel: req.body.channel,
		
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

module.exports = router;