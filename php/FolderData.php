<?php
include_once("globalFn.php");

class FolderData {

    private $rootPath;
    private $userPath;
    private $delPath;
    private $requestPath;
    private $completePath;
    private $filePathRel;
    private $filePath;

    function __construct($user = "", $request = "", $backStep = false) {
        $this->rootPath = backslashToSlash(dirname(__FILE__)."/data/");
        $this->userPath = backslashToSlash($user."/");
        $this->delPath = backslashToSlash(dirname(__FILE__)."/del/");
        if($user) $this->rootPath .= $this->userPath;
        $this->requestPath = removeDots(backslashToSlash($request));
        $this->completePath = dblSlashToSlash($this->rootPath.$this->requestPath);
        if($backStep) $this->filePath = $this->getBackstepPath($this->completePath);
        else $this->filePath = $this->completePath;
        $this->filePathRel = str_replace($this->rootPath, "", $this->filePath);
    }

    public function uploadFile() {
        $respons = "";
        if(file_exists($this->completePath.$_FILES["file"]["name"])) {
            $respons = "fileExist";
        } else {
            if(move_uploaded_file($_FILES["file"]["tmp_name"], $this->completePath.$_FILES["file"]["name"])) {

            } else {
                $respons = "uploadFailes";
            }
        }
        return $respons;
    }

    function recovery($name, $path) {
        $fullPath = $this->completePath.$path;
        if(is_dir(realpath($fullPath."/../"))) {

        } else {
            if(is_dir(realpath($fullPath."/../../"))) {
                mkdir(realpath($fullPath."/../"), 0777);
            } else {
                $this->recovery("", realpath($fullPath."/../"));
            }
        }
        if(!empty($name)) {
            return rename(dblSlashToSlash($this->delPath.$name), dblSlashToSlash($fullPath));
        }
        return false;

    }

    public function renameFile($new, $old) {
        if(rename($this->completePath.$old, $this->completePath.$new)) {
            return "Done";
        } else {
            return "Failed";
        }
    }

    public function getFolderContent() {
        $dir = $this->scanDir();
        $data = $this->folderDataToArray($dir);
        $jData = json_encode($data);
        return $jData;
    }

    public function getTrashContent() {
        $dir = $this->scanDir();
        $data = $this->folderDataToArray($dir);
        foreach ($data as &$record) {
            $record["ts"] = substr($record["name"], 0, 10);
            $record["name"] = substr($record["name"], 10);
        }
        $jData = json_encode($data);
        return $jData;
    }

    public function getFolderContentDebug() {
        $dir = $this->scanDir();
        $data = $this->folderDataToArray($dir);
        varDumpArray($data);
        varDumpArray($this);
        echo realpath($this->filePath);
    }

    public function createFolder() {
        if(is_dir($this->filePath))mkdir($this->filePath."Neu", 0777);
    }

    public function deleteFile($name = "", $ts = "") {
        $path = $this->delPath.$ts.$name;
        if(strlen($path) > strlen(dblSlashToSlash(realpath($this->delPath)))) {
            foreach(glob($path."/*") as $key => $val) {
                if(is_dir($val)) {
                    $this->deleteFile($val);
                } else {
                    unlink($val);
                }
            }
            if(is_dir($path)) rmdir($path);
            else unlink($path);
        }
    }

    public function pDeleteFile() {
        include_once ("DataAdapter.php");
        $fileInfo = pathinfo($this->filePath);
        $delPath = realpath($this->rootPath."/../del");
        $ts = time();
        $newPath = $delPath."/".$ts.$fileInfo["basename"];
        rename($this->filePath, $newPath);

        $data = new DataAdapter();
        $data->insertDelFile($fileInfo["basename"], $this->requestPath, $ts);
    }

    public function getFilePath() {
        return "/php/data/".$this->filePathRel;
    }

    public function getDelFolder() {
        $this->filePath = $this->delPath;
        $this->filePathRel = "";
        return $this->getTrashContent();
    }

    public function getDelFolderDebug() {
        $this->filePath = $this->delPath;
        $this->filePathRel = "";
        $this->getFolderContentDebug();
    }

