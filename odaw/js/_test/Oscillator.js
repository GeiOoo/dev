var count = 1;
function Oscillator(name, octave) {
     var me = this,
        osc = ctx.createOscillator(),
        gain = ctx.createGain(),
        dist = ctx.createWaveShaper(),
        nodeCount = count,
        source,
        eq;


    this.start = function () {
        gain.connect(ctx.destination);
    };

    this.stop = function () {
        gain.disconnect(ctx.destination);
    };

    this.freq = function(f, t) {
        osc.frequency.setValueAtTime(f, t);
    };

    $('<div id="'+name+nodeCount+'Node" style="margin-top: 10px;">' +
        '<button id="'+name+nodeCount+'Play">Play</button>' +
        '<button id="'+name+nodeCount+'Stop">Stop</button>' +
        '<button id="'+name+nodeCount+'Remove">Remove</button>' +
        '<br>' +
        '<input type="range" id="'+name+nodeCount+'Frq" min="1" max="20000" value="450" style="width:500px;">' +
        '<label for="'+name+nodeCount+'Frq" id="'+name+nodeCount+'FrqLbl"></label>' +
        '<br>' +
        '<input type="range" id="'+name+nodeCount+'Vol" min="0" max="10" value="1">' +
        '<label for="'+name+nodeCount+'Vol" id="'+name+nodeCount+'VolLbl"></label>' +
        '<br>' +
        '<input type="range" id="'+name+nodeCount+'Dist" min="0" max="360" value="1">' +
        '<label for="'+name+nodeCount+'Dist" id="'+name+nodeCount+'DistLbl"></label>' +
        '<br>' +
        '<button class="note '+name+nodeCount+'Note">C'+octave+'</button>' +
        '<button class="note '+name+nodeCount+'Note">D'+octave+'</button>' +
        '<button class="note '+name+nodeCount+'Note">E'+octave+'</button>' +
        '<button class="note '+name+nodeCount+'Note">F'+octave+'</button>' +
        '<button class="note '+name+nodeCount+'Note">G'+octave+'</button>' +
        '<button class="note '+name+nodeCount+'Note">A'+octave+'</button>' +
        '<button class="note '+name+nodeCount+'Note">B'+octave+'</button>' +
        '<button class="note '+name+nodeCount+'Note">C'+(parseInt(octave)+1)+'</button>' +
        '<input type="text" id="'+name+nodeCount+'TextNote" value="A5" maxlength="4" size="2">' +
        '</div>').appendTo("body");

    osc.type = "sine";
    osc.frequency.value = 440;
    osc.start();

    eq = new FiveBandEqualizer(name, osc, dist);

    dist.connect(gain);



    gain.gain.value = 0.01;

    $("#"+name+nodeCount+"Play").on("click", function () {
        me.start();
    });
    $("#"+name+nodeCount+"Remove").on("click", function () {
        me.stop();
        $(this.parentElement).remove();
    });
    $("#"+name+nodeCount+"Stop").on("click", function () {
        me.stop();
    });
    $("#"+name+nodeCount+"Frq").on("input", function (e) {
        me.freq(e.target.value, 0);
        $("#"+name+nodeCount+"FrqLbl").text(e.target.value+" hz"+" "+noteStringFromNoteNumber(noteFromPitch(e.target.value)));
        $("#"+name+nodeCount+"TextNote").val(noteStringFromNoteNumber(noteFromPitch(e.target.value)));
    });
    $("#"+name+nodeCount+"Vol").on("input", function (e) {
        gain.gain.value = e.target.value/100;
        $("#"+name+nodeCount+"VolLbl").text(e.target.value+"% Vol");
    });
    $("#"+name+nodeCount+"Dist").on("input", function (e) {
        dist.curve = makeDistortionCurve(parseInt(e.target.value));
        $("#"+name+nodeCount+"DistLbl").text(e.target.value+" Distortion");
    });
    $("."+name+nodeCount+"Note").on("click", function () {
        $("#"+name+nodeCount+"TextNote").val($(this).text()).trigger("input");
    });
    $("#"+name+nodeCount+"TextNote").on("keydown", function (e) {
        var noteNumber = noteNumberFromNoteString($(this).val());
        switch(e.which) {
            case 38:
                noteNumber++;
                break;
            case 40:
                noteNumber--;
                break;
            default: return;
        }
        if(noteNumber) $(this).val(noteStringFromNoteNumber(noteNumber)).trigger("input");
    }).on("input", function () {
        var noteNumber = noteNumberFromNoteString($(this).val());
        if(noteNumber) //osc.frequency.setValueAtTime(frequencyFromNoteNumber(noteNumber), 0);
            $("#"+name+nodeCount+"Frq").val(frequencyFromNoteNumber(noteNumber)).trigger("input");
    });

    this.test = function () {
        console.log("Test");
    };

    $("#"+name+nodeCount+"Node").data({node: this});

    count++;
}