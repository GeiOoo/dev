var target = false,
    targetT = false,
    targetL = false,
    targetR = false,
    targetB = false,
    targetH = false,
    targetW = false,
    deltaX = false,
    deltaY = false,
    layer = 1,
    frameCount = 1,
    workspaceItemCount = 1,
    resize = false,
    moveframe = false;

function ajustVertical(e, delta) {
    return (e.pageY-delta > 0 && e.pageY-delta < parseInt($("#mainFrame").css("height").replace("px", ""))-100)
}

function ajustHorizontal(e, delta) {
    return (e.pageX-delta > 0 && e.pageX-delta < parseInt($("#mainFrame").css("width").replace("px", ""))-100)
}

function ajustVerticalResize(e, delta) {
    return (ajustVertical(e, delta) && targetT-e.pageY+targetH+2 > 150);
}

function ajustHorizontalResize(e, delta) {
    return (ajustHorizontal(e, delta) && targetL-e.pageX+targetW+2 > 200);
}

function newFrame(type, text, extra) {
    if(!text) text = "";
    if(event.which == 1) {
            $('<div id="itemFrame'+frameCount+'" class="itemFrame'+frameCount+' transparent iFrame active" onmousedown="toggleFocus(this);event.stopPropagation()" oncontextmenu="return showContextMenu(event, 3, this);">'+
                '<div class="iFrameTopBarBtns">'+
                    '<div class="iFrameTopBarBtn icon" onclick="hideFrame(this.parentElement.parentElement);"><i class="icon-min" style="margin-top: 10px;"></i></div>' +
                    '<div class="iFrameTopBarBtn icon" onclick="$(this.parentElement.parentElement).toggleClass(\'max\')"><i class="icon-max" style="margin-top: 3px"></i></div>' +
                    '<div class="iFrameTopBarBtn close icon" onclick="removeFrame(this)"><i class="icon-close"></i></div>'+
                '</div>'+
                '<div class="iFrameTopBar" onmouseup="onFrameMoveUp()" onmousedown="onFrameMoveDown(this.parentElement)" ondblclick="$(this.parentElement).toggleClass(\'max\')">'+
                    '<i class="icon-'+type+' frameLabel"><b class="frameLabelTxt">'+text+'</b></i>'+
                '</div>'+
                '<div class="iFrameContent">' +
                    getFrameContent(type, extra)+
                '</div>'+
                '<div class="topSizer" onmousedown="setResize(this.parentElement, \'n\')" onmouseup="clearResize()"></div>' +
                '<div class="leftSizer" onmousedown="setResize(this.parentElement, \'w\')" onmouseup="clearResize()"></div>' +
                '<div class="rightSizer" onmousedown="setResize(this.parentElement, \'e\')" onmouseup="clearResize()"></div>' +
                '<div class="bottomSizer" onmousedown="setResize(this.parentElement, \'s\')" onmouseup="clearResize()"></div>'+
                '<div class="cSizer topLeftSizer" onmousedown="setResize(this.parentElement, \'nw\')" onmouseup="clearResize()"></div>' +
                '<div class="cSizer topRightSizer" onmousedown="setResize(this.parentElement, \'ne\')" onmouseup="clearResize()"></div>' +
                '<div class="cSizer bottomLeftSizer" onmousedown="setResize(this.parentElement, \'sw\')" onmouseup="clearResize()"></div>' +
                '<div class="cSizer bottomRightSizer" onmousedown="setResize(this.parentElement, \'se\')" onmouseup="clearResize()"></div>'+
                '</div>').appendTo("#workspace");
        newTaskbarItem(frameCount, type);
        toggleFocus(".itemFrame"+frameCount);
        switch(type) {
            case "folder" :
                setFolderGridConfig(".itemFrame"+frameCount);
                getFolderContent({"path": extra}, ".itemFrame"+frameCount);
                break;
            case "trash":
                setTrashGridConfig(".itemFrame"+frameCount);
                getTrashContent({}, ".itemFrame"+frameCount);
        }
        frameCount++;
    }
}

function getFrameContent(type, relPath) {
    switch(type) {
        case "folder": return '' +
            '<div id="grid_array" class="folderGrid" oncontextmenu="return showContextMenu(event, 4, true)"></div>' +
            '<div class="uploadFile icon" onmouseup="showUploadForm();"><i class="icon-upload"></i></div>' +
            '';break;
        case "pic": return '' +
            '<div style="height: 100%;width: 100%;position:absolute;background-color: black">' +
                '<img src="'+window.location.href+'php/data'+relPath+'" class="fullImage">' +
            '</div>';break;
        case "vid": return '<div id="player-'+layer+'"></div>';break;
        case "trash": return '<div id="grid_array" class="trashGrid" oncontextmenu=""></div>';break;
        case "pdf": return '<embed class="pdfViewer" src="'+window.location.href+'php/data'+relPath+'" width="600" height="500" alt="pdf" pluginspage="http://www.adobe.com/products/acrobat/readstep2.html">';
        case "present": return '<iframe style="height: calc(100% - 4px);width: 100%;"src="https://docs.google.com/presentation/d/16KTCF_GBLu9rx87KyvByI_8RUFza6OusVAzH4O9fBqQ/embed?start=false&loop=false&delayms=3000" frameborder="0" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>';
        case "quotes": return '<iframe style="height: calc(100% - 4px);width: 100%;"src="https://quotes.marleyfi.net/" frameborder="0" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>';
        case "odaw": return '<iframe style="height: calc(100% - 4px);width: 100%;"src="https://odaw.geiooo.net/" frameborder="0" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>';
        default: return "";break;
    }
}