    private function getBackstepPath($path) {
        return (strlen(backslashToSlash(realpath($path . "../") . "/")) < strlen($this->rootPath)) ? backslashToSlash(realpath($path) . "/") : backslashToSlash(realpath($path . "../") . "/");
    }

    private function scanDir() {
        return (is_dir($this->filePath))? scandir($this->filePath) : scandir($this->rootPath);
    }

    private function folderDataToArray($dir) {
        $data = [];

        for($x = 2; $x < sizeof($dir); $x++) {
            $type = $this->getDataType($dir[$x]);
            $filetime = date("d.m.Y H:i", filemtime($this->filePath.$dir[$x]));
            $fileType = $this->getFileType(strtolower($type));
            $fileTypeShort = $this->getFileTypeShort(strtolower($type));
            $filesize = ($fileTypeShort != "folder")? $this->formatSizeUnits(filesize($this->filePath.$dir[$x])) : "";

            $data[$x-2] = array(
                "name" => str_replace($type, "", $dir[$x]),
                "type" => $type,
                "path" => (strlen($this->filePathRel) > 0)? "/".$this->filePathRel : "/" ,
                "time" => $filetime,
                "size" => $filesize,
                "fileType" => $fileType,
                "fileTypeShort" => $fileTypeShort
            );
        }

        if(sizeof($data) == 0) {
            $data[0] = array(
                "name" => "Dieser Ordner ist leer.",
                "backStep" => (empty($this->backstep))? false : true,
                "path" => $this->requestPath."/"
            );
        }
        return $data;
    }

    private function getDataType($data) {
        $type = "";
        for($x = strlen($data);$x > 0; $x--) {
            if(substr($data, $x, 1) == ".") {
                $type = substr($data, $x);
                $x = -1;
            }
        }
        return $type;
    }

    private function getFileType($type) {
        switch($type) {
            case ".jpg":
            case ".png":
            case ".gif":
            case ".bmp": return strtoupper(substr($type, 1))."-Bild";break;
            case ".txt":
            case ".js":
            case ".php":
            case ".css":
            case ".ini": return strtoupper(substr($type, 1))."-Textdokument";break;
            case ".flv":
            case ".mp4":
            case ".webm": return strtoupper(substr($type, 1))."-Video";break;
            case ".mp3":
            case ".mpeg":
            case ".wav":
            case ".aac":
            case ".ogg": return strtoupper(substr($type, 1))."-Audio";break;
            case ".pdf": return strtoupper(substr($type, 1))."-Dokument";break;
            case ".zip":
            case ".rar": return strtoupper(substr($type, 1))."-Archiv";break;
            case "": return "Dateiordner";break;
            default: return "Unbekannt";break;
        }
    }

    private function getFileTypeShort($type) {
        switch($type) {
            case ".jpg":
            case ".png":
            case ".gif":
            case ".bmp": return "pic";break;
            case ".txt":
            case ".js":
            case ".php":
            case ".css":
            case ".ini": return "txt";break;
            case ".flv":
            case ".mp4":
            case ".webm": return "vid";break;
            case ".mp3":
            case ".mpeg":
            case ".wav":
            case ".aac":
            case ".ogg": return "audio";break;
            case ".pdf": return "pdf";break;
            case ".zip":
            case ".rar": return "archive";break;
            case "": return "folder";break;
            default: return "unknown";break;
        }
    }

    function formatSizeUnits($bytes) {
        if ($bytes >= 1073741824)
        {
            $bytes = number_format($bytes / 1073741824, 2) . ' GB';
        }
        elseif ($bytes >= 1048576)
        {
            $bytes = number_format($bytes / 1048576, 2) . ' MB';
        }
        elseif ($bytes >= 1024)
        {
            $bytes = number_format($bytes / 1024, 2) . ' kB';
        }
        elseif ($bytes > 1)
        {
            $bytes = $bytes . ' bytes';
        }
        elseif ($bytes == 1)
        {
            $bytes = $bytes . ' byte';
        }
        else
        {
            $bytes = '0 bytes';
        }
        return $bytes;
    }
}
?>