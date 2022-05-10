<?php

session_start();

include_once ("../php/DataAdapter.php");
include_once ("../php/data.php");
$data = new DataAdapter();

if($data->activateUser($_GET["token"])) {
    header('Location: https://geiooo.net/webdows');
}

?>