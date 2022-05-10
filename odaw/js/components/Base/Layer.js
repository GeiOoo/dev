class Layer extends Base {
    constructor(position, isMaster) {
        super();

        this.position = position;
        this.elem = "";
        this.isMaster = isMaster;

        this.loadTemplate();
    }
    loadTemplate() {
        let me = this;

        me.elem = $(templates.layer).appendTo("body");
        if(me.isMaster === true) me.setMaster();
        me.move(me.position);

        me.elem.mousedown(function(e) {
            if(me.elem.has(".dialogue").length != 0 && e.target == this) {
                me.move("background", true);
            }
        });
    }
    addContent(obj) {
        this.elem.append(obj.elem || obj);
    }
    append(child) {
        this.elem.append(child);
        return this;
    }
    getNumber() {
        return this.elem.attr("id").substr(6);
    }
    updateActive(removeAll) {
        if(removeAll === false || removeAll == undefined)$("body > .layer").removeClass("active");
        this.elem.removeClass("active");
        Layer.getTopLayer().addClass("active");
        return this;
    }
    remove() {
        this.elem.remove();
        return this.updateActive();
    }
    move(where, anim) {
        let duration = parseFloat(this.elem.css("transition-duration").split("s")[0])*1000;
        let me = this;

        if(where == undefined) where = "foreground";

        switch (where) {
            default:
            case "background":
                if(anim === true) {
                    Layer.getSecondTopLayer().addClass("active");
                    this.elem.animate({opacity: 0}, duration, animA);
                }
                else animA();

                function animA() {
                    me.elem.insertBefore($("body > .layer").eq(0));
                    me.updateActive(true);
                }
                break;
            case "back":
                this.elem.insertBefore($("body > .layer").eq(this.elem.index("body > .layer") - 1));
                me.updateActive();
                break;
            case "foreground":
                me.elem.insertAfter($("body > .layer").eq($("body > .layer").length - 1));
                if(this.elem.css("opacity") == 0 || this.anim === true) {
                    if(this.elem.css("opacity") != 0) this.elem.css("opacity", 0);
                    this.elem.animate({opacity: 1}, duration);
                }
                me.updateActive();
                break;
        }


    }
    setMaster() {
        this.elem.addClass("master");
        return this;
    }
    isMaster() {
        return this.hasClass("master");
    }
    static getMaster() {
        return $("body > .layer.master");
    }
    static getTopLayer() {
            return  $("body > .layer").eq($("body > .layer").length-1);
    }
    static getSecondTopLayer() {
        return  $("body > .layer").eq($("body > .layer").length-2);
    }
}