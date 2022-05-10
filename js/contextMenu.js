function showContextMenu(e, option, frame) {
    destroyCMenu();
    setCMenuPos(e, $("" +
        "<div id='cMenu' class='cMenu'>" +
            getCMenuContent(option, frame)+
        "</div>" +
        "").appendTo("#mainFrame"));
    e.stopPropagation();
    return false;
}

function destroyCMenu() {
    if($("#cMenu").length) $("#cMenu").remove();
}

function setCMenuPos(e, element){
    var maxTop = parseInt($("#mainFrame").css("height").replace("px", ""))-parseInt($(element).css("height").replace("px", "")),
        maxLeft= parseInt($("#mainFrame").css("width").replace("px", ""))-parseInt($(element).css("width").replace("px", "")),
        setLeft = (e.pageX > maxLeft)? e.pageX-parseInt($(element).css("width").replace("px", "")) : e.pageX,
        setTop = (e.pageY > maxTop)? e.pageY-parseInt($(element).css("height").replace("px", "")) : e.pageY;

    $(element).css({
        top: setTop,
        left: setLeft
    });
}

function getCMenuContent(option, frame) {
    var tpl = "";
    switch(option) {
        case 1: tpl = "" +
            "<div class='cMenuItem icon' onmouseup='$(\"#home\").dblclick();'><i class='icon-arrows'></i><a class='cMenuItemLabel'>Icons Anordnen</a></div>"+
            "<div class='cMenuItem icon' onmouseup='rotateBg();'><i class='icon-picture'></i><a class='cMenuItemLabel'>Neues Wallpaper</a></div>"+
            "<div class='cMenuItem icon' onmouseup='hideAllFrames();'><i class='icon-triangle-down'></i><a class='cMenuItemLabel'>Alle Fenster minimieren</a></div>"+
            "";break;
        case 2: tpl = "" +
            "<div class='cMenuItem icon' onmouseup='$(\"#"+frame.id+"\").dblclick();'><i class='icon-open'></i><a class='cMenuItemLabel'>Öffnen</a></div>"+
            "<div class='cMenuItem icon' onmouseup='$(\"#"+frame.id+" .workSpaceItemLabel\").focus()'><i class='icon-rename'></i><a class='cMenuItemLabel'>Umbenennen</a></div>"+
            "<div class='cMenuItem icon' onmouseup='$(\"#"+frame.id+"\").remove();'><i class='icon-trash'></i><a class='cMenuItemLabel'>Löschen</a></div>"+
            "";break;
        case 3: tpl = "" +
            "<div class='cMenuItem icon'><i class='icon-open'></i><a class='cMenuItemLabel'>Öffnen</a></div>"+
            "<div class='cMenuItem icon'  onmouseup='removeFrameByTaskItem("+frame.classList[0]+");'><i class='icon-close'></i><a class='cMenuItemLabel'>Schließen</a></div>"+
            "";break;
        case 4: tpl = "" +
            "<div class='cMenuItem icon' onmouseup='createFolder();'><i class='icon-folder'></i><a class='cMenuItemLabel'>Neuer Ordner</a></div>"+
            "";break;
        case 5 : tpl = "" +
            "<div class='cMenuItem icon' onmouseup='$(\".pq-grid-row.pq-row-select\").dblclick();'><i class='icon-open'></i><a class='cMenuItemLabel'>Öffnen</a></div>"+
            "<div class='cMenuItem icon' onmouseup='pDeleteFile(\""+frame.rowData.path+frame.rowData.name+frame.rowData.type+"\")'><i class='icon-trash'></i><a class='cMenuItemLabel'>Löschen</a></div>"+
            "<div class='cMenuItem icon' onmouseup='downloadFile(\""+frame.rowData.path+frame.rowData.name+frame.rowData.type+"\", \""+frame.rowData.name+frame.rowData.type+"\", \""+frame.rowData.fileTypeShort+"\")'><i class='icon-download'></i><a class='cMenuItemLabel'>Download</a></div>"+
            "<div class='cMenuItem icon' onmouseup='openExternal(\""+frame.rowData.path+frame.rowData.name+frame.rowData.type+"\")'><i class='icon-external'></i><a class='cMenuItemLabel'>in neuem Fenster öffnen</a></div>"+
            "<div class='cMenuItem icon' onmouseup='copyPath(\""+frame.rowData.path+frame.rowData.name+frame.rowData.type+"\")'><i class='icon-clipboard'></i><a class='cMenuItemLabel'>In Zwischenablage kopieren</a></div>"+
            "<div class='cMenuItem icon' onmouseup='$(getNextLayerFrame()+\" > .iFrameContent > #grid_array\").pqGrid(\"editCell\", {rowIndx: "+frame.rowIndx+" , dataIndx: \"name\"});'><i class='icon-rename'></i><a class='cMenuItemLabel'>Umbenennen</a></div>"+
            "";break;
        case 6 : tpl = "" +
            "<div class='cMenuItem icon' onmouseup='recoverFile(\""+frame.rowData.name+frame.rowData.type+"\", \""+frame.rowData.ts+"\")'><i class='icon-undo'></i><a class='cMenuItemLabel'>Wiederherstellen</a></div>"+
            "<div class='cMenuItem icon' onmouseup='deleteFile(\""+frame.rowData.name+frame.rowData.type+"\", \""+frame.rowData.ts+"\")'><i class='icon-trash'></i><a class='cMenuItemLabel'>Löschen</a></div>"+
            "";break;
    }
    return tpl;
}