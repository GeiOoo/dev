function updateFileName(recordData) {
    var data = {
        action: "renameFile",
        path: recordData.rowData.path,
        oldName: recordData.oldVal,
        newName: recordData.newVal,
        ending: recordData.rowData.type
    };

    $.ajax({
        url: 'php/handleAjax.php',
        type: 'POST',
        data: data,
        cache: false
    }).done(function () {
        refreshAllGrids();
    }).fail(function () {
        alert("Umbenennen fehlgeschlagen!")
    });
}

function showUploadForm() {
    var element = $('' +
        '<form enctype="multipart/form-data">' +
            '<input type="file" id="fileUpload" hidden onchange="uploadFile(this)">' +
        '</form>' +
    '').appendTo(".iFrameContent");
    element[0][0].click();
}

function uploadFile(element) {
    var data = new FormData(),
        files = element.files;

    data.append('file', files[0]);
    data.append('path', $(getNextLayerFrame(layer+3)+" > .iFrameContent > #grid_array").pqGrid("getRowData", {rowIndxPage: 0}).path);
    data.append('action', "uploadFile");

    $.ajax({
        url: 'php/handleAjax.php',
        type: 'POST',
        data: data,
        cache: false,
        processData: false,
        contentType: false
    }).done(function (respons) {
        switch (respons) {
            case "fileExist": alert("Upload fehlgeschlagen, Datei existiert bereits!");break;
            default: refreshAllGrids();
        }
    }).fail(function () {
        console.log("File Upload failed");
    });
}

function getFolderContent(param, target) {
    var url = "php/handleAjax.php";
    param.action = "folderContent";
    $.ajax({
        url: url,
        data: param,
        type: "POST"
    }).done(function(data) {
        data = $.parseJSON(data);
        $(target+" > .iFrameContent > #grid_array").pqGrid("option", "dataModel.data", data).pqGrid("refreshDataAndView");
    }).fail(function () {
        console.log(arguments[2])
    })
}

function getTrashContent(param, target) {
    var url = "php/ptest/handleAjaxTest.php";
    param.action = "trashContent";
    $.ajax({
        url: url,
        data: param,
        type: "POST"
    }).done(function(data) {
        data = $.parseJSON(data);
        $(target+" > .iFrameContent > #grid_array").pqGrid("option", "dataModel.data", data).pqGrid("refreshDataAndView");
    }).fail(function () {
        console.log(arguments[2])
    })
}

function createFolder() {
    var url = "php/handleAjax.php",
        param = {
            path: $(getNextLayerFrame(layer+3)+" > .iFrameContent > #grid_array").pqGrid("getRowData", {rowIndxPage: 0}).path,
            action: "createFolder"
        };
    $.ajax({
        url: url,
        data: param,
        type: "POST"
    }).done(function () {
        refreshAllGrids();
    }).fail(function () {
        console.log(arguments[2])
    });
}

function pDeleteFile(path) {
    var url = "php/handleAjax.php",
        param = {
            path: path,
            action: "pDeleteFile"
        };
    $.ajax({
        url: url,
        data: param,
        type: "POST"
    }).done(function () {
        refreshAllGrids();
    }).fail(function () {
        console.log(arguments[2])
    });
}

function downloadFile(path, name, type) {
    if(type != "folder") {
        var url = "php/handleAjax.php",
            param = {
                path: path,
                action: "downloadFile"
            };
        $.ajax({
            url: url,
            data: param,
            type: "POST"
        }).done(function (path) {
            $('<a id="downloadLink" href="'+path+'" download="'+name+'" target="_blank">'+name+'</a>').appendTo("body").get(0).click();
            setTimeout(function () {
                $("#downloadLink").remove();
            }, 100)
        }).fail(function () {
            console.log(arguments[2])
        });
    }
}

function openExternal(path) {
    window.open("/php/data"+path,'_blank');
}

function deleteFile(name, ts) {
    var url = "php/handleAjax.php",
        param = {
            name: name,
            ts: ts,
            action: "deleteFile"
        };
    $.ajax({
        url: url,
        data: param,
        type: "POST"
    }).done(function () {
        refreshAllGrids();
    }).fail(function () {
        console.log(arguments[2])
    });
}

function refreshFolder(folder) {
    var url = "php/handleAjax.php",
        param = {
            action: "folderContent",
            path: $(folder).pqGrid("getRowData", {rowIndxPage: 0}).path
        };
    $.ajax({
        url: url,
        data: param,
        type: "POST"
    }).done(function(data) {
        data = $.parseJSON(data);
        $(folder).pqGrid("option", "dataModel.data", data).pqGrid("refreshDataAndView");
    }).fail(function () {
        console.log(arguments[2])
    });
}

function refreshAllGrids() {
    var folders = $(".folderGrid");
    var trashes = $(".trashGrid");

    $(folders).each(function (index, element) {
        refreshFolder(element)
    });
    $(trashes).each(function (index, element) {
        getTrashContent({}, "."+element.parentElement.parentElement.id)
    })
}

function recoverFile(name, ts) {
    var data = {
        action: "recovery",
        name: name,
        ts: ts
    };

    $.ajax({
        url: "php/handleAjax.php",
        data: data,
        type: "POST"
    }).done(function() {
        refreshAllGrids();
    }).fail(function () {
        console.log(arguments[2])
    })
}

