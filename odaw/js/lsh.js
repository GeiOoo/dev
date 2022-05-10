class lsh {
    constructor() {
        if (new.target === lsh) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }
    }

    static set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    static get(key) {
        return JSON.parse(localStorage[key]);
    }

    static delete(key) {
        delete localStorage[key];
    }

    static clear() {
        localStorage.clear();
    }

    static getActions(objects) {
        let actions = [];
        for (let key in localStorage){
            if(typeof localStorage[key] != "function") actions.push(key)
        }

        actions.forEach(function (action) {
            let data = lsh.get(action),
                func = () => {};
            if(data) {
                switch (action) {
                    case "hueValue": func = setHueValue;break;
                    case "theme": func = setTheme;break;
                    case "midiToggle": func = setMidiToggle;break;
                    default:break;
                }

                func(data);
            }
        });

        function setHueValue(data) {
            let settings = objects.getS(Settings);

            settings.setColor(data.value);
            settings.hueKnob.setValue(data.value)
        }

        function setTheme(data) {
            if(!$("body").hasClass(data.value)) $("body").toggleClass("dark light")
        }

        function setMidiToggle(data) {
            let keyboard = objects.getS(Keyboard);
            checkData();

            function checkData() {
                if(!keyboard.toggleMidi) setTimeout(checkData, 200);
                else {
                    if(data.value) {
                        if(keyboard.toggleMidi) keyboard.toggleMidi.click();
                    }
                }
            }
        }
    }
}