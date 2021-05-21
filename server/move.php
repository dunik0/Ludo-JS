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
$color = $_POST["color"];
$colors = $_POST["colors"];
$move = $_POST["move"];
// echo $move;
if($move[1]>=-1 && $move[1]<7){
  $sqlGetPositions = "SELECT positions FROM $table WHERE color='$color'";
  $result = mysqli_query($conn, $sqlGetPositions);
  
  while($row = mysqli_fetch_assoc($result)) {
    $positions = json_decode($row["positions"]);
  }
  
  if($move[1] == -1){
    $positions[$move[0]] = 0;
  } elseif ($move[1] > 0){
    if($positions[$move[0]]==0){
      if($move[1]==1 || $move[1]==6){
        // $positions[$move[0]] = 44;
        $positions[$move[0]] = 1;
      }
    } elseif($positions[$move[0]]+$move[1]<45){
      $positions[$move[0]] += $move[1];
    } else {
      $positions[$move[0]] = 44 - ($move[1] - (44-$positions[$move[0]]));
    }
  }
  $positionsToJSON = json_encode($positions);
  
  $sqlUpdatePositions = "UPDATE $table SET positions='$positionsToJSON' WHERE color='$color'";
  if (mysqli_query($conn, $sqlUpdatePositions)) {
    echo "Positions changed to ".$positionsToJSON;
  } else {
    echo "Error updating record: ".mysqli_error($conn);
  }

  if($move[1]>-1){
    $sqlUpdateStatus = "UPDATE $table SET status=2 WHERE color='$color'";
    mysqli_query($conn, $sqlUpdateStatus);
    // echo json_encode($colors);
    $index = array_search($color, $colors);
    if($index+1==count($colors)){
      $index = 0;
    } else {
      $index++;
    }
    $color = $colors[$index];
    $sqlUpdateStatus = "UPDATE $table SET status=3 WHERE color='$color'";
    mysqli_query($conn, $sqlUpdateStatus);
  }
  
} else {
  echo "Error - Illegal move";
}

// if($positions[$move[0]]+$move[1]==44) {
//   unset($positions[$move[0]]);  
//   $positionsToJSON = json_encode($positions);
//   $sqlUpdatePositions2 = "UPDATE $table SET positions='$positionsToJSON' WHERE color='$color'";
//   mysqli_query($conn, $sqlUpdatePositions);
// }

$conn->close();
