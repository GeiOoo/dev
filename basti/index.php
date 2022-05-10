<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML+RDFa 1.0//EN">
<html xmlns="http://www.w3.org/1999/xhtml">
<head profile="http://gmpg.org/xfn/11">
<title>Basti's GUI</title>
<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">
<link rel="stylesheet" href="css/fontello.css" type="text/css" media="screen" />
<link rel="stylesheet" href="css/epic.css" type="text/css" media="screen" />
<link rel="stylesheet" href="style.css" type="text/css" media="screen" />
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>
<script type="text/javascript" src="blur.js"></script>
<script type="text/javascript" src="jwplayer/jwplayer.js"></script>
<script type="text/javascript" src="script.js"></script>
</head>
<body id="screen">
	<div class="window-template hidden">
		<div class="new window">
			<div class="lt-resize"></div>
			<div class="rt-resize"></div>
			<div class="lb-resize"></div>
			<div class="rb-resize"></div>
			<div class="t-resize"></div>
			<div class="l-resize"></div>
			<div class="r-resize"></div>
			<div class="head">
				<i class="symbol"></i>
				<div class="controls">
					<div class="icon-minus minimize"></div>
					<div class="icon-stop-outline maximize"></div>
					<div class="icon-cancel close"></div>
				</div>
			</div>
			<div class="body">
			</div>
			<div class="b-resize"></div>
		</div>
	</div>
	<div id="context-menu"></div>
	<div id="taskbar">
		<div id="start-window">
			<div class="body"></div>
			<div class="sidebar">
				<a href="http://epic-clan.de" target="_blank">Besuche www.epic-clan.de</a>
				<a target="_blank">Einstellungen</a>
			</div>
		</div>
		<table><tr>
		<td><i class="start icon-menu"></i></td><td><div class="spacer"><div></div></div></td>
		<td><div class="tasks"><div class="task icon-picture active" id="task-2"></div><div class="task icon-pencil-squared" id="task-1"></div></div></td>
		<td><div class="show-desktop" title="Desktop anzeigen"></div></td>
		</tr></table>
	</div>
	<div class="desktop-icon folder icon-folder" data-path="files" data-name="files"></div><div 
		class="desktop-icon app icon-picture" data-path="" data-name="Bildanzeige"></div><div 
		class="desktop-icon app icon-pencil-squared" data-path="" data-name="Editor"></div><div 
		class="desktop-icon app icon-play-circle2" data-path="" data-name="Player"></div>
	<div class="window" id="window-1" style="left:550px;top:100px;width:500px;z-index:998;opacity:1;" data-spos="550,100,500,300">
		<div class="lt-resize"></div>
		<div class="rt-resize"></div>
		<div class="lb-resize"></div>
		<div class="rb-resize"></div>
		<div class="t-resize"></div>
		<div class="l-resize"></div>
		<div class="r-resize"></div>
		<div class="head">
			<i class="icon-pencil-squared symbol"></i> <b>Katze.html</b> - Editor
			<div class="controls">
				<div class="icon-minus minimize"></div>
				<div class="icon-stop-outline maximize"></div>
				<div class="icon-cancel close"></div>
			</div>
		</div>
		<div class="body editor" style="height:300px;padding:5px;text-align:center;" contenteditable="true">
<dd style="font-style:italic;">- Hyppolyte Taine</dd>
		</div>
		<div class="b-resize"></div>
	</div>
	<div class="window active" id="window-2" style="left:100px;top:130px;width:500px;z-index:999;opacity:1;" data-spos="100,130,500,300">
		<div class="lt-resize"></div>
		<div class="rt-resize"></div>
		<div class="lb-resize"></div>
		<div class="rb-resize"></div>
		<div class="t-resize"></div>
		<div class="l-resize"></div>
		<div class="r-resize"></div>
		<div class="head">
			<i class="icon-picture symbol"></i> <b>bg7.jpg</b> - Bildanzeige
			<div class="controls">
				<div class="icon-minus minimize"></div>
				<div class="icon-stop-outline maximize"></div>
				<div class="icon-cancel close"></div>
			</div>
		</div>
		<div class="body image" style="height:300px;">
			<!--<div class="fullimage" style="background-image:url('files/bg7.jpg');"></div>-->
			<img src="files/wallpapers/bg7.jpg" class="fullimage" />
		</div>
		<div class="b-resize"></div>
	</div>
</body>
</html>