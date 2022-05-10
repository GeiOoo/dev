<?php

include_once("globalFn.php");
include_once("FolderData.php");
include_once ("DataAdapter.php");
$respons = "";
switch ($_POST["action"]) {
    case "folderContent":
        $path = (isset($_POST["path"]))? $_POST["path"] : "";
        $user = (isset($_POST["user"]))? $_POST["user"] : "";
        $backStep = ($_POST["backStep"])? $_POST["backStep"] : false;
        $folderData = new FolderData($user, $path, $backStep);
        $respons = $folderData->getFolderContent();
        break;
    case "createFolder":
        $user = (isset($_POST["user"]))? $_POST["user"] : "";
        $path = (isset($_POST["path"]))? $_POST["path"] : "";
        $folderData = new FolderData($user, $path);
        $folderData->createFolder();
        break;
    case "pDeleteFile":
        $user = (isset($_POST["user"]))? $_POST["user"] : "";
        $path = (isset($_POST["path"]))? $_POST["path"] : "";
        $date = (isset($_POST["date"]))? $_POST["date"] : "";
        $folderData = new FolderData($user, $path);
        $folderData->pDeleteFile();
        break;
    case "deleteFile":

        $user = (isset($_POST["user"]))? $_POST["user"] : "";
        $name = (isset($_POST["name"]))? $_POST["name"] : "";
        $ts = (isset($_POST["ts"]))? $_POST["ts"] : "";
        $folderData = new FolderData();
        $data = new DataAdapter();
        $folderData->deleteFile($name, $ts);
        $data->deleteRow($name, $ts);
        break;
    case "trashContent":
        $folderData = new FolderData();
        $respons = $folderData->getDelFolder();
        break;
    case "uploadFile":
        $path = (isset($_POST["path"]))? $_POST["path"] : "";
        $user = (isset($_POST["user"]))? $_POST["user"] : "";
        $backStep = ($_POST["backStep"])? $_POST["backStep"] : false;
        $folderData = new FolderData($user, $path, $backStep);
        $respons = $folderData->uploadFile();
        break;
    case "renameFile":
        $path = (isset($_POST["path"]))? $_POST["path"] : "";
        $user = (isset($_POST["user"]))? $_POST["user"] : "";
        $backStep = ($_POST["backStep"])? $_POST["backStep"] : false;
        $ending = (!empty($_POST["ending"]))? $_POST["ending"] : "/";
        $newName = (isset($_POST["newName"]))? $_POST["newName"] : "";
        $oldName = (isset($_POST["oldName"]))? $_POST["oldName"] : "";
        $folderData = new FolderData($user, $path, $backStep);
        $respons = $folderData->renameFile($newName.$ending, $oldName.$ending);
        break;
    case "recovery" :
        $name = (isset($_POST["name"]))? $_POST["name"] : "";
        $ts = (isset($_POST["ts"]))? $_POST["ts"] : "";
        $folderData = new FolderData();
        $data = new DataAdapter();
        $path = $data->getRecoveryPath($name, $ts);
        if($folderData->recovery($ts.$name, $path)) {
            $data->deleteRow($name, $ts);
        }
        break;
    case "downloadFile":
        $user = (isset($_POST["user"]))? $_POST["user"] : "";
        $path = (isset($_POST["path"]))? $_POST["path"] : "";
        $folderData = new FolderData($user, $path);
        $respons = $folderData->getFilePath();
        break;
    default: $respons = "";
}
echo $respons;
?>