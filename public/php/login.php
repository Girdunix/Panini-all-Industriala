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


//----------------------------CONTROLLA SE LA PASSWORD E' CORRETTA---------------------------------//
$correctCredentials = mysqli_query($mysql,"SELECT psw FROM utenti WHERE username = '$data->username' AND psw = '$data->password'");
//se non esiste nessuna corrispondenza dove l'username e password sono uguali, ritorna l'errore al client 
if($correctCredentials->num_rows == 0) {
    $object = new response(false, "Credenziali Sbagliate!");
    echo $object = json_encode($object);
    exit();
}
else{    
    $object = new response(true, "Login effettuato!");
    echo $object = json_encode($object);
}

?>