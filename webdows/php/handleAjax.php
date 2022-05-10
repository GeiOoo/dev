<?php

session_start();
$response = "";
include_once ("data.php");
include_once ("DataAdapter.php");

switch($_POST["action"]) {
    case "login":
        if(!$_SESSION["userId"]) {
            $data = new DataAdapter();
            $response = $data->login($_POST["login"], $_POST["password"]);
        } else {
            $response = $_SESSION["userId"];
        }
        break;
    case "newUser":
        if(!$_SESSION["userId"]) {
            $data = new DataAdapter();
            $response = $data->newUser($_POST["login"], $_POST["password"], $_POST["mail"]);
        }
        break;
    case "logout":
        unset($_SESSION["userId"]);
        break;
    case "checkLogin":
        echo isset($_SESSION["userId"]);
        break;
}

echo json_encode($response)

?>