<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = 'nppDemo_db';

// Create connection
$conn = new mysqli($servername, $username, $password,$dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if($_REQUEST['section'] == 'state_level'){

    $sql = "SELECT 
             state_discom_mapping_tbl.state_id,
             `state_tbl`.`state_name`,
             state_discom_mapping_tbl.`discom_id`,
             state_discom_mapping_tbl.`town_name`,
             state_tbl.`location`,
             COUNT(*) AS 'total_towns'
            FROM
             `state_tbl` 
             LEFT JOIN `state_discom_mapping_tbl` 
               ON `state_discom_mapping_tbl`.`state_id` = `state_tbl`.`state_id` 
               WHERE state_discom_mapping_tbl.`state_id` = '27'
            GROUP BY state_discom_mapping_tbl.`discom_id`  ";

}else{

    $sql = "SELECT 
         state_discom_mapping_tbl.state_id,
         state_discom_mapping_tbl.`discom_id`,
         state_discom_mapping_tbl.`town_name`,
         state_tbl.`location`
        FROM
         `state_tbl` 
         LEFT JOIN `state_discom_mapping_tbl` 
           ON `state_discom_mapping_tbl`.`state_id` = `state_tbl`.`state_id` 
GROUP BY state_discom_mapping_tbl.`discom_id` ";

}

$result = $conn->query($sql);
$datatoReturn = array();

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        $datatoReturn[] = $row;
    }
} else {
    echo "0 results";
}

echo json_encode($datatoReturn);

$conn->close();

?>