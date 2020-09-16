const MongoClient = require('mongodb').MongoClient;
const express = require("express");
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const mongoKey = "mongodb+srv://Specy:vDKMRDYSE3AeLoyT@spedata.db6ta.mongodb.net/speData?retryWrites=true&w=majority"
//app.enable('trust proxy');
app.use(express.static('public'));
app.use(bodyParser.json());
const port = process.env.PORT || 8090

//----------------------------------------------------------------------------------------------//

MongoClient.connect(mongoKey, function (err, db1) {
    const db = db1.db("db");
    const orders = db.collection("Orders")
    app.post("/placeOrder", async function (req, res) {
        await orders.insertOne(req.body)
        res.send({sent:true, message:"Ordine inviato!"})
        console.log("Ordine effettuato")
    })
    app.post("/getOrders",async function (req,res){
        let body = req.body
        if(body.password == "test" && body.username == "master"){
            let toSend = await orders.find().toArray()
            res.send({sent:true, message: toSend})
        }else{
            res.send({sent:false, message:"Errore!"})
        }
    })
    app.post("/removeOrder",async function (req,res){
        let body = req.body
        if(body.password == "test" && body.username == "master"){
            orders.deleteOne({class:body.name})
            res.send({sent:true, message: "Cancellato!"})
        }else{
            res.send({sent:false, message:"Errore!"})
        }
    })  
})
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/html/food_list.html")
})


app.get('*', function (req, res) {
    //Se si sta richiedendo una risorsa che non esiste, DEVE ESSERE SEMPRE COME ULTIMO
    res.status(404).sendFile(__dirname + "/public/html/404.html")
})
//MongoClient.connect(mongoKey, function (err, db) {})
var server = app.listen(port, () => {
    console.log("server is running on port", server.address().port);
});

//----------------------------------------------------------------------------------------------//
//----------------------------------------------------------------------------------------------//

function leggiFile(path){
   return fs.readFileSync(path,"utf8")
}