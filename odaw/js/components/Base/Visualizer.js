class Visualizer extends Base {
    constructor(synth, width, height) {
        super();

        this.analyser = project.ctx.createAnalyser();
        this.synth = synth;

        this.synth.output.connect(this.analyser);

        this.analyser.fftSize = 4096;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        this.width = width;
        this.height = height;

        this.anim = null;

        this.curFreq = 0;
        this.startFreq = 0;
        this.curTime = project.ctx.currentTime;
        this.startTime;
        this.sampleRate = project.ctx.sampleRate;

        this.loadTemplate();
    }
    loadTemplate() {
        let me = this;

        me.elem = $(templates.visualizer);
        me.canvas = me.elem.find("canvas").get(0).getContext("2d");
        me.elem.find("canvas").attr("width",me.width);
        me.elem.find("canvas").attr("height",me.height);

        me.synth.elem.on("startNote", () => me.startDraw());
        me.synth.elem.on("stopTone", () => me.stopDraw());
    }

    startDraw() {
        let me = this;
        me.startFreq = me.synth.getLowestPlayingFreq();
        me.startTime = undefined;
        me.anim = true;
        me.draw();

        me.canvas.lineWidth = 2;
        me.canvas.strokeStyle = getComputedStyle(document.body).getPropertyValue("--light-text-color");
        if($("body").hasClass("dark")) {
            me.canvas.shadowBlur = 5;
            me.canvas.shadowColor = getComputedStyle(document.body).getPropertyValue("--light-text-color");
        } else {
            me.canvas.lineWidth = 3;
            me.canvas.shadowBlur = 0;
        }
    }

    stopDraw() {
        let me = this;
        me.anim = false;
        me.canvas.clearRect(0, 0, me.width, me.height);
    }

    draw() {
        let me = this;
        if(me.anim === false) return;

        requestAnimationFrame(() => me.draw());

        if(me.synth.getLowestPlayingFreq() != null || me.curFreq == 0)
            me.curFreq = me.synth.getLowestPlayingFreq();
        if(me.startFreq != me.curFreq) me.startFreq = me.curFreq;

        me.curTime = project.ctx.currentTime;

        if(me.startTime === undefined) {
            me.startTime = me.curTime;
        }

        let timeDiff = me.curTime - me.startTime;
        let freqLength = 0.997 / me.curFreq;

        let bufferLengthSec = me.bufferLength / me.sampleRate;
        let lastStart = bufferLengthSec - timeDiff % freqLength;

        let firstStart = lastStart - Math.floor(lastStart / freqLength) * freqLength;
        let startSample = firstStart * me.sampleRate;

        me.analyser.getByteTimeDomainData(me.dataArray);

        me.canvas.clearRect(0, 0, me.width, me.height);
        me.canvas.beginPath();



        me.canvas.moveTo(0, me.height/2);

        let sliceWidth = me.width / me.bufferLength * 4;
        let x = 0;

        for (let i = Math.round(startSample); i < me.bufferLength; i++) {

            let v = me.dataArray[i] / 128.0;

            let y = v * me.height / 2;

            if (i === Math.round(startSample)) {
                me.canvas.moveTo(x, y);
            } else {
                me.canvas.lineTo(x, y);
            }

            x += sliceWidth;

        }

        //me.canvas.lineTo(me.width, me.height/2);

        me.canvas.stroke();
    }

}