<?php
include 'passwd.php';


$_POST = json_decode(file_get_contents('php://input'), true);

// Create connection
$conn = new mysqli($servername, $username, $password, $db);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$name = $_POST["name"];
$table = $_POST["room"];
$sql = "SELECT status FROM $table WHERE name='$name'";
if ($result = mysqli_query($conn, $sql)) {
    while($row = $result->fetch_assoc()) {
        $status = $row["status"];
      }
  }

if($status==0)
    $status++;
elseif ($status==1)
    $status--;

$sql1 = "UPDATE $table SET status=$status WHERE name='$name'";
if (mysqli_query($conn, $sql1)) {
    echo "Status changed to $status";
  } else {
    echo "Error updating record: " . mysqli_error($conn);
  }





$conn->close();
