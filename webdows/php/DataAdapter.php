<?php

include_once ("data.php");

class DataAdapter {

    private $conn;
    private $statement;
    private $response = array();

    function __construct() {
        try {
            include_once ("dbConnect.php");
            $this->conn = new PDO("mysql:host=".dbHost.";dbname=".dbName,dbUser, dbPassword);
        } catch(PDOException $e) {
            echo 'Verbindung fehlgeschlagen: ' . $e->getMessage();
        }
    }

    public function login($login, $password) {
        $this->statement = $this->conn->prepare("SELECT id, activated FROM user WHERE login = :login AND password = :password");
        $this->onPdoError();
        $this->statement->execute(array(":login" => $login, ":password" => md5($password)));
        if($row = $this->statement->fetch(PDO::FETCH_ASSOC)) {
            if($row["activated"] == 1) {
                $this->response["response"] = $_SESSION["userId"] = $row["id"];
            } else $this->response["response"] = "activate";
        } else $this->response["response"] = "failed";

        return $this->response;
    }

    public function newUser($login, $password, $mail) {
        if (filter_var($mail, FILTER_VALIDATE_EMAIL)) {
            $this->statement = $this->conn->prepare("SELECT id FROM user WHERE login = :login");
            $this->onPdoError();
            $this->statement->execute(array(":login" => $login));
            if ($row = $this->statement->fetch(PDO::FETCH_ASSOC)) {
                return array("response" => "login");
            }

            $this->statement = $this->conn->prepare("SELECT id FROM user WHERE mail = :mail");
            $this->onPdoError();
            $this->statement->execute(array(":mail" => $mail));
            if ($row = $this->statement->fetch(PDO::FETCH_ASSOC)) {
                return array("response" => "mail");
            }

            $this->statement = $this->conn->prepare("INSERT INTO user(login, password, mail, token) VALUES(:login, :password, :mail, :token)");
            $this->onPdoError();
            $token = $this->getRandomToken();
            $this->statement->execute(array(":login" => $login, ":password" => md5($password), ":mail" => $mail, ":token" => $token));
            if ($id = $this->conn->lastInsertId()) {
                $this->response["response"] = "activate";
                $this->response["mail"] = $mail;
                $subject = 'Account activation';
                $message = $this->getActivateMail($token);
                $headers = 'From: Webdows@geiooo.net' . "\r\n" .
                    'Reply-To: Webdows@geiooo.net' . "\r\n" .
                    'X-Mailer: PHP/' . phpversion();

                mail($mail, $subject, $message, $headers);
            } else $this->response["response"] = "failed";
        } else return array("response" => "format");

        return $this->response;
    }

    private function onPdoError() {
        if (!$this->statement) {
            echo "\nPDO::errorInfo():\n";
            print_r($this->conn->errorInfo());
        }
    }

    public function activateUser($token) {
        $this->statement = $this->conn->prepare("SELECT id FROM user WHERE token = :token AND activated = 0");
        $this->onPdoError();
        $this->statement->execute(array(":token" => $token));
        if ($row = $this->statement->fetch(PDO::FETCH_ASSOC)) {
            $this->statement = $this->conn->prepare("UPDATE user SET activated = 1 WHERE id = :id");
            $this->onPdoError();
            $this->statement->execute(array(":id" => $row["id"]));
            $_SESSION["userId"] = $row["id"];
            return true;
        }
        return false;
    }

    private function getRandomToken() {
        $token = "";
        for($i = 0; $i < 40; $i++) {
            $token .= rand(0, 9);
        }
        return $token;
    }

    private function getActivateMail($token) {
        return "Please click the following link to activate your account \n ".d_home."/activate?token=$token";
    }
}
