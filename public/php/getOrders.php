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
$day = date("d");
mysqli_query($mysql,"DELETE FROM ordini where giorno <>'$day'"); //cancella tutti gli ordini che non sono di questo giorno
$showOrders = mysqli_query($mysql,"SELECT ordine,stato,username FROM ordini"); //seleziona tutte le righe della tabella ordini
$arr = [];
while ($row = $showOrders -> fetch_row()) {
    try{
        $usernameClass = $mysql->real_escape_string($row[2]);
        $classNumber = mysqli_query($mysql,"SELECT numClasse FROM utenti WHERE username = '$usernameClass'") -> fetch_row()[0];
        $order = new stdClass();
        $order->order = json_decode($row[0]);
        $order->classNumber = $classNumber;
        $order->status = $row[1];
        array_push($arr,$order); //itera la query e lo aggiunge ad un array da inviare al client
    }catch(Exception $e){

    }

  }
echo json_encode(new response(true,$arr));
?>