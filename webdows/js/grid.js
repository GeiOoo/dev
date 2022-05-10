function getFolderGridConfig(elem) {
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
            {title:"Änderungsdatum", width:150, dataType:"string", dataIndx: "time"},
            {title:"Größe", width:150, dataType:"float", dataIndx: "size"},
            {title:"Typ", width:150, dataType:"string", dataIndx: "fileType"},
            {title:"type", hidden: true, dataIndx:"type"},
            {title:"typeShort", hidden: true, dataIndx:"fileTypeShort"},
            {title:"path", hidden: true, dataIndx:"path"},
            {title:"backStep", hidden: true, dataIndx:"backStep"}
        ],
        dataModel: {
            sortIndx: "name"
        },
        editable: false,
    };

    $(elem).find(".explorerGrid").pqGrid(obj);
}