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
			request = request.participants.map(sterilizeData, request.meta);
			let fee = getFee(request.participants);
			let uuid = request.meta.uuid
			let group = request.meta.group
			client = await MongoClient.connect(MONGO_URL);
			const db = client.db(DB_NAME);
			let cursor = await db.collection('participants').findOne({"uuid": uuid});
			if (cursor){
				// Update Documents
				cursor = await db.collection('participants').deleteMany("uuid": uuid);
				cursor = await db.collection('participants').insertMany(request);
				res.status().json({errcode: 0, errmsg: "", class: request.class, fee: fee})
			}
			else {
				cursor = await db.collection('participants').findOne({"group": group});
				// If attempts to add to same group without authorization happen
				if (cursor.uuid != uuid)
					res.status(401).json({errorcode: 10005, errmsg: 'Invalid uuid'});
				else{
					// Insert documents
					 = await db.collection('participants').insertMany(request);
					res.status(201).json({errcode: 0, errmsg: ""});
				}
			}
		} catch(err){
			console.log(err.stack);
			next(err);
		}
	});
});

function sterilizeData(val){
	// Use 'this' to get meta info
	return {
		"name": typeof val.name == "string" ? val.name : "",
		"gender": typeof val.gender == "string" ? val.gender : "",
		"type": typeof val.type == "string" ? val.type : "",
		"group": typeof this.group == "string" ? this.group : "",
		"uuid": typeof this.uuid == "string" ? this.uuid : "",
		"tel": typeof val.tel == "string" ? val.tel : "",
		"avoidance": typeof this.avoidance == "string" ? this.avoidance : "",
		"class": typeof val.class == "string" ? val.class : ""
	}
}

function getFee(arr){
	let fee = 0;
	for(let i = 0; i < arr.length; i++){
		switch(arr[i].type){
			case "parent":
				fee += 350;
				break;
			case "child":
				fee += 150;
				break;
			case "partner":
				if(arr[i].class == "")
					fee += 400;
				break;
			case "student":
				fee += 400;
				break;
			default:
				fee += 0;
		}
	}
	return fee
}

module.exports = router;
