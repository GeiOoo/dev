var t = false;
$(document).ready(function () {
	localStorage.clear();

	$("#newDragger").click(function () {
		$('<div class="square drag drop"></div>').appendTo("body").css({top: 50, left: 50, height: 50, width: 50}).dragger().trigger("mousedown").trigger("mouseup");
    });
});