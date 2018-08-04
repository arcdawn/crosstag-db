var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
//var mongodb = require('mongodb');
var url = 'mongodb://localhost:27017/crosstag';
/* GET home page. */
router.get('/', function(req, res, next) {
  var characterArray = [];
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    var characters = db.db().collection('characters').find();
		characters.forEach(function(doc, err){
			assert.equal(null, err);
			characterArray.push(doc);
		}, function(){
      db.close();
      res.render('about', {title: "Can't escape from Crossing Fate", characters: characterArray });
    });
  });
		
  
});

module.exports = router;