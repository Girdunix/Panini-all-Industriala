const MongoClient = require('mongodb').MongoClient;
const express = require("express");
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const mongoKey = process.env.mongoDBKey
//app.enable('trust proxy');
app.use(express.static('public'));
app.use(bodyParser.json());
const port = process.env.PORT || 8090
//------------CLASSI---------------//
const Alunno = require("./data/Classi/Alunno.js")
//-------------DATI----------------//
let csvAlunni = leggiFile("./data/Alunni_2020.CSV")
let alunni = elaboraDatiAlunni(csvAlunni,";")
//----------------------------------------------------------------------------------------------//

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
})

app.get("/getDatiAlunni",function(req,res) {
    res.send(alunni)
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

function elaboraDatiAlunni(testo,delimitatore){
    let righe = testo.split("\n")
    let dati = []
    righe.forEach(riga => {
        riga = riga.replace("\r","")
        let argomenti = riga.split(delimitatore)
        dati.push(new Alunno(argomenti))
    })
    return dati
}