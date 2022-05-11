<?php
include_once("php/globalFn.php");
?>
<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="utf-8">
        <title>Webdows</title>
        <link type="text/css" rel="stylesheet" href="css/main.css">
        <link type="text/css" rel="stylesheet" href="css/icons.css">
        <link type="text/css" rel="stylesheet" href="css/Import/font-awesome-4.6.3/css/font-awesome.min.css">
        <link type="text/css" rel="stylesheet" href="js/Import/jquery-ui.min.css">
        <link type="text/css" rel="stylesheet" href="js/Import/external/grid-2.1.0/pqgrid.min.css">
        <link type="text/css" rel="stylesheet" href="css/gridStyle.css">
        <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
        <script>if (typeof module === 'object') {window.module = module; module = undefined;}</script>
        <script src="js/Import/external/jquery/jquery.js"></script>
        <script src="js/Import/jquery-ui.min.js"></script>
        <script src="js/Import/blur.js"></script>
        <script src="js/main.js"></script>
        <script src="js/clock.js"></script>
        <script src="js/iFrame.js"></script>
        <script src="js/workspace.js"></script>
        <script src="js/contextMenu.js"></script>
        <script src="js/grid.js"></script>
        <script src="js/Import/external/grid-2.1.0/pqgrid.min.js"></script>
        <script src="js/Import/external/jwplayer-7.7.4/jwplayer.js"></script>
        <script>jwplayer.key="X/dmntijAxwMLCMzWvOK1VxOfRXEG28LlPxuhw=="</script>
        <script>if (window.module) module = window.module;</script>
    </head>
    <body onload="startTime(); updateDate();" oncontextmenu="return showContextMenu(event, 1)">
        <div id="mainFrame">
            <div id="workspace"></div>
            <div id="toolbar" class="transparent">
                <div id="home" class="item floatLeft icon" ondblclick="$('.workSpaceItem').each(function(){setWorkspaceItemAbsolute(this)});setTimeout(relativeToAbsolute, 200)"><i class="icon-home"></i></div>
                <div class="taskListSeperator item floatLeft"></div>
                <div class="taskListSeperator item floatRight" onclick="hideAllFrames()" ondblclick="showAllFrames()"></div>
                <div id="clock" class="item floatRight">
                    <div id="time"></div>
                    <div id="date"></div>
                </div>
                <div class="taskListSeperator item floatRight"></div>
            </div>
        </div>
    </body>
</html>
