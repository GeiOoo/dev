var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "B#"];
var ctx = new (window.AudioContext);

$(document).ready(function () {
    $("#newOsc").on("click", function () {
        osc1 = new Oscillator("osc", $("#octave").val());
        mi = new MidiInput();
    });
    // if(navigator.mediaDevices) {
    //     navigator.mediaDevices.getUserMedia({audio: true, video: false})
    //         .then(function(stream) {
    //             source = ctx.createMediaStreamSource(stream);
    //
    //         });
    // }
});

function noteFromPitch(frequency) {
    var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
    return Math.round( noteNum ) + 69;
}

function frequencyFromNoteNumber(note) {
    return 440 * Math.pow(2,(note-69)/12);
}

function noteStringFromNoteNumber(noteNum) {
    return noteStrings[noteNum%12]+Math.floor(noteNum/12);
}

function noteNumberFromNoteString(noteString) {
    var match = noteString.match(/([a-gA-G][#|b]?)(\d+)/), noteNumber = null;
    if(match && match[2] < 11) noteNumber = noteStrings.indexOf(match[1][0].toUpperCase()+match[1].slice(1))%12 + (match[2]*12);
    return noteNumber;
}

function centsOffFromPitch(frequency, note) {
    return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2) );
}

function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
    for ( ; i < n_samples; ++i ) {
        x = i * 2 / n_samples - 1;
        curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
}