function showAudioPlayer(name, relPath, type) {
    if($(getNextLayerFrame()+" > .iFrameContent > .audioPlayerContainer").length == 0) {
        $("<div class='audioPlayerContainer'>" +
            "<label class='audioPlayerLabel'>"+name+"</label>" +
            "<div class='audioPlayerClose icon'><i class='pq-icon-close'></i></div>" +
            "<audio id='audioPlayer' class='audioPlayer' controls autoplay>" +
                '<source id="audioPlayerSrc" src="'+window.location.href+'php/data'+relPath+'" type="audio/'+type+'">' +
            "</audio>" +
        "</div>").appendTo(getNextLayerFrame()+" > .iFrameContent");
        $(getNextLayerFrame()+" > .iFrameContent > .audioPlayerContainer > #audioPlayer").get()[0].volume = 0.5;
        $(getNextLayerFrame()+" > .iFrameContent > .audioPlayerContainer > .audioPlayerClose").on('click', function (event) {
            $(event.currentTarget.parentNode).remove();
        });
    } else {
        $(getNextLayerFrame()+" > .iFrameContent > .audioPlayerContainer > #audioPlayer > #audioPlayerSrc").get()[0].src = window.location.href+'php/data'+relPath;
        $(getNextLayerFrame()+" > .iFrameContent > .audioPlayerContainer > .audioPlayerLabel").text(name);
        $(getNextLayerFrame()+" > .iFrameContent > .audioPlayerContainer > #audioPlayer").load();
    }
}

function setFrameText(item, text) {
    $(item+" > frameLabel > frameLabelTxt").text(text);
}

function setResize(frame, direction) {
    targetT = parseInt($(frame).css("top").replace("px", ""));
    targetL = parseInt($(frame).css("left").replace("px", ""));
    targetR = parseInt($(frame).css("right").replace("px", ""));
    targetB = parseInt($(frame).css("bottom").replace("px", ""));
    targetH = parseInt($(frame).css("height").replace("px", ""));
    targetW = parseInt($(frame).css("width").replace("px", ""));
    resize = direction;
    target = frame;
    $(target).addClass("move");
}

function hideFrame(frame) {
    $(frame).addClass("hideFrame");
    setTimeout(function(){if($(frame).hasClass("hideFrame"))$(frame).hide()}, 200);
    refreshAllGrids();
}

function showFrame(frame) {
    if($(frame).is(":hidden")) {
        $(frame).show();
        setTimeout(function(){$(frame).removeClass("hideFrame")}, 50);
    }
    refreshAllGrids();
}

function getNextLayerFrame(limit) {
    var target = false,
        index = false,
        cap = (!limit)? 999999 : limit;

    $(".iFrame").each(function () {
        if($(this).css("z-index") > index && $(this).css("z-index") < cap && $(this).is(":visible")) {
            index = $(this).css("z-index");
            target = this.id;
        }
    });
    return "."+target;
}

function clearResize() {
    $(target).removeClass("move");
    target = false;
    resize = false;
}

function newTaskbarItem(frameCount, type) {
    $('<div id="itemTask'+frameCount+'" class="itemFrame'+frameCount+' item floatLeft icon" ' +
            'onclick="showFrame($(\'#\'+this.classList[0]));toggleFocus(\'.\'+this.classList[0])" ' +
            'ondblclick="hideFrame($(\'#\'+this.classList[0]))" oncontextmenu="return showContextMenu(event, 3, this)">' +
            '<i class="icon-'+type+'"></i>' +
        '</div>').appendTo("#toolbar");
}

function removeFrame(element) {
    element = (typeof element == "string")? element : element.parentElement.parentElement;
    if(event.which == 1) {
        toggleFocus(getNextLayerFrame($(element).css("z-index")));
        $("."+element.classList[0]).fadeOut(200, function () {
            $("."+element.classList[0]).remove();
        });
    }
}

function removeFrameByTaskItem(element) {
    toggleFocus(getNextLayerFrame($(element).css("z-index")));
    $("."+element.classList[0]).fadeOut(200, function () {
        $("."+element.classList[0]).remove();
    });
}

function hideAllFrames() {
    $(".iFrame").each(function () {
        hideFrame(this);
    });
}

function showAllFrames() {
    $(".iFrame").each(function () {
        showFrame(this);
    });
}