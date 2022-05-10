templates = {<?php echo importTemplates("../templates/");

function importTemplates($path) {
    $templates = "";
    $files = scandir($path, SCANDIR_SORT_DESCENDING);
    $files = array_slice($files, 0, sizeof($files)-2);
    foreach ($files as $file) {
        if($file[0] != "_") {
            if(is_dir($path.$file)) {
                $templates .= importJS($path.$file."/");
            } else if(dirname(__FILE__)."../".is_file($path)){
                $templates .= "\n\t\"".substr($file, 0, -5)."\": \"".preg_replace( "/\r|\n|\s{2,}/", "", addslashes(file_get_contents($path.$file)))."\",";
            }
        }
    }
    return substr($templates, 0, -1)."\n";
}
?>};