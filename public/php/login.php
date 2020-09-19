<?php   
class response{
    var $sent;
    var $message;
    function __construct($sent, $message) {
        $this->sent = $sent;
        $this->message = $message;
    }
}
$object = new response(true, "Logged!");
$object = json_encode($object);
echo $object;
?>

