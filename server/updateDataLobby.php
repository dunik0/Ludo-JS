<?php
class Player 
{
  public $id;
  public $name;
  public $color;
  public $status;
  public $positions;
  public function __construct($id, $name, $color, $status, $positions)
  {
      $this->id = $id;
      $this->name = $name;
      $this->color = $color;
      $this->status = $status;
      $this->positions = $positions;
  }
}
include 'passwd.php';

$_POST = json_decode(file_get_contents('php://input'), true);

// Create connection
$conn = new mysqli($servername, $username, $password, $db);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$table = $_POST["room"];

$sql = "SELECT * FROM $table";
$result = $conn->query($sql);
$players = array();
$statusCheck = 0;
$command = "";

while($row = mysqli_fetch_assoc($result)) {
  $players[] = new Player($row["id"], $row["name"], $row["color"], $row["status"], $row["positions"]);
  $statusCheck += $row["status"];
}

  if(($statusCheck>=count($players))&&(count($players)>1)){
    $command = "start";
  } else {
    $command = "wait";
  } 

// //} else {
//   $sqlStartGame = "UPDATE $table SET status=2";
//   if (mysqli_query($conn, $sqlStartGame)) {
//     $command = "wait";
//   } else {
//     $command = "waitP";
// }
// }


$response = array($command, $players);
echo json_encode($response);




$conn->close();