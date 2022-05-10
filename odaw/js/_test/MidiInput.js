var midiAccess=null;	// the MIDIAccess object.
var attack=0.05;			// attack speed
var release=0.05;		// release speed
var portamento=0.05;	// portamento/glide speed
var activeNotes = [];	// the stack of actively-pressed keys
function MidiInput() {
    // patch up prefixes
    window.AudioContext=window.AudioContext||window.webkitAudioContext;
    if (navigator.requestMIDIAccess)
        navigator.requestMIDIAccess().then( onMIDIInit, onMIDIReject );
    else
        alert("No MIDI support present in your browser.  You're gonna have a bad time.")
    // set up the basic oscillator chain, muted to begin with.

}
function hookUpMIDIInput() {
    var haveAtLeastOneDevice=false;
    var inputs=midiAccess.inputs.values();
    for ( var input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = MIDIMessageEventHandler;
        haveAtLeastOneDevice = true;
    }
    var badtime = document.getElementById("badtime");
    if (badtime)
        badtime.style.visibility = haveAtLeastOneDevice ?
            "hidden" : "visible";
}
function onMIDIInit(midi) {
    midiAccess = midi;
    hookUpMIDIInput();
    midiAccess.onstatechange=hookUpMIDIInput;
}
function onMIDIReject(err) {
    alert("The MIDI system failed to start.  You're gonna have a bad time.");
}
function MIDIMessageEventHandler(event) {
    // Mask off the lower nibble (MIDI channel, which we don't care about)
    switch (event.data[0] & 0xf0) {
        case 0x90:
            if (event.data[2]!=0) {  // if velocity != 0, this is a note-on message
                noteOn(event.data[1]);
                return;
            }
        // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, ya'll.
        case 0x80:
            noteOff(event.data[1]);
            return;
    }
}
function frequencyFromNoteNumber( note ) {
    return 440 * Math.pow(2,(note-69)/12);
}
function noteOn(noteNumber) {
    activeNotes.push( noteNumber );
    osc1.start();
    osc1.freq(frequencyFromNoteNumber(noteNumber), 0);
}
function noteOff(noteNumber) {
    var position = activeNotes.indexOf(noteNumber);
    if (position!=-1) {
        activeNotes.splice(position,1);
    }
    if (activeNotes.length==0) {	// shut off the envelope
        osc1.stop();
    } else {

    }
}