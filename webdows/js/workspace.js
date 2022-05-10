function newWorkspaceItem(elems) {
    var elem = "";
    $.get("templates/workspaceItem.html", function (data) {
        elems.forEach(function (key) {
            elem = $(data).appendTo("#workspace");
            elem.find(".workSpaceItemLabel").text(key.name);
            elem.find(".icon").addClass("icon-"+key.type);
            elem.click(function (e) {
                toggleActiveWorkspaceItem(elem);
                e.stopPropagation();
                e.preventDefault();
            }).on("mousedown", workspaceItemStartDrag).dblclick( function (e) {
                newWindowItem({title: key.name, type: key.type});
                e.stopPropagation();
                e.preventDefault();
            });
        });
        placeItems();
    });
}

function toggleActiveWorkspaceItem(item) {
    $(".active").removeClass("active");
    $(item).addClass("active");
}

function placeItems() {
    var maxWidth = $(window).width(),
        itemWidth = $(".workSpaceItem").width()+10,
        maxColumns = parseInt(maxWidth / itemWidth) - 1,
        row = 0,
        column = 0;
    $(".workSpaceItem").each(function () {
        if(maxColumns < column) {
            row++;
            column = 0;
        }
        if(!$(this).hasClass("isDragging")) {
            $(this).css("transform", "translate("+(column*itemWidth+column)+"px,"+row*100+"px)");
        }
        column++;
    });
}

function workspaceItemStartDrag(e) {
    $(".isDragging").removeClass("isDragging");
    $(this).addClass("isDragging").data({
        mouseOffset: {
            left: e.clientX - $(this).position().left,
            top: e.clientY - $(this).position().top
        }
    });
    $(window).on("mousemove", function (eM) {
        workspaceItemOnDrag(eM)
    }).on("mouseup", workspaceItemEndDrag);
    toggleActiveWorkspaceItem(this);
}

function workspaceItemOnDrag(e) {
    var elem = $(".isDragging"),
        newX = e.clientX - elem.data("mouseOffset").left,
        newY = e.clientY - elem.data("mouseOffset").top;
    clearInterval(elem.data("timer"));
    elem.data("timer", setTimeout(function () {
        replaceItem(e);
    }, 150));
    elem.css("transform", "translate("+newX+"px,"+newY+"px)");
}

function workspaceItemEndDrag(e) {
    clearInterval($(".isDragging").data("timer"));
    replaceItem(e);
    $(".isDragging").removeClass("isDragging").removeData("mouseOffset");
    $(window).off("mousemove").off("mouseup");
    placeItems();
}

function replaceItem(e) {
    var row = parseInt((e.clientY) / 100),
        itemWidth = $(".workSpaceItem").width()+10,
        column = e.clientX / itemWidth,
        maxWidth = $(window).width(),
        maxColumns = parseInt(maxWidth / itemWidth) - 1,
        newPlace = ((maxColumns + 1) * row) + parseInt(column),
        elemIndex = Math.min(newPlace + 1, $(".workSpaceItem").length);
    if(elemIndex == $(".workSpaceItem").length) {
        $(".isDragging").insertAfter(".workSpaceItem:nth-child("+elemIndex+")");
    } else {
        $(".isDragging").insertBefore(".workSpaceItem:nth-child("+elemIndex+")");
    }
    $(".isDragging").insertAfter(".workSpaceItem:nth-child("+elemIndex+")");
    placeItems();
}

function loadWorkspaceData() {
    var items = [
        {
            name: "Explorer",
            type: "folder"
        }];
    newWorkspaceItem(items);
}