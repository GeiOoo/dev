function newWorkspaceItem(type, text, extra) {
    if(!text) text = "";
    workspaceItemCount++;
    return $('<div id="'+type+workspaceItemCount+'" class="workSpaceItem'+type+workspaceItemCount+' workSpaceItem icon fixedWorkspaceItem" ' +
        'onclick="toggleFocus(this)" ondblclick="var item = newFrame(\''+type+'\', \''+text+'\', \''+extra+'\'); setFrameText(item, $(\'#\'+this.id+\' > workSpaceItemLabel\').text())" ' +
        'onmouseup="onFrameMoveUp(this)" onmousedown="onFrameMoveDown(this)" oncontextmenu="return showContextMenu(event, 2, this)">' +
        '<i class="icon-'+type+'"></i>' +
        '<textarea class="workSpaceItemLabel">'+text+'</textarea>'+
        '</div>').appendTo("#workspace");

}