<?php

session_start();
unset($_SESSION["userId"]);

/**
 * new user test
 */
//$_POST["action"] = "newUser";
//$_POST["login"] = "Guest";
//$_POST["password"] = "Guest";
//$_POST["mail"] = "guest@geiooo.net";

/**
 * login test
 */
//$_POST["action"] = "login";
//$_POST["login"] = "Test";
//$_POST["password"] = "Test";

/**
 * show $_SESSION
 */

$token = "";
for($i = 0; $i < 2; $i++) {
    $token .= rand(0, 9);
}
echo $token;

//include_once ("../handleAjax.php");

//varDumpArray($_SESSION);
//varDumpArray($_POST);
//varDumpArray($response);

?>