<?php
include 'passwd.php';

$_POST = json_decode(file_get_contents('php://input'), true);

// Create connection
$conn = new mysqli($servername, $username, $password, $db);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$table = $_POST["room"];
$colors = $_POST["colors"];
$color = $colors[0];
$update = true;

$sqlGetStatus = "SELECT status FROM $table";
if ($result = mysqli_query($conn, $sqlGetStatus)) {
    while($row = mysqli_fetch_assoc($result)) {
        if($row["status"]==3){
            $update = false;
        }
    }
}
if($update){
    $sql1 = "UPDATE $table SET status=2";
    mysqli_query($conn, $sql1);

    $sql2 = "UPDATE $table SET status=3 WHERE color='$color'";
    if (mysqli_query($conn, $sql2)) {
        echo "Game started";
    } else {
        echo "Error updating record: " . mysqli_error($conn);
    }
} else {
    echo "Game already started";
}


$conn->close();
