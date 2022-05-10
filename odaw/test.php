<?php

?>

<!DOCTYPE html>
<html>
    <head>
        <title>ODAW</title>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
        <script src="js/_test/Oscillator.js"></script>
        <script src="js/_test/Equalizer.js"></script>
        <script src="js/_test/MidiInput.js"></script>
        <script src="js/_test/tone.js"></script>
    </head>
    <body>
        <button id="newOsc">New Oscillator</button>
        <input id="octave" type="number" value="5">Octave
        <div id="eq">
            <input type="range" min="0" max="100" value="50"">
            <br>
            <div style="display: inline-block">
                <label>80Hz</label>
                <br>
                <input id="one" type="range" min="-25" max="25" value="0" style="transform: rotate(-90deg) translate(-60px, -60px);margin-right: -110px;margin-bottom: 120px;margin-left: 10px;">
                <br>
                <input type="number" style="width: 25px; margin: auto;">
            </div>
            <br>
            <input type="range" min="0" max="100" value="50"">
        </div>
    </body>
</html>