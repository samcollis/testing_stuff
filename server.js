const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
var db = require('./config/db')

const app = express()

//	const port = 9000
	 const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, (err, database) => {
	if(err) return console.log(err)
	db = database.db("sam-test-api")	
	require('./app/routes')(app, db);
	
	app.listen(port, () => {
	console.log('We are live on ' + port);
	});
})