function setFolderGridConfig(target) {
    var obj = {
        width: "99%",
        flexWidth: true,
        height: "99%",
        flexHeight: true,
        showToolbar: false,
        showTop: false,
        showBottom: false,
        numberCell: {
            show: false
        },
        colModel: [
            {title:"", width: 50, dataIndx: "backStepP", cls: "backStep"},
            {title:"Name", width:150, dataType:"string", dataIndx: "name"},
            {title:"Änderungsdatum", width:150, dataType:"string", align: "center", dataIndx: "time"},
            {title:"Größe", width:150, dataType:"float", align:"right", dataIndx: "size"},
            {title:"Typ", width:150, dataType:"string", align:"right", dataIndx: "fileType"},
            {title:"type", hidden: true, dataIndx:"type"},
            {title:"typeShort", hidden: true, dataIndx:"fileTypeShort"},
            {title:"path", hidden: true, dataIndx:"path"},
            {title:"backStep", hidden: true, dataIndx:"backStep"}
        ],
        dataModel: {
            sortIndx: "name"
        },
        editable: false,
        beforeSort: function (e, targetCell) {
            if(targetCell.dataIndx == "backStepP") {
                getFolderContent({"backStep": true, "path": targetCell.dataModel.data[0].path}, target);
                return false;
            }
        },
        rowDblClick: function (e, targetRow) {
            switch(targetRow.rowData.fileTypeShort) {
                case "folder": getFolderContent({"path": targetRow.rowData.path+targetRow.rowData.name+targetRow.rowData.type+"/"}, target);break;
                case "pic":
                    newFrame("pic", targetRow.rowData.name, targetRow.rowData.path+targetRow.rowData.name+targetRow.rowData.type);
                    break;
                case "vid":
                    newFrame("vid", targetRow.rowData.name, targetRow.rowData.path+targetRow.rowData.name+targetRow.rowData.type);
                    jwplayer("player-"+(layer-1)).setup({
                        file: window.location.href+'php/data'+targetRow.rowData.path+targetRow.rowData.name+targetRow.rowData.type,
                        autostart: true,
                        width:'100%',
                        height:'100%',
                        volume: 30
                    });
                    break;
                case "audio": showAudioPlayer(targetRow.rowData.name+targetRow.rowData.type, targetRow.rowData.path+targetRow.rowData.name+targetRow.rowData.type, targetRow.rowData.type.substr(1, targetRow.rowData.type.length-1));break;
                case "pdf": newFrame("pdf", targetRow.rowData.name, targetRow.rowData.path+targetRow.rowData.name+targetRow.rowData.type);break;
                case "archive": downloadFile(targetRow.rowData.path+targetRow.rowData.name+targetRow.rowData.type, targetRow.rowData.name+targetRow.rowData.type, "archive");break;

            }
        },
        beforeTableView: function (e, grid) {
            for(var x = 0; x <= grid.finalV; x++) {
                $(target+" > .iFrameContent > #grid_array").pqGrid("addClass", {rowIndx: x, dataIndx: 'name', cls: "pq-icon-"+grid.pageData[x].fileTypeShort});
            }
        },
        rowRightClick: function (e, targetRow) {
            return showContextMenu(e, 5, targetRow)
        },
        cellSave: function (e, ui) {
            updateFileName(ui);
        }
    };

    $(target+" > .iFrameContent > #grid_array").pqGrid(obj);
}

function setTrashGridConfig(target) {
    var obj = {
        width: "99%",
        flexWidth: true,
        height: "99%",
        flexHeight: true,
        showToolbar: false,
        showTop: false,
        showBottom: false,
        numberCell: {
            show: false
        },
        colModel: [
            {title:"", width: 50, dataIndx: "backStepP", cls: "backStep"},
            {title:"Name", width:150, dataType:"string", dataIndx: "name", recIndx: "name"},
            {title:"Änderungsdatum", width:150, dataType:"string", align: "center",dataIndx: "time"},
            {title:"Größe", width:150, dataType:"float", align:"right", dataIndx: "size"},
            {title:"Typ", width:150, dataType:"string", align:"right", dataIndx: "fileType"},
            {title:"type", hidden: true, dataIndx:"type"},
            {title:"timestamp", hidden: true, dataIndx:"ts"},
            {title:"typeShort", hidden: true, dataIndx:"fileTypeShort"},
            {title:"path", hidden: true, dataIndx:"path"},
            {title:"backStep", hidden: true, dataIndx:"backStep"}
        ],
        dataModel: {
            sortIndx: "name"
        },
        editable: false,
        beforeSort: function (e, targetCell) {
            if(targetCell.dataIndx == "backStepP") {
                getTrashContent({"backStep": true, "path": targetCell.dataModel.data[0].path}, target);
                return false;
            }
        },
        beforeTableView: function (e, grid) {
            for(var x = 0; x <= grid.finalV; x++) {
                $(target+" > .iFrameContent > #grid_array").pqGrid("addClass", {rowIndx: x, dataIndx: 'name', cls: "pq-icon-"+grid.pageData[x].fileTypeShort});
            }
            if(!parseInt(grid.pageData[0].ts)) {
                grid.pageData[0].name = grid.pageData[0].ts+grid.pageData[0].name
            }
        },
        rowRightClick: function (e, targetRow) {
            return showContextMenu(e, 6, targetRow)
        }
    };

    $(target+" > .iFrameContent > #grid_array").pqGrid(obj);
}

function copyPath(path) {
    copyToClipboard("http://geiooo.de/php/data"+path);
}

function copyToClipboard(string) {
    var input = $("<input>").appendTo("body");
    input.val(string);
    input.select();
    document.execCommand("copy");
    input.remove();
}