<?php

class response
{
    //Questo è una classe su come il messaggio dovrebbe essere inviato
    //basta che crei una nuova response e setti se è tutto andato bene
    //nel $sent e il messaggio in $message
    var $sent;
    var $message;
    function __construct($sent, $message)
    {
        //Questo è un oggetto
        $this->sent = $sent;
        $this->message = $message;
    }
}

$data = json_decode(file_get_contents('php://input')); //dati che vengono dal client
$hostname = "localhost"; //creazione connessione al database
$utente = "";
$password = "";
$nomedatabase = "my_eatschool";
$mysql = mysqli_connect($hostname, $utente, $password, $nomedatabase);
if (!$mysql) {
    $object = new response(false, "Errore connessione!");
    echo $object = json_encode($object);
    exit();
}

//separazione delle credenziali dall'ordine
$credentials = $data->credentials;
$order = json_encode($data->order);


//----------------------------CONTROLLA SE LA PASSWORD E' CORRETTA---------------------------------//
$correctCredentials = mysqli_query($mysql,"SELECT psw FROM utenti WHERE username = '$credentials->username' AND psw = '$credentials->password'");
//se non esiste nessuna corrispondenza dove l'username e password sono uguali, ritorna l'errore al client 
if($correctCredentials->num_rows == 0) {
    $object = new response(false, "Non sei loggato!");
    echo $object = json_encode($object);
    exit();
}

//----------------------------CONTROLLA SE ESISTE GIA UN ORDINE------------------------------------//
$alreadySaved = mysqli_query($mysql,"SELECT * FROM ordini WHERE username = '$credentials->username'");
//controlla se nella table ordini esiste già un ordine da questa classe
if($alreadySaved->num_rows != 0) {
    $object = new response(false, "Hai già effettuato un ordine!");
    echo $object = json_encode($object);
    exit();
}

//----------------------------EFFETTUA L'ORDINE-----------------------------------------------------//
//se tutto i controlli di prima sono corretti, effettua l'ordine aggiungendo alla table ordini i dati ricevuti
$day = date("d");
if (mysqli_query($mysql,
"INSERT INTO ordini (username, psw, ordine, giorno)
VALUES ('$credentials->username', '$credentials->password','$order', '$day')")) {
    $object = new response(true, "Ordine effettuato!");
    echo $object = json_encode($object);
} else {
    $object = new response(false, "Errore!");
    echo $object = json_encode($object);
}
