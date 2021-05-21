<?php
include 'passwd.php';

$_POST = json_decode(file_get_contents('php://input'), true);

// Create connection
$conn = new mysqli($servername, $username, $password, $db);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$color = $_POST["color"];
$table = $_POST["room"];
$sqlGetPositions = "SELECT positions FROM $table WHERE color='$color'";
if ($result = mysqli_query($conn, $sqlGetPositions)) {
    $positions = json_decode(mysqli_fetch_all($result)[0][0]);
    // echo json_encode($positions);
    $sum = 0;
    foreach($positions as $pos){
       $sum += $pos;
    }
    // if($sum == 44){
    if($sum == 44*4){
        $sqlGetPlaces = "SELECT place FROM $table";
        $result = mysqli_query($conn, $sqlGetPlaces);
        $place = 1;
        while ($row = mysqli_fetch_assoc($result)) {
            if($row["place"]!=null){
                $place++;
            }
        }
        $sqlUpdatePlace = "UPDATE $table SET place=$place WHERE color='$color'";
        if (mysqli_query($conn, $sqlUpdatePlace)) {
            echo "Place changed to $place";
        } else {
            echo "Error updating record: " . mysqli_error($conn);
        }
        $sqlUpdateStatus = "UPDATE $table SET status=4 WHERE color='$color'";
        mysqli_query($conn, $sqlUpdateStatus);

        $sqlCountRows =  "SELECT COUNT(*) AS num FROM `$table`";
        $result= mysqli_query($conn, $sqlCountRows);
        $row = mysqli_fetch_assoc( $result );     
        if( $place + 1 == $row['num'] ) {
            $sqlUpdateLastStatus = "UPDATE $table SET status=4";
            mysqli_query($conn, $sqlUpdateLastStatus);
        }
    }
}



$conn->close();
