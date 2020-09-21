/*
  MIT License

Copyright (c) 2020, the respective contributors, as shown by the AUTHORS file. 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
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
            res.send({sent:true, message: "Ordine cancellato!"})
        }else{
            res.send({sent:false, message:"Errore!"})
        }
    })

    //-------------------------------------------------------------//
    
    let csvAlunni = leggiFile("./public/data/Alunni_2020.CSV")
    let alunni = elaboraDatiAlunni(csvAlunni,";")
    let classi = alunni.map(e => e[3])
    classi = uniq(classi)
    let finalData = ""
    classi.forEach(e =>{
        finalData+=e + " ; "+makeid(8)+"\n"
    })
    return
    fs.writeFileSync(__dirname+"/users.txt",finalData)
    console.log("Aggiunti utenti")
})
app.get("/", function (req, res) {
    res.redirect("/html/login.html")
})
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

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