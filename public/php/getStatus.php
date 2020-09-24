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
$data->name = $mysql->real_escape_string($data->name);
$query = mysqli_query($mysql,"SELECT ordine,stato FROM ordini WHERE username = '$data->name'");
if($query->num_rows > 0){
    $query = $query -> fetch_row();
    $order = new stdClass();
    $order->order = json_decode($query[0]);
    $order->status =  $query[1];
    echo $object = json_encode(new response(true, $order));
}else{
    echo $object = json_encode(new response(false, "Il carrello è vuoto!"));
    exit();
}