class Knob extends Base {

    constructor(data) {
        super();

        this.elem;
        this.pStart = {};
        this.pCur = {};

        this.min = data.min || 0;
        this.max = data.max || 100;
        this.val = data.val || this.min;
        this.defaultVal = this.val;
        this.range = this.max - this.min;
        this.expo = data.expo || 1;
        this.percent = 0;
        this.stroke = 0;
        this.maxStroke = 0;
        this.degree = 0;
        this.angle = 0;

        this.step = data.step || 0;
        this.stepFine = this.step / 2;
        this.curStep = 0;
        this.size = data.size || "1em";

        this.strokeElem = "";
        this.glow = "";
        this.pointer = "";
        if(data.showNum === undefined) this.showNum = true;
        else this.showNum = data.showNum;
        this.label = data.label || false;
        this.title = data.title || false;

        this.callback = data.callback;

        this.parent = data.parent;

        this.loadTemplate();
    }

    init() {
        let me = this;

        if(!this.showNum) me.elem.removeClass("showNum");
        me.strokeElem = me.elem.find(".outer path.stroke");
        me.glow = me.elem.find(".outer path.glow");
        me.pointer = me.elem.find(".inner > div > div");

        if($.isNumeric(me.size)) me.elem.css("font-size", me.size + "px");
        else me.elem.css("font-size", me.size);

        me.elem.attr("data-step",me.step);

        if(me.label !== false) {
            me.elem.attr("data-label",me.label);
            me.elem.addClass("showlab");
        }
        if(me.title !== false) {
            me.elem.attr("title",me.title);
        }

        me.percent = me.getPercentFromVal();
        me.update();

    }

    loadTemplate() {
        let me = this;
        me.elem = $(templates.knob).appendTo(me.parent);

        me.init();

        me.elem.on("mousedown touchstart", function(e) {
            if(!$(this).hasClass("disabled")) {
                if (e.ctrlKey) {
                    me.percent = Knob.getPercentFromVal(me.defaultVal, me.min, me.max, me.expo);
                    lsh.delete("hueColor");
                    me.update();
                } else {
                    $(this).addClass("changing");
                    if (e.touches != undefined) me.pStart = me.pstep = {
                        x: e.touches[0].clientX,
                        y: e.touches[0].clientY
                    };
                    else me.pStart = me.pstep = {
                        x: $(this).offset().left + $(this).width() / 2,
                        y: $(this).offset().top + $(this).height() / 2
                    };

                    me.percent = me.getPercentFromVal();
                }

                $(window).on("mousemove touchmove", function(e) {
                    if(me.elem.hasClass("changing")) {
                        if (e.touches !== undefined) me.pCur = {x: e.touches[0].clientX, y: e.touches[0].clientY};
                        else me.pCur = {x: e.clientX, y: e.clientY};

                        me.angle = Math.atan2(me.pStart.y - me.pCur.y, me.pStart.x - me.pCur.x) * 180 / Math.PI + 180;

                        if (me.angle < 90) me.angle += 360;

                        if (me.step > 0) {
                            me.curStep = me.step;
                            if (e.altKey) me.curStep = me.stepFine;
                            else me.curStep = me.step;

                            if (Math.abs(me.getPercentFromAngle() - me.percent) >= me.curStep / me.range * 100) {
                                let change = Math.round((me.getPercentFromAngle() - me.percent) / (me.curStep / me.range * 100));

                                me.percent = +me.percent + change * me.curStep / me.range * 100;
                                me.update();
                            }
                        } else {
                            me.percent = me.getPercentFromAngle();
                            me.update();
                        }
                    }
                });

            }
        }).on("change", function () {
            if(typeof me.callback === "function") me.callback(parseFloat($(this).attr("data-value")));
        });

        $(document).on("mouseup touchend", function() {
            me.elem.removeClass("changing");
            $(window).off("mousemove touchmove");
        });
    }

    setPercent(p) {
        let me = this;

        me.percent = p;
        me.update();
    }

    setValue(v) {
        let me = this;

        me.val = v;
        me.setPercent(me.getPercentFromVal());
    }

    update() {
        let me = this;

        if(me.percent > 100) me.percent = 100;
        if(me.percent < 0) me.percent = 0;

        me.degree = me.getDegree();
        me.stroke = me.getStroke();
        me.maxStroke = me.getMaxStroke();
        me.val = round(me.getValFromPercent(), getDecimals(me.curStep));
        if(me.val > me.max) me.val = me.max;
        else if(me.val < me.min) me.val = me.min;
        me.elem.attr("data-value", me.val);
        me.pointer.css("transform", "rotate(" + me.degree + "deg)");
        me.strokeElem.add(me.glow).css("stroke-dasharray", me.stroke + ", " + me.maxStroke);
        me.elem.trigger("change");
    }
    getPercentFromVal() {
        let p = (this.val - this.min) / this.range;
        let pre = 1;
        if(p < 0) pre = -1;
        p = Math.abs(p);
        return Math.pow(p, 1/this.expo) * pre * 100;
    }
    static getPercentFromVal(val, min, max, expo) {
        let p = (val - min) / (max - min);
        let pre = 1;
        if(p < 0) pre = -1;
        p = Math.abs(p);
        return Math.pow(p, 1/expo) * pre * 100;
    }
    getValFromPercent() {
        return Math.pow(this.percent / 100, this.expo) * this.range + this.min;
    }
    getPercentFromAngle() {
        return this.angle / 2.7 - 50;
    }
    getValFromAngle() {
        return Math.pow(this.getPercentFromAngle() / 100, this.expo) * this.range + this.min;
    }
    getDegree() {
        return (this.percent - 50) * 2.7;
    }
    getStroke() {
        return this.percent*0.75;
    }
    getMaxStroke() {
        return 100;
    }
}