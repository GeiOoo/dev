class Settings extends Base {
    constructor(layer) {
        super();

        this.multi = false;

        this.elem = "";
        this.layer = "";
        this.hue = "";
        this.hueKnob = "";

        this.loadTemplate();
    }
    loadTemplate() {
        let me = this;

        me.elem = $(templates.settings);

        let knobConfig = {
            val: getComputedStyle(document.body).getPropertyValue("--main-hue"),
            min: 0,
            max: 360,
            step: 30,
            size: "0.7em",
            radius: "",
            showNum: false,
            title: "Hue",
            callback: (v) => {me.setColor(v)},
            parent: me.elem
        };

        me.hueKnob = new Knob(knobConfig);
        me.hueKnob.elem.addClass("hue");

        me.elem.append(me.hueKnob.elem);

        me.elem.append('<div class="embed"><div class="icon-button switch-themes">Switch Theme</div></div>');
        me.elem.find(".switch-themes").on("click", function() {
            $("body").toggleClass("dark light");
            lsh.set("theme", {value: ($("body").hasClass("dark"))? "dark" : "light"});
        });


        me.hue = me.hueKnob.elem;
    }

    setColor(valHue) {
        let me = this;
        me.setHue(valHue);
        me.setLum(valHue);
        lsh.set("hueValue", {value: valHue});
    }

    setHue(valHue) {
        document.body.style.setProperty("--main-hue", valHue);
        document.body.style.setProperty("--main-hue2", (valHue < 5) ? (355 + valHue) : (valHue - 5));
        document.body.style.setProperty("--main-hue3", (valHue < 20) ? (340 + valHue) : (valHue - 20));
    }
    setLum(valHue) {

        let valLum;
        if(valHue >= 200)
            valLum = parseInt(mapLinearSymmetricRise(valHue, 200, 300, 0, 65, 74));
        else
            valLum = parseInt(mapLinearAsymmetricRise(valHue, 0, 200, 60, 60, 65, 40));
        document.body.style.setProperty("--main-lum", valLum + "%");
        document.body.style.setProperty("--main-lum2", (valLum >= 100) ? 100 : valLum + 5 + "%");
        document.body.style.setProperty("--main-lum3", (valLum >= 100) ? 100 : valLum + 15 + "%");

    }
}