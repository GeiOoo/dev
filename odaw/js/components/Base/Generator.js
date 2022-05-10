class Generator extends Base {
    constructor(data) {
        super();

        if(!data) data = {};

        this.output = project.ctx.createGain();

        this.waveTypes = ["sine", "square", "sawtooth", "triangle"];
        this.defaultWaveType = 3;
        this.waveType = this.waveTypes[this.defaultWaveType];

        this.showOnKeyboard = true;

        this.transpose = 0;
        this.volume = data.volume || 0.2;

        this.attack = data.attack || 0.001;
        this.decay = data.decay ||0.001;
        this.sustain = data.sustain || 1;
        this.release = data.release || 0.001;

        this.voices = [];
        this.keys = Generator.getKeyMapping();

        this.elem;
        this.startNoteEvent = $.Event("startNote");
        this.stopNoteEvent = $.Event("stopNote");
        this.stopToneEvent = $.Event("stopTone");
        this.stopToneTimeout;

        let me = this;
        me.stopAllTones();
        $(document).on("stopEverything", function() {
            me.stopAllTones();
        });

        this.output.connect(project.ctx.destination);

        this.elem;
    }

    setAttack(val) {
        let me = this;
        me.attack = val;
    }

    setDecay(val) {
        let me = this;
        me.decay = val;
    }

    setSustain(val) {
        let me = this;
        me.sustain = val;
    }

    setRelease(val) {
        let me = this;
        me.release = val;
    }

    setWaveType(index) {
        let me = this,
            newType = (me.waveTypes[index])? me.waveTypes[index] : me.waveTypes[0];

        me.waveType = newType;
        me.voices.forEach(function (e) {
            e.setType(newType);
        });

    }

    setCustomWaveType(wt) {
        let me = this;

        me.waveType = wt;
        me.voices.forEach(function (e) {
            e.setType(wt);
        });
    }

    getLowestPlayingFreq() {
        let me = this,
            voices = Object.keys(me.voices);
        if(voices.length == 0) return null;
        return me.voices[voices[0]].getFreq();
    }

    getHighestPlayingFreq() {
        let me = this,
            voices = Object.keys(me.voices);
        if(voices.length == 0) return null;
        return me.voices[voices[voices.length-1]].getFreq();
    }

    playNoteNr(noteNr) {
        let note,
            me = this;
        if(noteNr) {
            if(typeof me.voices[noteNr] !== "undefined") me.stopNoteNr(noteNr);
            if(me.showOnKeyboard) $(".key[data-note='"+Generator.noteStringFromNoteNumber(noteNr)+"']").addClass("playing");
            note = new Note(noteNr, me.waveType, me.transpose);
            note.output.connect(me.output);
            //note.rampVolume(0, 0.001);
            note.rampVolume(1, me.attack + 0.001);
            //note.decay = setTimeout(() => note.rampVolume(me.sustain, me.decay), me.attack*1000+100);
            note.decay = note.rampVolume(me.sustain, me.decay + me.attack + 0.001);
            me.voices[noteNr] = note;
            if(Object.keys(me.voices).length == 1) {
                me.elem.trigger(me.startNoteEvent);
                if(me.stopToneTimeout !== undefined) clearTimeout(me.stopToneTimeout);
            }
        }
    }

    stopNoteNr(noteNr) {
        let me = this, note = me.voices[noteNr];
        if(note) {
            note.output.gain.cancelScheduledValues(project.ctx.currentTime+1);
            //clearTimeout(note.decay);
            note.rampVolume(0, me.release);
            $(".key[data-note='"+Generator.noteStringFromNoteNumber(noteNr)+"']").removeClass("playing");
            if(Object.keys(me.voices).length == 0) {
                me.elem.trigger(me.stopNoteEvent);
                me.stopToneTimeout = setTimeout(function() { me.elem.trigger(me.stopToneEvent) },me.release*1000);
            }
            setTimeout(function () {
                if(note) {
                    delete me.voices[noteNr];
                    note.output.disconnect(me.output);
                }
            }, me.release*1000+100);
        }
    }
    stopAllTones() {
        let me = this;
        if(me.voices.length > 0)
            me.voices.forEach((note) => {
                note.output.gain.cancelScheduledValues(project.ctx.currentTime+1);
                me.stopNoteNr(note.noteNr);
                note.rampVolume(0,0.001);
            });
    }
    stopAllNotes() {
        let me = this;
        if(me.voices.length > 0)
            me.voices.forEach((note) => { me.stopNoteNr(note.noteNr) });
    }
    decreaseAllNoteHolds() {
        let me = this;
        console.log(me.voices);
        if(me.voices.length > 0)
            me.voices.forEach((note) => { me.decreaseNoteHold(note.noteNr); });
        console.log(me.voices.length);
    }
    decreaseNoteHold(noteNr) {
        let me = this, note = me.voices[noteNr];
        if(note !== undefined) {
            note.hold--;
            if (note.hold <= 0) me.stopNoteNr(noteNr);
        }
    }
    increaseAllNoteHolds() {
        let me = this;
        if(me.voices.length > 0)
            me.voices.forEach((note) => { me.increaseNoteHold(note.noteNr); });
    }
    increaseNoteHold(noteNr, sustainOn) {
        let sus = (sustainOn === undefined) ? false : sustainOn;
        let me = this, note = me.voices[noteNr];
        if(note === undefined) {
            me.playNoteNr(noteNr);
            if(sus) me.voices[noteNr].hold++;
        }
        else {
            note.hold++;
        }
    }

    setVolume(volume) {
        this.output.gain.setTargetAtTime(volume, project.ctx.currentTime, 0.001);
    }

    onKeyPress(e) {
        let noteNr = this.keys[e.which];
        // test.push(e.which);
        if(!this.voices[noteNr]) this.increaseNoteHold(noteNr);
    }

    onKeyRelease(e) {
        let noteNr = this.keys[e.which];
        if(this.voices[noteNr]) {
            this.decreaseNoteHold(noteNr);
        }
    }

    setBaseNote(noteNr) {
        this.keys = Generator.getKeyMapping(noteNr);
    }

    changeTranspose(value) {
        let me = this;

        me.transpose = value;

        me.voices.forEach(function (e) {
            e.changeFreq(Generator.frequencyFromNoteNumber(e.noteNr+me.transpose), 0.001)
        })
    }

    static noteFromPitch(frequency) {
        let noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
        return Math.round( noteNum ) + 69;
    }

    static frequencyFromNoteNumber(note) {
        return 440 * Math.pow(2,(note-69)/12);
    }

    static noteStringFromNoteNumber(noteNum) {
        return project.noteStrings[noteNum%12]+Math.floor(noteNum/12);
    }

    static noteNumberFromNoteString(noteString) {
        let match = noteString.match(/([a-gA-G][#|b]?)(\d+)/), noteNumber = null;
        if(match && match[2] < 11) noteNumber = project.noteStrings.indexOf(match[1][0].toUpperCase()+match[1].slice(1))%12 + (match[2]*12);
        return noteNumber;
    }

    static getKeyMapping(noteNr) {
        let lowKeys = [89, 83, 88, 68, 67, 70, 86, 71, 66, 72, 78, 74, 77, 75, 188, 76, 190, 192, 189],
            highKeys = [81, 50, 87, 51, 69, 52, 82, 53, 84, 54, 90, 55, 85, 56, 73, 57, 79, 48, 80, 219, 186, 221, 187],
            currentNote,
            noteStart = currentNote = noteNr || 48,
            mapping = [];

        if($(".key[data-note='"+Generator.noteStringFromNoteNumber(noteNr)+"']").is(".black")) {
            lowKeys.unshift(65);
            lowKeys.push(222);
            highKeys.unshift(49);
            highKeys.push(221);
        }
        for(let i = 0; i < lowKeys.length; i++) {
            mapping[lowKeys[i]] = currentNote++;
            if(currentNote % 12 == 5 || currentNote % 12 == 0) i++;
        }

        currentNote = noteStart + 12;

        for(let i = 0; i < highKeys.length; i++) {
            mapping[highKeys[i]] = currentNote++;
            if(currentNote % 12 == 5 || currentNote % 12 == 0) i++;
        }

        return mapping;
    }
}

class Note {
    constructor(noteNr, type, transpose) {

        this.osc = project.ctx.createOscillator();
        this.output = project.ctx.createGain();

        this.transpose = transpose;
        this.noteNr = noteNr;
        this.hold = 1;

        this.decay = 0;

        this.rampVolume(0, 0.001);
        this.changeFreq(Generator.frequencyFromNoteNumber(this.noteNr+this.transpose), 0.001);

        this.setType(type);

        this.osc.start();

        this.osc.connect(this.output);
    }

    getFreq() {
        return Generator.frequencyFromNoteNumber(this.noteNr+this.transpose);
    }

    changeFreq(freq, time) {
        this.osc.frequency.setTargetAtTime(freq, project.ctx.currentTime, time);
    }

    setType(type) {
        if(type instanceof PeriodicWave) this.osc.setPeriodicWave(type);
        else this.osc.type = type;
    }

    rampVolume(volume, speed) {
        this.output.gain.linearRampToValueAtTime(volume, project.ctx.currentTime + speed);
    }
}