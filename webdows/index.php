<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="utf-8" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <title>Webdows</title>
    <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    <script src="js/main.js"></script>
    <script src="js/clock.js"></script>
    <script src="js/workspace.js"></script>
    <script src="js/window.js"></script>
    <script src="js/ajax.js"></script>
    <script src="js/grid.js"></script>
    <script src="import/jquery-ui/jquery-ui.min.js"></script>
    <script src="import/grid/pqgrid.min.js"></script>
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <link rel="stylesheet" type="text/css" href="css/toolbar.css">
    <link rel="stylesheet" type="text/css" href="css/workspace.css">
    <link rel="stylesheet" type="text/css" href="css/window.css">
    <link rel="stylesheet" type="text/css" href="css/import/font-awesome-4.6.3/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="import/grid/pqgrid.min.css">
    <link rel="stylesheet" type="text/css" href="import/jquery-ui/jquery-ui.min.css">
    <link rel="stylesheet" type="text/css" href="css/icons.css">
</head>
<body>
    <div id="frame">
        <div id="workspace"></div>
        <div id="toolbar">
            <div id="webdows" class="toolbarItem"><div class="icon icon-windows"></div></div>
            <div id="search" class="toolbarItem"><div class="icon icon-search"></div></div>
            <div class="toolbarSeparator"></div>
            <div id="toolbarTasks">
                <div class="hideScroll"></div>
            </div>
            <div class="toolbarSeparator floatRight"></div>
            <div id="toolbarClock" class="floatRight">
                <div id="time"></div>
                <div id="date"></div>
            </div>
            <div class="toolbarSeparator floatRight"></div>
        </div>
    </div>
    <div class="loginBg" hidden>
        <div class="loginForm">
            <input class="loginLogin" type="text" placeholder="Login"
            ><br
            ><input class="loginPassword" type="password" placeholder="Password"
            ><br
            ><input class="loginMail" type="email" placeholder="E-Mail"
            ><br
            ><div><button id="submitForm" value="Login"><span>Login</span></button><button id="register" class="floatRight" value="register"><span>Register</span></button></div>
        </div>
    </div>
</body>
</html>