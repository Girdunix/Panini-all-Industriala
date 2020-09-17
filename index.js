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

MongoClient.connect(mongoKey, async function (err, db1) {
    const db =  db1.db("db");
    const orders = db.collection("Orders")
    const users = db.collection("Users")
    const masterUser = await users.findOne({name:"Paninaro"})

    //-------------------------------------------------------------//

    app.post("/placeOrder", async function (req, res) {
        let order = req.body.order
        let credentials = req.body.credentials
        let user = await users.findOne({name: credentials.username, password: credentials.password})
        if(user == null){
            res.send({sent:false, message:"Non sei loggato!"})
        }else{
            let alreadyExists = await orders.findOne({class:credentials.username})
            if(alreadyExists == null){
                await orders.insertOne(order)
                res.send({sent:true, message:"Ordine inviato!"})
            }else{
                res.send({sent:false, message:"Hai già inviato un ordine!"})
            }

        }
    })
    
    //-------------------------------------------------------------//
    
    app.post("/getOrders",async function (req,res){
        let body = req.body
        if(body.password == masterUser.password && body.username == masterUser.name){
            let toSend = await orders.find().toArray()
            res.send({sent:true, message: toSend})
        }else{
            res.send({sent:false, message:"Credenziali sbagliate!"})
        }
    })
    
    //-------------------------------------------------------------//
    
    app.post("/login",async function (req,res){
        let body = req.body
        let exists = await users.findOne({name:body.username})
        if(exists === null){
            res.send({sent:false, message:"Credenziali sbagliate!"})
        }else{
            if(exists.password == body.password){
                res.send({sent:true, message:"Login effettuato!"})
            }else{
                res.send({sent:false, message:"Credenziali sbagliate!"})
            }
        }
    })
    
    //-------------------------------------------------------------//
    
    app.post("/removeOrder",async function (req,res){
        let body = req.body
        if(body.password == masterUser.password && body.username == masterUser.name){
            orders.deleteOne({class:body.name})
            res.send({sent:true, message: "Cancellato!"})
        }else{
            res.send({sent:false, message:"Errore!"})
        }
    })

    //-------------------------------------------------------------//
    
    return
    let csvAlunni = leggiFile("./public/data/Alunni_2020.CSV")
    let alunni = elaboraDatiAlunni(csvAlunni,";")
    let classi = alunni.map(e => e[3])
    classi = uniq(classi)
    classi.forEach(e =>{
        let classObj = {
            name: e,
            password: "test_"+e
        }
        users.insertOne(classObj)
    })
})
app.get("/", function (req, res) {
    res.redirect("/html/login.html")
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
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}
function elaboraDatiAlunni(testo,delimitatore){
    let righe = testo.split("\n")
    let dati = []
    righe.forEach(riga => {
        riga = riga.replace("\r","")
        let argomenti = riga.split(delimitatore)
        dati.push(argomenti)
    })
    return dati
}