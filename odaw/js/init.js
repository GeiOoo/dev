if(sessionStorage.getItem('visited') == "true") disableLoading();

function disableLoading() {
    document.documentElement.classList.add("loading-done");
}
function moveLoading() {
    $(".loading").closest(".layer").removeClass("active").insertBefore($(".layer.master").eq(0));
    $(".layer.master").addClass("active");
}

$(window).on("load", function() {
    if(sessionStorage.getItem('visited') != "true")
    {
        sessionStorage.setItem('visited', "true");
        $(".loading").toggleClass("done");
        $(".layer.master").delay(3300).queue(function (next) {
            $(this).addClass("active");
            next();
        });
        $(".loading").delay(3500).queue(function (next) {
            $(this).closest(".layer").animate({opacity: 0}, 200, function() {
                disableLoading();
                moveLoading();
            });
            next();
        });
    }
});

let t = () => {};
let a = "";


$(document).ready(function () {
    $(document).on("input change","input[type='range']", function() {
        changeProgress($(this));
    }).contextmenu(function (e) {
        e.preventDefault();
    });
    function changeProgress(elem) {
        elem.css("background-size",(elem.val()/elem.attr("max")*100)+"% 100%");
    }

    let objs = {
        single :[],
        multi: [],
        add: newInstance,
        getS: getSingle,
        getM: getMulti,
        del: deleteInstance
    };

    let layer0 = objs.add(new Layer("background", true));
    layer0.setMaster();
    if(sessionStorage.getItem('visited') == "true") moveLoading();

    let met = objs.add(new Metronome());
    let mkb = objs.add(new Keyboard());

    let layer1 = objs.add(new Layer("background"));
    layer1.addContent(objs.add(new Settings()));

    met.settingsElem.click(function() {
        layer1.move("foreground", true);
    });

    objs.add(new SimpleSynth());
    objs.add(new SimpleSynth());

    lsh.getActions(objs);

    $(document).on("deleteInstance", deleteInstance);
    t = () => {return objs};

    function newInstance(inst) {
        let newInst = true;
        if(inst.multi) {
            objs.multi.push(inst);
            if(inst.playNoteNr) {
                inst.elem.on("click", () => mkb.connect(inst)).click();
                mkb.updateTranspose();
            }
        } else {
            objs.single.forEach(function (e) {
                if(e.constructor === inst.constructor) {
                    inst.remove();
                    inst = e;
                    newInst = false;
                }
            });
            if(newInst) {
                objs.single.push(inst);
            }
        }
        return inst;
    }

    function getSingle(type) {
        let response = false;
        objs.single.forEach(function (e) {
            if(e instanceof type) {
                response = e;
            }
        });
        return response;
    }

    function getMulti(inst) {
        let response = {};
        objs.multi.forEach((e, i) => {
            if(e === inst) {
                response = {inst: e, index: i};
            }
        });
        return response;
    }

    function deleteInstance(event, inst) {
        let data = getMulti(inst);
        if(data.inst.elem)data.inst.elem.remove();
        if(data.inst.stopAllTones) data.inst.stopAllTones();
        data.inst = null;
        objs.multi.splice(data.index, 1);
        return true;
    }
});