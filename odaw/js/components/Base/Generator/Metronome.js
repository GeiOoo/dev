class Metronome extends Generator {

    constructor() {

        super();

        this.multi = false;

        this.test = 0;

        this.noteLength = 20;
        this.lowNote = 60;
        this.highNote = 72;
        this.step = 1;
        this.mute = false;
        this.volume = 0.6;
        this.tempVolume = 0.6;
        this.play = false;
        this.bpmArray = [];
        this.bpmArrayReset = 0;

        this.elem = "";
        this.muteElem = "";
        this.volumeElem = "";
        this.playElem = "";
        this.stopElem = "";
        this.bpmElem = "";
        this.beatElem = "";
        this.stepsElem = "";
        this.countElem = "";
        this.settingsElem = "";

        this.showOnKeyboard = false;
        this.stopEverythingEvent = $.Event("stopEverything");

        this.output.gain.setTargetAtTime(0, project.ctx.currentTime, 0.001);

        this.loadTemplate();
    }

    loadTemplate() {
        let me = this;
        me.elem = $(templates.metronome).appendTo(".layer.master");
        me.muteElem = me.elem.find(".volume");
        me.volumeElem = me.elem.find(".volume-slider-wrapper > .volume-slider");
        me.playElem = me.elem.find(".toggle-play");
        me.stopElem = me.elem.find(".stop");
        me.bpmElem = me.elem.find(".bpm");
        me.beatElem = me.elem.find(".beat");
        me.stepsElem = me.elem.find(".steps");
        me.countElem = me.elem.find(".count");
        me.settingsElem = me.elem.find(".settings");

        me.muteElem.click(function() {
            $(this).toggleClass("pressed");
            me.mute = $(this).hasClass("pressed");
            if(me.mute) {
                me.tempVolume = me.volumeElem.val();
                me.volumeElem.val(0);
            } else {
                me.tempVolume = (me.tempVolume == 0)? 0.1 : me.tempVolume;
                me.volumeElem.val(me.tempVolume);
            }
            me.volumeElem.trigger("input");
        });

        me.playElem.click(function() {
            $(this).toggleClass("pressed");
            if($(this).hasClass("pressed")) me.startMetronom();
            else me.pauseMetronom();
        });

        me.stopElem.click(function() {
            me.stopMetronom();
            me.stopEverything();
        });

        me.bpmElem.change(function() {
            if($(this).val() < parseInt($(this).attr("min"))) $(this).val(parseInt($(this).attr("min")));
            if($(this).val() > parseInt($(this).attr("max"))) $(this).val(parseInt($(this).attr("max")));
            project.bpm = parseInt($(this).val());
            project.mpbLeft -= project.mpb - (project.mpb = 60000 / project.bpm);
        }).keydown(function (e) {
            if(e.which == 32) {
                me.bpmArray.unshift(Date.now());
                clearTimeout(me.bpmArrayReset);
                me.bpmArray.length = Math.min(4, me.bpmArray.length);

                if(me.bpmArray.length > 2) {
                    me.bpmArrayReset = setTimeout(function () {
                        me.bpmArray = [];
                    }, Math.abs(me.bpmArray[0] - me.bpmArray[1])*1.5);

                    let avg = [Math.abs(me.bpmArray[0] - me.bpmArray[1])];
                    me.bpmArray.forEach(function (elem, index, array) {
                        if(array[index+1]) avg.unshift(Math.abs(elem - array[index + 1])) / 2;
                        else avg.unshift(parseInt(Math.abs(elem - array[0]) / (me.bpmArray.length-1)) / 2);
                    });
                    let avgValue = 0;
                    avg.shift();
                    avg.forEach(function (elem, index, array) {
                        avgValue += elem;
                    });
                    me.bpmElem.val(parseInt(60000 / (avgValue / avg.length))).trigger("change");
                }
                e.preventDefault();
                e.stopPropagation();
            }
        }).val(project.bpm);

        me.beatElem.change(function() {
            if($(this).val() < parseInt($(this).attr("min"))) $(this).val(parseInt($(this).attr("min")));
            if($(this).val() > parseInt($(this).attr("max"))) $(this).val(parseInt($(this).attr("max")));
            project.beat = parseInt($(this).val());
            me.updatePattern();
        }).val(project.beat);

        me.stepsElem.change(function() {
            if($(this).val() < parseInt($(this).attr("min"))) $(this).val(parseInt($(this).attr("min")));
            if($(this).val() > parseInt($(this).attr("max"))) $(this).val(parseInt($(this).attr("max")));
            let expo = 0;
            while($(this).val()-expo > Math.pow(2, expo)) {
                expo++;
            }
            $(this).val(Math.pow(2, expo));
            project.steps = parseInt($(this).val());
        }).keydown(function (e) {
            if(e.which == 38 && $(this).val()*2 <= $(this).attr("max")) {
                $(this).val($(this).val()*2);
                e.preventDefault();
                project.steps = parseInt($(this).val());
            }
            if(e.which == 40 && $(this).val()/2 >= $(this).attr("min")) {
                $(this).val($(this).val()/2);
                e.preventDefault();
                project.steps = parseInt($(this).val());
            }
        }).val(project.steps);

        me.updatePattern();

        me.volumeElem.on("input change", function () {
            me.setVolume($(this).val());
            if(($(this).val() == 0 && !me.mute) || ($(this).val() != 0 && me.mute)) me.muteElem.trigger("click");
        }).val(me.volume);
        me.setVolume(me.volumeElem.val());

        $("body").on("metronomClick", function() {
            me.onTick();
        });

        $(document).on("keydown", function (e) {
            if(e.which == 32) {
                me.playElem.click();
            }
        });
    }

    startMetronom() {
        Clock.startLoop();
    }

    stopMetronom() {
        Clock.stopLoop();
        this.step = 1;
        this.countElem.children().removeClass("beat");
        this.playElem.removeClass("pressed");
    }
    stopEverything() {
        let me = this;
        $(document).trigger(me.stopEverythingEvent);
    }

    pauseMetronom() {
        Clock.pauseLoop();
    }

    onTick() {
        let me = this;
        me.playNote();
        me.playPattern();
        if((me.step + 1) > project.beat) me.step = 1;
        else me.step++;
    }

    playPattern() {
        let me = this;
        me.countElem.children().removeClass("beat");
        me.countElem.children().eq(me.step-1).addClass("beat");
    }

    updatePattern() {
        let me = this;
        let amount = me.countElem.children().length;
        if(project.beat > amount) for(let i= project.beat; i > amount; i--) me.countElem.append("<div></div>");
        if(project.beat < amount) for(let i= project.beat; i < amount; i++) me.countElem.children().last().remove();
    }

    playNote() {
        let me = this, note;
        if(!me.mute) {
            note = (me.step == 1)? me.highNote : me.lowNote;
            me.playNoteNr(note);
            setTimeout(function () {
                me.stopNoteNr(note);
            }, me.noteLength);
        }
    }
}