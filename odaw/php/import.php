<?php

function importJS($path) {
    $scripts = "";
    $files = scandir($path, SCANDIR_SORT_DESCENDING);
    $files = array_slice($files, 0, sizeof($files)-2);
    foreach ($files as $file) {
        if($file[0] != "_") {
            if(is_dir($path.$file)) {
                $scripts .= importJS($path.$file."/");
            } else if(dirname(__FILE__)."../".is_file($path)){
                $scripts .= "\t<script src='$path$file'></script>\n";
            }
        }
    }
    return $scripts;
}

function importCSS($path) {
    $scripts = "";
    $files = scandir($path, SCANDIR_SORT_DESCENDING);
    $files = array_slice($files, 0, sizeof($files)-2);
    foreach ($files as $file) {
        if($file[0] != "_") {
            if(is_dir($path.$file)) {
                $scripts .= importJS($path.$file."/");
            } else if(dirname(__FILE__)."../".is_file($path)){
                $scripts .= "\t<link type='text/css' rel='stylesheet' href='$path$file'>\n";
            }
        }
    }
    return $scripts;
}

?>