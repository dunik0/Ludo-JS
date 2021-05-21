<?php
include 'passwd.php';


$_POST = json_decode(file_get_contents('php://input'), true);
// echo json_encode($_POST);
$colors = array("blue", "red", "green", "yellow");

// Create connection
$conn = new mysqli($servername, $username, $password, $db);
$GLOBALS['conn'] = $conn;

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

function createTable($index) {
  if($index<10) $tableName = "room0".$index;
  else $tableName = "room".$index;
  
  $sqlTable = "CREATE TABLE $tableName (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    color VARCHAR(30) NOT NULL,
    status INT(6) UNSIGNED,
    positions VARCHAR(30) NOT NULL,
    place INT(6) UNSIGNED)";
  if ($GLOBALS['conn']->query($sqlTable) === TRUE) {
    $GLOBALS['table'] = $tableName;
    // echo "Table $tableName created successfully";
  } else {
    echo "Error creating table: " . $GLOBALS['conn']->error;
  }
}

if (isset($_POST["name"])) {
  if(strlen($_POST["name"])>0){
    //$name = urlencode($_POST["name"]);
    $name = $_POST["name"];
    $status = 0;
    $color = $colors[rand( 0, 3 )];
    $usedColors = [];
    $positions = json_encode(array(0, 0, 0, 0));
  
    $listdbtables = array_column(mysqli_fetch_all($conn->query('SHOW TABLES')),0);
    $newTableIndex = count($listdbtables);
  
    if (count($listdbtables)==0){
      createTable($newTableIndex);
    } else {
      $openRooms = array();
      foreach ($listdbtables as $table){
        $started = false;
        $usedColors = [];
        $sqlFindPlayers = "SELECT * FROM $table";
        $playersList =  mysqli_query($conn, $sqlFindPlayers);
        while($row = mysqli_fetch_assoc($playersList)) {
          if($row["status"]>1){
            $started = true;
            break;
          } else {
            $usedColors[] = $row["color"];
          }
        }
        if($started==false){
          if($playersList->num_rows<4){
            $openRooms[] = $table;
          }
        }
      }
      // echo "Open rooms: ".json_encode($openRooms);
      if(count($openRooms)>0){
        $GLOBALS['table'] = $openRooms[0];
      } else {
        createTable($newTableIndex);
        $usedColors = [];
      }
    }
    $table = $GLOBALS['table'];
    $sqlFindDuplicate = "SELECT name FROM $table WHERE name='$name'";
    $result = mysqli_query($conn, $sqlFindDuplicate);
    // echo "Selected rows: ".$result->num_rows;

    if ($result->num_rows==0) { // If no dupilicate
      $colorDuplicate = array_search($color, $usedColors);
      while(strlen($colorDuplicate)==1){
        $color = $colors[rand( 0, 3 )];
        $colorDuplicate = array_search($color, $usedColors);
      }
      
      
      $sqlInsert = "INSERT INTO $table (id, name, color, status, positions) VALUES (null, '$name', '$color', '$status', '$positions')";
      if ($conn->query($sqlInsert) === TRUE) {
        echo $table;
      } else {
        echo "Error inserting" . $conn->error;
      }
    } else 
       echo "Error trying to save duplicate record";
  } else
      echo "Incorrect username";
}

$conn->close();
