<?php
include "DB/DB-Connect.php";

$sql = "SELECT * FROM reversitable WHERE id = 1";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();

    $date = array(
        "player" => $row["player"],
        "table" => json_decode($row["position"]),
    );

    echo json_encode($date);
}

$conn->close();

?>