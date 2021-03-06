var express = require('express');
var router = express.Router();
var nanoid = require('nanoid');
const SMSClient = require('@alicloud/sms-sdk')
const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;
const accessKeyId = process.env.ACCESSKEYID;
const secretAccessKey = process.env.SECRETACCESSKEY;
const participantsSMSCode = process.env.PARTICIPANTS_SMSCODE;
const hostsSMSCode = process.env.HOSTS_SMSCODE;
const showsSMSCode = process.env.SHOWS_SMSCODE;
const smsSignature = process.env.SMS_SIGNATURE;

let smsClient = new SMSClient({accessKeyId, secretAccessKey});

/* Form Submission Backend */
router.post('/:type', function(req, res, next) {
	let request = req.body;
	let type = req.params.type;
	if ((type != "participants" && type != "hosts" && type != "shows"))
		next();
	else{
		(async function(){
			let client;
			try{
				// Sterilize Input Data
				let uuid = request.meta.uuid;
				let group = request.meta.group
				let class_ = request.meta.class;
				let smsTel = request.meta.tel;
				let amount = request.meta.amount;
				if(typeof smsTel != "string" || smsTel.length != 11)
					next();
				else{
					uuid = (uuid == "" || typeof uuid != "string") ? nanoid(12) : uuid;
					group = typeof group != "string" ? "" : group;
					class_ = (typeof class_ != "string" || (class_ != "17" && class_ != "18" && class_ != "19" && class_ != "20")) ? "" : class_ ;
					request.meta.type = type;
					request.meta.uuid = uuid;
					request.meta.group = group;
					request.meta.submitTime = Date().toString();
					request.participants = request.participants.map(sterilizeData, request.meta);
					let fee = getFee(request.participants);
					client = await MongoClient.connect(MONGO_URL);
					const db = client.db(DB_NAME);
					let cursor = await db.collection(type).findOne({"uuid": uuid});
					if (cursor){
						// Update Documents
						cursor = await db.collection(type).deleteMany({"uuid": uuid});
						cursor = await db.collection(type).insertMany(request.participants);
						res.status(200).json({errcode: 0, errmsg: "", fee: fee, uuid: uuid, class: class_})
					}
					else {
						cursor = await db.collection(type).findOne({"group": group});
						// If attempts to add to same group without authorization happen
						if (cursor){
							res.status(401).json({errorcode: 10005, errmsg: 'Invalid uuid'});
						}
						else{
							// Send SMS code
							let contactName = group;
							let smsCode = "";
							let contact = "";
							switch(type){
								case "participants":
									smsCode = participantsSMSCode;
									switch(class_){
										case "17":
											contact = "张泽惠父亲 13632554826";
											break;
										case "18":
											contact = "曹炜杰母亲 13500043618";
											break;
										case "19":
											contact = "陈嘉良父亲 13602517135";
											break;
										case "20":
											contact = "毕欣怡母亲 13928497026";
											break;
										default:
											contact = "刘 颖 恒 13530240190";
									};
									break;
								case "hosts":
									smsCode = hostsSMSCode;
									break;
								case "shows":
									smsCode = showsSMSCode;
									contactName = request.meta.master;
									break;
							}

							TemplateParam = {
								name: contactName,
								uuid: uuid,
								contact: contact,
								fee: fee
							}

							await smsClient.sendSMS({
								PhoneNumbers: smsTel,
								SignName: smsSignature,
								TemplateCode: smsCode,
								TemplateParam: JSON.stringify(TemplateParam)
							});

							// Insert documents
							cursor = await db.collection(type).insertMany(request.participants);

							// TODO Return Object
							res.status(201).json({errcode: 0, errmsg: "", fee: fee, uuid: uuid, class: class_, contact: contact, amount: amount});
						}
					}
				}
			} catch(err){
				console.log(err.stack);
				next(err);
			}
		})();
	}
});

function sterilizeData(val){
	// Use 'this' to get meta info
	// Traverse attributes in input
	switch(this.type){
		case "participants":
			return new PromParticipants(val.name, val.gender, this.group, this.uuid, val.tel, this.submitTime, val.type, val.avoidance, val.class);
		case "hosts": 
			return new PromHosts(val.name, val.gender, this.group, this.uuid, val.tel, this.submitTime, val.class);
		case "shows":
			return new PromShowPerformers(val.name, val.gender, this.group, this.uuid, val.tel, this.submitTime, this.showtype, this.showtime, val.master, val.email, this.note, this.description);
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

function PromPeople(name, gender, group, uuid, tel, submitTime){
	this.name = typeof name == "string" ? name : "";
	this.gender = typeof gender == "string" ? gender : "";
	this.group = typeof group == "string" ? group : "";
	this.uuid = typeof uuid == "string" ? uuid : "";
	this.tel = typeof tel == "string" ? tel : "";
	this.submitTime = typeof submitTime == "string" ? submitTime : "";
}

function PromParticipants(name, gender, group, uuid, tel, submitTime, type, avoidance, class_){
	PromPeople.call(this, name, gender, group, uuid, tel, submitTime);
	this.type = typeof type == "string" ? type : "";
	this.avoidance = typeof avoidance == "string" ? avoidance : "";
	this.class = typeof class_ == "string" ? class_ : "";
}

function PromHosts(name, gender, group, uuid, tel, submitTime, class_){
	PromPeople.call(this, name, gender, group, uuid, tel, submitTime);
	this.class = class_;
}

function PromShowPerformers(name, gender, group, uuid, tel, submitTime,  showtype, showtime, master, email, note, description){
    PromPeople.call(this, name, gender, group, uuid, tel, submitTime);
	this.showtype = typeof showtype == "string" ? showtype : "";
	this.showtime = typeof showtime == "string" ? showtime : "";
	this.master = master == "yes" ? true : false;
	this.email = typeof email == "string" ? email : "";
	this.note = typeof note == "string" ? note : "";
	this.description = typeof description == "string" ? description : "";
}

module.exports = router;
