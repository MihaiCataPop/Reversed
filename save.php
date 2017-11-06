<?php
include "DB/DB-Connect.php";
if(isset($_POST["player"]) && isset($_POST["table"])) {
    $table = json_encode($_POST["table"]);
    $player = $_POST["player"];
    $sql = "UPDATE reversitable SET position='$table', player=$player WHERE id = 1";
    $conn->query($sql);
}

$conn->close();

?>