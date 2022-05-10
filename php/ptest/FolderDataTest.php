<?php

require_once("../FolderData.php");
require_once("../globalFn.php");

$user = "";
$requestPath = "/";
$backStep = false;

$fData = new FilesFolder($user, $requestPath, $backStep);
$fData->getTrashContentDebug();

?>