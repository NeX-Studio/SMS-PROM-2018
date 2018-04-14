var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

/* GET users listing. */
router.post('/', function(req, res, next) {
	let request = req.body;
	(async function(){
		let client;
		try{
			// Sterilize Input Data
			
			client = await MongoClient.connect(MONGO_URL);
			const db = client.db(DB_NAME);
			// Insert documents
			let cursor = await db.collection('participants');
		} catch(err){
			console.log(err.stack);
			next(err);
		}
	});
});

module.exports = router;
