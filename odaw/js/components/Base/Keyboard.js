class Keyboard extends Base{

    constructor() {
        super();

        this.multi = false;

        this.elem = "";
        this.keyboard = "";
        this.keyWhite = "";
        this.keyBlack = "";
        this.bar = "";
        this.transpose = "";

        this.activeInstrument = "";

        this.toggleMidi = "";
        this.selectMidi = "";
        this.activeMidi = "";

        this.showOnKeyboard = true;
        this.sustainOn = false;
        this.sustainButton = "";
        this.sustainHold = false;

        this.loadTemplate();
    }

    loadTemplate() {
        let me = this;
        me.elem = $(templates.masterkeyboard).appendTo(".layer.master");
        me.bar = me.elem.find(".bar");
        me.transpose = me.elem.find(".transpose");
        me.sustainButton = me.elem.find(".sustain");
        me.sustainButtonHold = me.sustainButton.children(".icon-button").eq(0);
        me.keyboard = me.elem.find(".keyboard");
        me.keyWhite = me.keyboard.find(".key.white");
        me.keyWhite.attr("data-note",project.noteStrings[9]+"0").children(":last-of-type").html(project.noteStrings[9]+"0");
        me.keyBlack = me.keyboard.find(".key.black");
        me.keyBlack.attr("data-note",project.noteStrings[10]+"0");
        me.keyboard.append(me.keyWhite.clone().attr("data-note",project.noteStrings[11]+"0").children(":last-of-type").html(project.noteStrings[11]+"0").parent());
        for (let j = 0; j < 7; j++) {
            for (let i = 0, k = 0; i < 7; i++) {
                me.keyboard.append(me.keyWhite.clone().attr("data-note",project.noteStrings[k]+(j+1)).children(":last-of-type").html(project.noteStrings[k++]+(j+1)).parent());
                if(i != 2 && i != 6) me.keyboard.append(me.keyBlack.clone().attr("data-note",project.noteStrings[k++]+(j+1)));
            }
        }
        me.keyboard.append(me.keyWhite.clone().attr("data-note","C8").children(":last-of-type").html(project.noteStrings[0]+"8").parent());

        me.keyboard.on("mousedown", function(e) {
            let key = $(e.target).closest(".key");
            if(!key.is(".key")) return;
            if (e.which == 3 && e.type == "mousedown") {
                me.activeInstrument.setBaseNote(Generator.noteNumberFromNoteString(key.data("note")));
            }
            let noteNr = Generator.noteNumberFromNoteString(key.data("note"));
            me.activeInstrument.increaseNoteHold(noteNr, me.sustainOn);

            $(this).on("mousemove", function(ev) {
                let newKey = $(ev.target).closest(".key");
                if(!newKey.is(".key")) {
                    $(this).trigger("mouseleave");
                    return;
                }
                if(newKey.data("note") != key.data("note")) {
                    let noteNr = Generator.noteNumberFromNoteString(key.data("note"));
                    me.activeInstrument.decreaseNoteHold(noteNr);
                    key = newKey;

                    noteNr = Generator.noteNumberFromNoteString(key.data("note"));
                    me.activeInstrument.increaseNoteHold(noteNr, me.sustainOn);
                }
            });
        }).on("mouseleave mouseup", function(e) {
            let key = $(e.target).closest(".key");
            if($(e.target).is($(this)) && !me.sustainOn) me.activeInstrument.decreaseAllNoteHolds();
            if(!key.is(".key")) return;
            let noteNr = Generator.noteNumberFromNoteString(key.data("note"));
            me.activeInstrument.decreaseNoteHold(noteNr);
        });
        $(window).on("mouseup", function() {
            me.keyboard.off("mousemove");
            //me.activeInstrument.decreaseAllNoteHolds();
        });

        me.elem.on("click", function (e) {
            $(window).off("click keydown keyup").on("keydown", function (e) {
                me.activeInstrument.onKeyPress(e);
            }).on("keyup", function (e) {
                me.activeInstrument.onKeyRelease(e);
            });
            e.stopPropagation();
            $(window).not(me.elem).on("click", function (e) {
                if($(e.target).parent(".instrument").length == 0) $(window).trigger("keyup").off("click keydown");
            });
        });

        me.bar.find("input[type='checkbox']").on("change", function() {
            if($(this).is(":checked")) $(this).parent().addClass("checked");
            else $(this).parent().removeClass("checked");
        });

        let selectConfig = {
            options: [
                {name: "all the", value: -1},
                {name: "81", value: 0, default: true},
                {name: "76", value: 1},
                {name: "61", value: 2},
                {name: "49", value: 3},
                {name: "32", value: 4},
                {name: "25", value: 5},
                {name: "13", value: 6},
                {name: "no", value: 7, selectable: false},
            ],

            parent: me.bar.find(".key-select-wrapper")
        };

        new Select(selectConfig);

        me.transpose.change(function () {
            me.activeInstrument.changeTranspose(parseInt($(this).val()));
            me.updateTranspose();
        });

        me.sustainButton.on({
            mousedown: function(e) {
                if(!me.sustainHold) {
                    $(this).addClass("pressed");
                    me.activeInstrument.increaseAllNoteHolds();
                    me.sustainOn = true;
                }
            },
            mouseup: function(e) {
                if($(e.target).is(me.sustainButtonHold)) {
                    if(me.sustainHold) {
                        $(this).removeClass("pressed");
                        me.sustainButtonHold.removeClass("pressed");
                        me.activeInstrument.decreaseAllNoteHolds();
                        me.sustainOn = false;
                    }
                    me.sustainHold = !me.sustainHold;
                } else {
                    $(this).removeClass("pressed");
                    me.sustainButtonHold.removeClass("pressed");
                    me.activeInstrument.decreaseAllNoteHolds();
                    me.sustainHold = false;
                    me.sustainOn = false;
                }
            }
        });
        me.sustainButtonHold.on({
            mouseenter: function() {
                if(me.sustainButton.is(":active")) $(this).addClass("pressed");
            },
            mouseleave: function() {
                if(me.sustainButton.is(":active")) $(this).removeClass("pressed");
            },
            mousedown: function() {
                $(this).addClass("pressed");
            }
        });

        me.initMidi();
        me.resize();
    }

    updateTranspose() {
        this.transpose.val(this.activeInstrument.transpose);
    }

    resize() {
        let keyboardWidth = $(".masterkeyboard").outerWidth();
        let keyWidth = $(".masterkeyboard .key").eq(0).outerWidth() + parseInt($(".masterkeyboard .key").eq(0).css("margin-right"), 10);
        // console.log(keyboardWidth + ", " + keyWidth);
        let resize = $(".masterkeyboard .toggleResize").is(":checked");
        let keys = $(".masterkeyboard .selectSize option:selected").val();
        let maxKeys = $(".toggleMaxKeys").is(":checked");
        if(resize) {
            if(maxKeys) {
                // Display maximal amount of keys
            } else {
                // Display increase / decrease amount of keys in steps (25, 49, 61, 76, 88)
            }
        } else {
            // Display selected amount of keys
        }
    }
    initMidi() {
        let me = this;

        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess({
                sysex: false // this defaults to 'false' and we won't be covering sysex in this article.
            }).then(onMIDISuccess, onMIDIFailure);
        } else {
            console.log("No MIDI support in your browser.");
        }

        function onMIDISuccess(midiAccess) {
            // when we get a succesful response, run this code
            let midi = midiAccess, // this is our raw MIDI data, inputs, outputs, and sysex status
                inputs = midi.inputs.values();

            me.toggleMidi = $(".masterkeyboard .toggleMidi"),
            me.selectMidi = $(".masterkeyboard .selectMidi"),
            me.activeMidi = -1;

            // loop over all available inputs and listen for any MIDI input
            for (let input = inputs.next(), x = 0; input && !input.done; input = inputs.next()) {
                // each time there is a midi message call the onMIDIMessage function
                $("<option value='"+x+"'>"+input.value.name+"</option>").appendTo(me.selectMidi).data("input", input);
                x++;
            }

            me.toggleMidi.change(function () {
                if($(this).is(":checked")) {
                    if(me.selectMidi.find("option:selected").val() != "default")
                    setActiveInput(me.selectMidi.find("option:selected"));
                    lsh.set("midiToggle", {value: true});
                } else {
                    let input = $(me.selectMidi.find("option").get(me.activeMidi)).data("input");
                    if(input) input.value.onmidimessage = null;
                    lsh.set("midiToggle", {value: false});
                }
            });

            me.selectMidi.change(function () {
                setActiveInput($(this).find("option:selected"));
            });

            function setActiveInput(option) {
                let input = option.data("input");

                if(me.activeMidi != -1) $(me.selectMidi.find("option").get(me.activeMidi)).data("input").value.onmidimessage = null;

                me.activeMidi = option.val();

                if(input) input.value.onmidimessage = onMIDIMessage;
            }
        }

        function onMIDIFailure(error) {
            // when we get a failed response, run this code
            console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
        }

        function onMIDIMessage(message) {
            let data = message.data; // this gives us our [command/channel, note, velocity] data.
            switch(data[0]) {
                case 128:
                        me.activeInstrument.decreaseNoteHold(data[1]);
                    break;
                case 144:
                    if(data[2] > 0) {
                        me.activeInstrument.increaseNoteHold(data[1], me.sustainOn);
                    } else {
                        me.activeInstrument.decreaseNoteHold(data[1]);
                    }
                    break;
                case 176:
                    if(data[1] == 64) {       // Sustain pedal
                        if(data[2] >= 64) {   // ON
                            if(!me.sustainButtonHold.hasClass("pressed")) me.sustainButton.trigger("mousedown").addClass("pressed");
                        } else {               // OFF
                            if(!me.sustainButtonHold.hasClass("pressed")) me.sustainButton.trigger("mouseup").removeClass("pressed");
                        }
                    }
                    break;
                case 254: break;
                default:
                    console.log('MIDI data', data); // MIDI data [144, 63, 73]
                    break;
            }
        }
    }

    connect(instrument) {
        let me = this;
        if(me.activeInstrument && me.activeInstrument !== instrument) {
            me.activeInstrument.elem.removeClass("active");
            me.activeInstrument.stopAllNotes();
        }
        me.activeInstrument = instrument;
        me.activeInstrument.elem.addClass("active");
    }
}