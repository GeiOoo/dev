function newWindowItem(windowData) {
    var elem, item;
    $.get("templates/window.html", function (data) {
        $.get("templates/toolbarItem.html", function (toolbarItemData) {
            elem = $(data).appendTo("#workspace");
            elem.hide().addClass(windowData.type).data("data", windowData);
            elem.find(".windowTopbarLabel").text(windowData.title);
            elem.find(".windowTopbarIcon > .icon").addClass("icon-" + windowData.type);
            elem.find(".btnMin").click();
            elem.find(".windowContent").on("mousedown click dblclick", function (e) {
                toggleActiveWindowItem(elem);
                e.stopPropagation();
                e.preventDefault();
            });
            elem.find(".btnMax").click(function () {
                $(elem).toggleClass("fullscreen");
            });
            elem.find(".btnClose").click(closeWindow);
            elem.find(".windowTopbarBtns").on("mousedown click dblclick", function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
            elem.click(function (e) {
                toggleActiveWindowItem(elem);
                e.stopPropagation();
                e.preventDefault();
            }).mousedown(windowStartDrag).dblclick(function () {
                $(elem).toggleClass("fullscreen");
            });
            elem.find(".sizer").mousedown(function (e) {
                $(elem).addClass("isResizing");
                $(document).mousemove(function (e) {
                    resizeWindow(elem, e);
                }).mouseup(function (e) {
                    $(document).off("mousemove mouseup");
                    $(elem).removeData("direction");
                    $(elem).removeClass("isResizing");
                    e.stopPropagation();
                    e.preventDefault();
                });
                $(elem).data("direction", $(this).data("direction"));
                e.stopPropagation();
                e.preventDefault();
            });
            getWindowContent(windowData.type, elem);
            item = $(toolbarItemData).appendTo(".hideScroll");
            item.hide();
            item.find(".icon").addClass("icon-"+windowData.type).data("window", elem).click(function (e) {
                toggleActiveWindowItem($(this).data("window"));
                e.stopPropagation();
                e.preventDefault();
            });
            elem.data("item", item);
            $(elem).fadeIn(200).width(700).height(300);
            $(item).fadeIn(200);
            $(".hideScroll").animate({scrollLeft: item.offset().left}, 500);
            toggleActiveWindowItem(elem);
        });
    });
}

function resizeWindow(elem, e) {
    var direction = $(elem).data("direction");

    switch (direction) {
        case "n":
            resizeTop();break;
        case "e":
            resizeRight();break;
        case "s":
            resizeBottom();break;
        case "w":
            resizeLeft();break;
        case "ne":
            resizeTop();resizeRight();break;
        case "nw":
            resizeTop();resizeLeft();break;
        case "se":
            resizeBottom();resizeRight();break;
        case "sw":
            resizeBottom();resizeLeft();break;
    }


    function resizeTop() {
        var transformMatrix = elem.css("-webkit-transform") ||
            elem.css("-moz-transform")    ||
            elem.css("-ms-transform")     ||
            elem.css("-o-transform")      ||
            elem.css("transform"),
            matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(','),
            x = matrix[12] || matrix[4],
            y = matrix[13] || matrix[5],
            height = $(elem).height() + (y - e.clientY);

        if(height > parseInt($(elem).css("min-height"))) {
            $(elem).css({
                transform: "translate("+x+"px, "+e.clientY+"px)"
            }).height(height);
        }
    }

    function resizeRight() {
        $(elem).width(e.clientX - $(elem).offset().left);
    }

    function resizeBottom() {
        $(elem).height(e.clientY - $(elem).offset().top);
    }

    function resizeLeft() {
        var transformMatrix = elem.css("-webkit-transform") ||
            elem.css("-moz-transform")    ||
            elem.css("-ms-transform")     ||
            elem.css("-o-transform")      ||
            elem.css("transform"),
            matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(','),
            x = matrix[12] || matrix[4],
            y = matrix[13] || matrix[5],
            width = $(elem).width() + (x - e.clientX);

        if(width > parseInt($(elem).css("min-width"))) {
            $(elem).css({
                transform: "translate("+e.clientX+"px, "+y+"px)"
            }).width(width);
        }
    }
}

function toggleActiveWindowItem(item) {
    $(".active").removeClass("active");
    $(item).addClass("active");
    if($(item).data("item")) {
        $(item).css("z-index", getMaxItemZ()+1);
        $(item).data("item").addClass("active");
    }
}

function closeWindow() {
    $(this).closest(".window").data("item").fadeOut(200, function () {
        $(this).remove();
    });
    $(this).closest(".window").fadeOut(200, function () {
        $(this).remove();
    });
}

function getMaxItemZ() {
    var z = 0;
    $(".window").each(function () {
        z = Math.max(z, parseInt($(this).css("z-index")));
    });
    return z;
}

function windowStartDrag(e) {
    if(!$(this).hasClass("fullscreen")) {
        toggleActiveWindowItem(this);
        $(".isDragging").removeClass("isDragging");
        $(this).addClass("isDragging").data({
            mouseOffset: {
                left: e.clientX - $(this).position().left,
                top: e.clientY - $(this).position().top
            }
        });
        $(window).on("mousemove", function (eM) {
            windowOnDrag(eM)
        }).on("mouseup", windowEndDrag);
    }
    e.stopPropagation();
    e.preventDefault();
}

function windowOnDrag(e) {
    var elem = $(".isDragging"),
        newX = e.clientX - elem.data("mouseOffset").left,
        newY = e.clientY - elem.data("mouseOffset").top;
    elem.css("transform", "translate("+newX+"px,"+newY+"px)");
}

function windowEndDrag(e) {
    $(".isDragging").removeClass("isDragging").removeData("mouseOffset");
    $(window).off("mousemove").off("mouseup");
}

function getWindowContent(type, elem) {
    var content;
    $.get("templates/content/"+type+".html", function (contentData) {
        content = $(contentData).appendTo($(elem).find(".windowContent"));
        switch (type) {
            case "folder":
                getFolderGridConfig(elem);
                break;
        }
    });
}