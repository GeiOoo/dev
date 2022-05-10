<?php

include_once("php/globalFn.php");
include_once("php/import.php");

?>
<!DOCTYPE html>
<html>
<head>
    <title>ODAW</title>
    <meta http-equiv="expires" content="0">
    <meta name="viewport" content="width=device-width, initial-scale=0.75, user-scalable=yes, minimum-scale=0.5, maximum-scale=1.0">
    <link href="https://fonts.googleapis.com/css?family=Cutive+Mono|Source+Sans+Pro" rel="stylesheet">
<?php echo importCSS("css/")?>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<?php echo importJS("js/") ?>
</head>
<body class="dark">
<svg style="position: absolute;">
    <filter id="knob-blur" filterUnits="userSpaceOnUse" height="200%" width="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
    </filter>
    <filter id="knob-blur-small" filterUnits="userSpaceOnUse" height="200%" width="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
    </filter>
    <filter id="knob-tiny" filterUnits="userSpaceOnUse" height="200%" width="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
    </filter>
    <div class="layer loading-layer active">
        <div class="loading">
		<span class="icon">
			<svg viewbox="0 0 54 54">
				<path class="loading" d="M27.3 28.2 m 15.9155,0 a 15.9155 15.9155 0 0 1 -31.831 0 a 15.9155 15.9155 0 0 1 31.831 0" />
			</svg>
		</span>
            <span class="logo">
			<span>O</span><span>D</span><span>A</span><span>W</span>
		</span>
        </div>
    </div>
</svg>
</body>
</html>