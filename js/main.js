var clipBoard = null;

$(document).ready(function () {
    jQuery.fn.reverse = [].reverse;
    newWorkspaceItem("trash", "Papierkorb", "");
    newWorkspaceItem("folder", "Explorer", "");
    newWorkspaceItem("pdf", "Webdows Doku", "/Sourcefiles/PDF/Franz_Dokumentation.pdf");
    newWorkspaceItem("present", "Webdows", "");
    newWorkspaceItem("quotes", "Quotes", "");
    newWorkspaceItem("odaw", "Odaw", "");
    relativeToAbsolute();
    setInterval(rotateBg, 60000);
    rotateBg();
    preLoadImages();
});

$(document).mousemove(function (e) {
    if(moveframe && target && !$(target).hasClass("max")) {
        if(ajustVertical(e, deltaY))$(target).css({top: e.pageY-deltaY});
        if(ajustHorizontal(e, deltaX))$(target).css({left: e.pageX-deltaX});
    }

    switch(resize) {
        case "n": if(ajustVerticalResize(e, 0))$(target).css({top: e.pageY-2, height:targetT-e.pageY+targetH+2});break;
        case "e": $(target).css({width: e.pageX-targetL});break;
        case "s": $(target).css({height: e.pageY-targetT});break;
        case "w": if(ajustHorizontalResize(e, 0))$(target).css({left: e.pageX-2, width:targetL-e.pageX+targetW+2});break;
        case "ne": if(ajustVerticalResize(e, 0))$(target).css({top: e.pageY-2, height:targetT-e.pageY+targetH+2});$(target).css({width: e.pageX-targetL});break;
        case "nw": if(ajustVerticalResize(e, 0))$(target).css({top: e.pageY-2, height:targetT-e.pageY+targetH+2});if(ajustHorizontalResize(e, 0))$(target).css({left: e.pageX-2, width:targetL-e.pageX+targetW+2});break;
        case "sw": $(target).css({height: e.pageY-targetT});if(ajustHorizontalResize(e, 0))$(target).css({left: e.pageX-2, width:targetL-e.pageX+targetW+2});break;
        case "se": $(target).css({height: e.pageY-targetT});$(target).css({width: e.pageX-targetL});break;
    }
}).mouseleave(function () {
    target = false;
    moveframe = false;
    resize = false;
}).mouseup(function () {
    target = false;
    moveframe = false;
    resize = false;
    destroyCMenu();
}).mousedown(function (e) {
    toggleFocus(false);
});

function toggleFocus(element) {
    var domTarget = $(element);
    $(".active").removeClass("active");
    if(domTarget) {
        if($(domTarget).hasClass("iFrame"))$(domTarget).css({"z-index": layer});
        $(domTarget).addClass("active");
        layer++;
        if(element.classList) {
            $("."+element.classList[0]).addClass("active");
        }
    }
}

function onFrameMoveDown(domTarget) {
    target = domTarget;
    $(domTarget).addClass("move");
    moveframe = true;
    deltaX = event.pageX-$(target).position().left;
    deltaY = event.pageY-$(target).position().top;
}

function onFrameMoveUp() {
    $(target).removeClass("move");
    moveframe = false;
    target = false;
    deltaX = null;
    deltaY = null;
}

function relativeToAbsolute() {
    $(".workSpaceItem").reverse().each(function () {
        $("#"+this.id).css({
            top: $(this).offset().top,
            left: $(this).offset().left
        }).removeClass("fixedWorkspaceItem");
    });
}

function setWorkspaceItemAbsolute(item) {
    $(item).css({
        top: 0,
        left: 0
    }).addClass("fixedWorkspaceItem");
}

function rotateBg() {
    var maxIndex = 6,
        index = Math.floor((Math.random() * maxIndex));

    while("url(\"../css/Import/bg/bg"+index+".jpg\")" == $("#mainFrame").css("background-image")) {
        index = Math.floor((Math.random() * maxIndex));
    }
    $("#mainFrame").css("background-image", "url('../css/Import/bg/bg"+index+".jpg')");
}

function preLoadImages() {
    for(var x = 0;x < 7;x++) {
        $("<div class='imagePreload' style='background-image: url(css/Import/bg/bg"+x+".jpg)'>").appendTo("#mainFrame");
    }
}
