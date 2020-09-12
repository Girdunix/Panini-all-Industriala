const MongoClient = require('mongodb').MongoClient;
const express = require("express");
let bodyParser = require('body-parser');
const fs = require('fs');
//-----------------------------//
let app = express();
let mongoKey = process.env.mongoDBKey


//app.enable('trust proxy');
app.use(express.static('public'));
app.use(bodyParser.json());
var port = process.env.PORT || 8090

//----------------------------------------------------------------------------------------------//

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
})
var server = app.listen(port, () => {
    console.log("server is running on port", server.address().port);
});
//----------------------------------------------------------------------------------------------//

MongoClient.connect(mongoKey, function (err, db1) {
})


app.get('*', function (req, res) {
    res.status(404).sendFile(__dirname + "/public/html/404.html")
})
//----------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------------------//
