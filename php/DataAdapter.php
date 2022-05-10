<?php

include_once ("globalFn.php");

class DataAdapter {

    private $conn;

    function __construct() {
        include_once ("dbConnect.php");
        $this->conn = new mysqli(dbHost, dbUser, dbPassword, dbName);
        if ($this->conn->connect_errno) {
            printf("Connect failed: %s\n", $this->conn->connect_error);
            exit();
        }
    }

    public function insertDelFile($name, $path, $time) {
        $stm = $this->conn->prepare("INSERT INTO delFiles(name, path, datAend) VALUES (?, ?, ?)");
        $stm->bind_param("sss", $name, $path, $time);
        $stm->execute();
        $stm->close();
        $this->conn->close();
    }

    public function getRecoveryPath($name, $ts) {
        $data = [];
        $stm = $this->conn->prepare("SELECT path FROM delFiles WHERE name = ? AND datAend = ?");
        $stm->bind_param("si", $name, $ts);
        $stm->execute();
        $result = $stm->get_result();
        while ($row = $result->fetch_array(MYSQLI_NUM))
        {
            $data[] = $row;
        }
        if(count($data) == 1) {
            return $data[0][0];
        }
        return "";
    }

    public function deleteRow($name, $ts) {
        $stm = $this->conn->prepare("DELETE FROM delFiles WHERE name = ? AND datAend = ?");
        $stm->bind_param("si", $name, $ts);
        $stm->execute();
    }
}
