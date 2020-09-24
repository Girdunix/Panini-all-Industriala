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
if($masterPsw != $data->credentials->password){
    //accesso solo al paninaro
    echo json_encode(new response(false, "Non sei loggato!"));
    exit();
}
$data->name = $mysql->real_escape_string($data->name);
$data->status = $mysql->real_escape_string($data->status);
if(mysqli_query($mysql,"UPDATE ordini SET stato='$data->status' WHERE username='$data->name'")){
    echo json_encode(new response(true, "Cambiato status!"));
}else{
    echo json_encode(new response(false, "Errore!"));
}

?>