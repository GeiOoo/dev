$(function(){
	$.widget("custom.dragger", {
		options: {
			resize: true,
			overflow: false,
			workspace: $("body"),
			mOffset: {},
            windowDrag: false,
			beforeDrop: function () {

            },
			afterDrop: function () {

            }
		},
		
		_create: function() {
			this.target = this.element[0];
			this.workspace = this.options.workspace;

			if(this.options.resize){
				$(	'<div class="frameSizer topSizer" data-dir="n"></div>' +
					'<div class="frameSizer leftSizer" data-dir="w"></div>' +
					'<div class="frameSizer rightSizer" data-dir="e"></div>' +
					'<div class="frameSizer bottomSizer" data-dir="s"></div>'+
					'<div class="frameSizer cSizer topLeftSizer" data-dir="nw"></div>' +
					'<div class="frameSizer cSizer topRightSizer" data-dir="ne"></div>' +
					'<div class="frameSizer cSizer bottomLeftSizer" data-dir="sw"></div>' +
					'<div class="frameSizer cSizer bottomRightSizer" data-dir="se"></div>').appendTo(this.target);

				this._on($(this.target).find(".frameSizer"), {mousedown: "_startResize"});
			}
			this._on(this.target, {mousedown: "_onClick"});
		},

		_onClick: function (e) {
            if(this.clickTime) {
                if(this.clickTime > new Date()-300) {
					this._onDblClick(e);
                } else {
                    this._startDrag(e);
                }
            } else {
            	this._startDrag(e);
            }
        },
		
		_startDrag: function(e) {
			this.clickTime = new Date().getTime();
			if(!this.options.mOffset.top) {
				this.mOffset = {
					top: e.clientY - $(this.target).offset().top + $(this.workspace).offset().top,
					left: e.clientX - $(this.target).offset().left + $(this.workspace).offset().left
				}
			} else {
				this.mOffset = this.options.mOffset;
				this.options.mOffset.top = "";
			}

			$(this.target).addClass("isDragged");
			this._on($(document), {mousemove: "_onDrag", mouseup: "_drop"});

			$(".drop").on("mouseenter", function() {
				if(!$(".hovered").length > 0 && $($(this).children()[$(this).children().length-1]).is(".frameSizer")) $(this).addClass("hovered");
			}).on("mouseleave", function() {
				$(this).removeClass("hovered");
			});

			var index = 0;

			$(".drag").each(function () {
				if($(this).css("z-index") > index) index = parseInt($(this).css("z-index"));
			});

			$(this.target).css("z-index", index+1);

			e.preventDefault();
			e.stopPropagation();
		},
		
		_onDrag: function(e) {
			var newPos = {top: e.clientY - this.mOffset.top, left: e.clientX - this.mOffset.left};
            if(this.clickTime) delete this.clickTime;
            $("body").off("mouseleave", this._toLocalStorage);
			$(this.target).appendTo(this.workspace);
			if($(".drop.hovered").length > 0) {
                $(this.target).css({
                    top: $(".drop.hovered").offset().top + 15 - $(this.workspace).offset().top,
                    left: $(".drop.hovered").offset().left + 15 - $(this.workspace).offset().left
                });
			} else if(this.options.overflow || this._inWorkspace(newPos)) {
				$(this.target).css({
					top: newPos.top,
					left: newPos.left
				});
			} else {
                this._on($("body"), {mouseleave: this._toLocalStorage});
			}
		},
		
		_drop: function() {
			this.options.beforeDrop(this.target, ($(".drop.hovered").length > 0)? $(".drop.hovered")[0] : "");
            if($(".drop.hovered").length > 0) $(this.target).css({top: 14, left: 14}).appendTo($(".drop.hovered"));
			$(document).off("mousemove").off("mouseup");
            $(".isDragged").removeClass("isDragged");
            $(".drop").off("mouseenter").off("mouseleave").removeClass("hovered");
            this.options.afterDrop(($(".drop.hovered").length > 0)? $(".drop.hovered")[0] : "");
		},
		
		_inWorkspace: function(newPos) {
			return !(
			newPos.top <= 0 ||
			newPos.top + $(this.target).height() >= $(this.workspace).height() ||
			newPos.left <= 0 ||
			newPos.left + $(this.target).width() >= $(this.workspace).width()
			);
		},

		_startResize: function (e) {
			var me = this,
				dir = $(e.target).attr("data-dir");

			$(this.target).css({
				height: "auto",
				width: "auto",
				right: parseInt($(me.target).css("right")),
				bottom: parseInt($(me.target).css("bottom"))
			});

			$(document).on("mousemove", function (e) {

				var mPos = {
					top: e.clientY - $(me.target.parentElement).offset().top,
					left: e.clientX - $(me.target.parentElement).offset().left
				};
				mPos.right = $(me.target.parentElement).width() - mPos.left;
				mPos.bottom =  $(me.target.parentElement).height() - mPos.top;

                if(mPos.top > 0 && mPos.left > 0 && mPos.right > 0 && mPos.bottom > 0) {
                    switch(dir) {
                        case "n": if(mPos.top < $(me.target).offset().top + $(me.target).height() - 50) $(me.target).css({top: mPos.top});break;
                        case "w": if(mPos.left < $(me.target).offset().left + $(me.target).width() - 50) $(me.target).css({left: mPos.left});break;
                        case "e": if(mPos.right < ($(me.target.parentElement).width() - $(me.target).offset().left - 50)) $(me.target).css({right: mPos.right});break;
                        case "s": if(mPos.bottom < ($(me.target.parentElement).height() - $(me.target).offset().top - 50)) $(me.target).css({bottom: mPos.bottom});break;
                        case "nw":
							if(mPos.top < $(me.target).offset().top + $(me.target).height() - 50) $(me.target).css({top: mPos.top});
							if(mPos.left < $(me.target).offset().left + $(me.target).width() - 50) $(me.target).css({left: mPos.left});
							break;
                        case "ne":
                        	if(mPos.top < $(me.target).offset().top + $(me.target).height() - 50) $(me.target).css({top: mPos.top});
                            if(mPos.right < ($(me.target.parentElement).width() - $(me.target).offset().left - 50)) $(me.target).css({right: mPos.right});
                        	break;
                        case "sw":
                            if(mPos.bottom < ($(me.target.parentElement).height() - $(me.target).offset().top - 50)) $(me.target).css({bottom: mPos.bottom});
                            if(mPos.left < $(me.target).offset().left + $(me.target).width() - 50) $(me.target).css({left: mPos.left});
                            break;
                        case "se":
                            if(mPos.bottom < ($(me.target.parentElement).height() - $(me.target).offset().top - 50)) $(me.target).css({bottom: mPos.bottom});
                            if(mPos.right < ($(me.target.parentElement).width() - $(me.target).offset().left - 50)) $(me.target).css({right: mPos.right});
                            break;
                    }
				}
            });

			this._on($(document), {mouseup: "_stopResize"});

			e.stopPropagation();
			e.preventDefault();
        },

		_stopResize: function (e) {
            $(document).off("mousemove");
			$(this.target).css({
				bottom: "auto",
				right: "auto",
				height: $(this.target).height(),
				width: $(this.target).width()
			});

            e.stopPropagation();
            e.preventDefault();
        },

        _toLocalStorage: function () {
			if(this.workspace.selector == "body" && this.options.windowDrag) {
                localStorage.moveFrame = JSON.stringify({
                    html: $(this.target)[0].outerHTML,
					mOffset: this.mOffset
                });

                $(this.target).remove();
			}
        },

		_onDblClick: function () {
            delete this.clickTime;
        }
	});

    $("body").on("mouseover", function (e) {
        if(e.buttons == 1 && localStorage.moveFrame) {
            var obj = JSON.parse(localStorage.moveFrame), index = 0;

            $(".drag").each(function () {
                if($(this).css("z-index") > index) index = $(this).css("z-index")+1;
            });

            $(obj.html).appendTo("body").dragger({mOffset: obj.mOffset}).trigger("mousedown").css("z-index", index);
            localStorage.removeItem("moveFrame")
        }
    });
});