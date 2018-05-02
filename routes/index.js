var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

/* GET home page. */
router.get('/', function(req, res, next) {
	(async function(){
		let client;
		try{
			client = await MongoClient.connect(MONGO_URL);
			const db = client.db(DB_NAME);
			let bulletins = await db.collection("bulletins").find({}).toArray();
			res.locals.bulletins = bulletins;
			res.render('index');
		} catch(err){
			console.log(err.stack);
			next(err);
		}
	})();
});

module.exports = router;
