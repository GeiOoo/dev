class SimpleSynth extends Generator {
    constructor(data) {
        super(data);

        if(!data) data = {};

        this.elem = "";
        this.waveSelect = "";

        this.harmonics = data.harmonics || 64;

        this.loadTemplate();
    }

    loadTemplate() {
        let me = this;
        me.elem = $(templates.simpleSynth).appendTo(".layer.master");
        me.waveSelect = me.elem.find(".waveSelect");
        me.delete = me.elem.find(".delete");


        me.waveSelect.val(me.defaultWaveType).change(function () {
            if($(this).find("option:selected").val() == "4") {
                let knob = $(this).parent().find(".knob.harmonics");
                knob.removeClass("disabled");
                let n = parseInt(knob.attr("data-value")) + 3;

                let real = new Float32Array(n);
                let imag = new Float32Array(n);

                for (let x = 1; x < n; x+=2) {
                    imag[x] = 4.0 / (Math.PI*x);
                }

                let wt = project.ctx.createPeriodicWave(real, imag);
                me.setCustomWaveType(wt);

            } else if($(this).find("option:selected").val() == "5") {
                let knob = $(this).parent().find(".knob.harmonics");
                knob.removeClass("disabled");
                let n = parseInt(knob.attr("data-value")) + 2;

                let real = new Float32Array(n);
                let imag = new Float32Array(n);

                for (let x = 1; x < n; x++) {
                    imag[x] = 4.0 / (Math.PI*x);
                }

                let wt = project.ctx.createPeriodicWave(real, imag);
                me.setCustomWaveType(wt);

            } else if($(this).find("option:selected").val() == "6") {
                let knob = $(this).parent().find(".knob.harmonics");
                knob.removeClass("disabled");
                let n = parseInt(knob.attr("data-value")) + 2;

                let real = new Float32Array(n);
                let imag = new Float32Array(n);

                for (let x = 1; x < n; x++) {
                    imag[x] = Math.random() * 2 / (Math.PI * x);
                    real[x] = Math.random() * 2 / (Math.PI * x);
                }

                let wt = project.ctx.createPeriodicWave(real, imag);
                me.setCustomWaveType(wt);

            } else {
                $(this).parent().find(".knob.harmonics").addClass("disabled");
                me.setWaveType($(this).find("option:selected").val());
            }
        });

        me.delete.click(() => $(document).trigger("deleteInstance", me));

        new Knob({
            val: me.harmonics,
            min: 0,
            max: 512,
            step: 1,
            expo: 3,
            size: "0.3em",
            showNum: false,
            callback: () => me.waveSelect.trigger("change"),
            parent: me.elem.find(".surface"),
            label: "Hrm",
            title: "Harmonics"
        }).elem.addClass("tiny disabled harmonics");

        let knobConfig = {
            val: me.volume,
            min: 0,
            max: 1,
            step: 0.001,
            expo: 2,
            size: "0.3em",
            radius: 35,
            showNum: false,
            callback: (v) => me.setVolume(v),
            parent: me.elem.find(".surface"),
            label: "Vol",
            title: "Volume"
        };

        new Knob(knobConfig).elem.addClass("tiny volume");
        me.setVolume(me.volume);

        knobConfig.val = me.attack;
        knobConfig.min = 0.001;
        knobConfig.max = 10;
        knobConfig.expo = 3;
        knobConfig.callback = (v) => me.setAttack(v);
        knobConfig.label = "Att";
        knobConfig.title = "Attack";
        new Knob(knobConfig).elem.addClass("tiny");

        knobConfig.val = me.decay;
        knobConfig.callback = (v) => me.setDecay(v);
        knobConfig.label = "Dec";
        knobConfig.title = "Decay";
        new Knob(knobConfig).elem.addClass("tiny");

        knobConfig.val = me.sustain;
        knobConfig.min = 0;
        knobConfig.max = 1;
        knobConfig.expo = 1;
        knobConfig.callback = (v) => me.setSustain(v);
        knobConfig.label = "Sus";
        knobConfig.title = "Sustain";
        new Knob(knobConfig).elem.addClass("tiny");

        knobConfig.val = me.release;
        knobConfig.min = 0.001;
        knobConfig.max = 10;
        knobConfig.expo = 3;
        knobConfig.callback = (v) => me.setRelease(v);
        knobConfig.label = "Rel";
        knobConfig.title = "Release";
        new Knob(knobConfig).elem.addClass("tiny");

        me.elem.find(".surface").append(new Visualizer(me, 75, 50).elem);
    }
}