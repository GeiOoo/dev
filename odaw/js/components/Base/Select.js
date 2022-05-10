class Select extends Base {

    constructor(data) {
        super();

        this.data = data;
        this.scroll = false;
        this.parent = data.parent;
        this.loadTemplate();
    }

    init() {
        let me = this;
        let options = me.data.options;

        for(let i = 0; i < options.length; i++) {
            let elem = me.option.clone().text(options[i].name).appendTo(me.div);
            if(options[i].default === true) {
                me.elem.attr("data-selected",options[i].name);
            }
            if(options[i].selectable === false) elem.addClass("disabled");
            if(options[i].value !== undefined) elem.attr("data-value",options[i].value);
        }
        me.div.css("left", me.elem.outerWidth() / 2 - me.div.outerWidth()/2);
        if(me.data.scroll === true) {
            me.scroll = true;
        }

    }

    loadTemplate() {
        let me = this;
        me.elem = $(templates.select).appendTo(me.parent);
        me.option = me.elem.find(".option").remove();
        me.div = me.elem.children("div").eq(0);

        me.init();

        me.options = me.elem.find(".option");

        me.elem.on("focusin", function(e) {
            let selectY = me.div.offset().top + me.div.outerHeight() / 2;
            me.div.addClass("opening").css({"top": 0 - me.elem.css("font-size").substring(0, me.elem.css("font-size").length-2) * 1.8 * (me.options.length - 1) / 2});

            setTimeout(function() {
                me.div.removeClass("opening");
                me.options.on("click", function() {
                    me.selected = $(this).off("click");
                    if(!me.selected.hasClass("disabled")) {
                        me.selected.addClass("selected").siblings(".selected").removeClass("selected");
                        me.elem.attr("data-selected",me.selected.text());
                        me.div.css("left", me.elem.outerWidth() / 2  - me.div.outerWidth()/2);
                    } else return;
                    me.div.css("top","");
                    me.elem.blur();
                    if(me.scroll) $(window).off("mousemove");
                });
                if(me.scroll)
                    $(window).on("mousemove", function(e) {
                        if (project.isTouch) return;
                        let val = (selectY - e.pageY) - me.div.outerHeight() / 2;
                        let max = me.options.eq(0).outerHeight() - me.div.outerHeight();

                        if(val <= max) val = max;
                        else if(val >= 0) val = 0;
                        me.div.css("top",val+"px");
                    });
            },400);
        }).on("focusout", function() {
            me.div.css("top","");
            me.options.off("click");
            if(me.scroll) $(window).off("mousemove");
        });
    }
}