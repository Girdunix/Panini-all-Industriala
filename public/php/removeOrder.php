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
$data = json_decode(file_get_contents('php://input'));
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
$masterPsw = mysqli_query($mysql,"SELECT psw FROM utenti WHERE username = 'Paninaro'");
$masterPsw = $masterPsw -> fetch_row()[0];
if($masterPsw != $data->password){
    //accesso solo al paninaro
    echo json_encode(new response(false, "Non sei loggato!"));
    exit();
}
if(mysqli_query($mysql,"DELETE FROM ordini WHERE username = '$data->name'")){
    $reponse = new response(true, "Ordine rimosso!");
}else{
    $reponse = new response(false, "Errore nella rimozione!");
}

echo json_encode($reponse)
?>