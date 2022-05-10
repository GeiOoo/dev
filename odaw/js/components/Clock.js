let test = {
    0.5: {
        5 : [330, 660, 990],
        4: [200]
    },
    1.5: {
        5: [-1, -2, -2]
    },
    2.8: {
        5 : [440, 390, 1200],
        4: [100],
        1: [3600, 900]
    }
};

class Clock {

    static startLoop() {
        this.metronomEvent = $.Event("metronomClick");
        this.loop(this);
        this.loopID = setInterval(this.loop, 20, this);
    }

    static pauseLoop() {
        clearInterval(this.loopID);
    }

    static stopLoop() {
        project.pos = -20;
        project.mpbLeft = 0;
        clearInterval(this.loopID);
    }

    static loop(loop) {
        project.pos += 20;
        project.mpbLeft -= 20;
        if(project.mpbLeft <= 0) {
            project.mpbLeft = project.mpb / (project.steps / 4);
            $("body").trigger(loop.metronomEvent);
        }
    }
}