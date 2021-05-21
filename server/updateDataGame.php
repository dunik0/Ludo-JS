<?php
class Player 
{
  public $id;
  public $name;
  public $color;
  public $status;
  public $positions;
  public $place;
  public function __construct($id, $name, $color, $status, $positions, $place)
  {
      $this->id = $id;
      $this->name = $name;
      $this->color = $color;
      $this->status = $status;
      $this->positions = $positions;
      $this->place = $place;
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

// $sqlUpdateStatus = "UPDATE $table SET status=3 WHERE id=1";
// mysqli_query($conn, $sqlUpdateStatus);

$sql = "SELECT * FROM $table";
$result = mysqli_query($conn, $sql);
$players = array();
// $statusCheck = 0;

while($row = mysqli_fetch_assoc($result)) {
  $players[] = new Player($row["id"], $row["name"], $row["color"], $row["status"], $row["positions"], $row["place"]);
//   $statusCheck += $row["status"];
}


echo json_encode($players);




$conn->close();