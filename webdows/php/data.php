<?php

const d_home = "https://geiooo.net/webdows";

function varDumpArray($array) {
    echo "<pre>".var_export($array, true)."</pre>";
}

function backslashToSlash($string) {
    return str_replace("\\", "/", $string);
}

function removeDots($string) {
    return str_replace("..", "", $string);
}

function dblSlashToSlash($string) {
    return str_replace("//", "/", $string);
}

?>