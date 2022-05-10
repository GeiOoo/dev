(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);
function resetItems(item) {
	item.children(".desktop-icon,.item,.task").each(function() {
		$(this).animate({"top":0,"left":0},200);
	});
}
$(document).ready(function(){
	$(window).blur(function(){
		removeActive();
	});
	$(document).on("contextmenu",function(e){
		if($(e.target).closest(".body.editor").length == 1) {
			$("#context-menu").removeClass("active");
			$(e.target).closest(".window").addClass("active");
		} else {
			return false;
		}
	});
	var presets;
	$.ajax({
	  url: "presets.json",
	  dataType: 'json',
	  async: false,
	  success: function(data) {
		presets = data;
	  }
	});
	function getTypeFor(needle) {
		if(needle.indexOf(".") != -1) needle = needle.substring(needle.lastIndexOf(".")+1);
		var names = Object.getOwnPropertyNames(presets.types);
		for(var i = 0;i < Object.keys(presets.types).length; i++) {
			for(var j = 0;j < presets.types[names[i]].length;j++) {
				if(presets.types[names[i]][j] == needle) return names[i];
			}
		}
		return "none";
	}
	function getAppFor(needle) {
		var names = Object.getOwnPropertyNames(presets.apps);
		for(var i = 0;i < Object.keys(presets.apps).length; i++) {
			for(var j = 0;j < presets.apps[names[i]].length;j++) {
				if(presets.apps[names[i]][j] == needle) return names[i];
			}
		}
		return "none";	
	}
	function getIconFor(needle) {
		if(presets.appproperties.hasOwnProperty(needle)) icon = presets.appproperties[needle].icon;
		else icon = "window";
		return icon;
	}
	function showDesktop() {
		$(".window").each(function() {
			$(this).children(".head, .body").animate({'opacity':0},200);
		});
	}
	function removeActive(not) {
		if(not != undefined && not != "" && not != null) $(".active:not("+not+")").removeClass("active");
		else $(".active").removeClass("active");
	}
	function newFile(type) {}	
	function open(type,path,name) {
		if(name == undefined) name="";
		if(type == "file")
		{
			if(path.lastIndexOf(".") >= 0) {
				var filetype = getTypeFor(name);
				var app = getAppFor(filetype);
				if(app == "none") {
					if(name.indexOf("youtube.com/") >=0 || name.indexOf("youtu.be") >= 0) app = "Player";
				}
			}
		} else if(type == "app") {
			var app = name;
			var name = "Unbenannt";
		} else if(type == "folder") {
			var app = "Ordner";
		}
		icon = getIconFor(app);
		if(app == "Linker") {
			$.get(path, function(data) {
				var link = data;
				open(type,link,link);
			});
			return false;
		}
		var view = "tiles";
		if($(".window.active").find(".foldercontent").length < 1 || app != "Ordner")
		{
			//$(".window.active,.desktop-icon.active,.task.active,#context-menu.active,#start-window.active").removeClass("active");
			removeActive();
			var newId = 1;
			while($("#window-"+newId).length == 1) newId++;
			$(".window-template > .new.window").clone().appendTo($("#screen")).addClass("active").attr("id","window-"+newId).css("zIndex",1000);
			var indentFactor = 1;
			for(var i = 1;i <= $(".window:not(.new)").length;i++)
			{
				if($("#window-"+i).css("top") == 50*indentFactor+"px" && $("#window-"+i).css("left") == 50*indentFactor+"px")
				{
					i = 0;
					indentFactor++;
				}
			}
			var left = 50*indentFactor;
			var top = 50*indentFactor;
			var width = 500;
			var height = 300;
			$("#screen > .window.active").removeClass("new").css({"left":left,"top":top,"width":width}).data("spos",left+","+top+","+width+","+height).children(".body").css("height",height);
			$("#screen > .window.active").css("transform","scale(0.9)");
			$("#taskbar .tasks").append('<div class="task icon-'+icon+' active" id="task-'+newId+'"></div>');
			window.setTimeout(function() { $("#screen > .window.active").css({"transform":"scale(1)","opacity":1});},150);
		} else {
			var view = $(".window.active").find(".foldercontent").attr("class").split(" ")[1];
		}
		if(app == "Bildanzeige") {
			$("#screen > .window.active").find(".symbol").addClass("icon-picture").after(" <b>"+name+"</b> - "+app);
			if(type == "app") $("#screen > .window.active > .body").addClass("image").append('<div class="fullimage">Kein Bild ge&ouml;ffnet</div>');
			else $("#screen > .window.active > .body").addClass("image").append('<img src="'+path+'" class="fullimage" />');
		} else if(app == "Player") {
			$("#screen > .window.active").find(".symbol").addClass("icon-play-circle2").after(" <b>"+name+"</b> - "+app);
			if(type == "app") $("#screen > .window.active > .body").addClass("player").append('<div id="player">Keine Mediendatei ge&ouml;ffnet</div>');
			else {
				$("#screen > .window.active > .body").addClass("player").append('<div id="player-'+newId+'"></div>');
				    jwplayer("player-"+newId).setup({
					file: path,
					autostart: true,
					width:'100%',
					height:'100%',
					volume:'50'
					//image: "/uploads/myPoster.jpg"
				});
			}
		} else if(app == "Editor") {
			$("#screen > .window.active > .body").addClass("editor").attr("contentEditable",true).css("padding","5px");
			$("#screen > .window.active").find(".symbol").addClass("icon-pencil-squared").after(" <b>"+name+"</b> - "+app);
			if(type == "file") $("#screen > .window.active > .body").empty().load(path);
		} else if(app == "Ordner") {
			$("#screen > .window.active > .head").find(".symbol").addClass("icon-folder").end().contents().eq(2)[0].textContent=" "+path;
			$("#screen > .window.active > .body").empty().load("FolderData.php?path="+path+"&view="+view);
		} else {
			$("#screen > .window.active > .body")/*.css({"background-color":"transparent","border":"0","box-shadow":"none"})*/.html("<p style='text-align:center;'>Datei konnte nicht ge&ouml;ffnet werden:<br />Dateipfad: "+path+"<br />Dateiname: "+name+"</p>");
			$("#screen > .window.active").find(".symbol").addClass("icon-window").after(" "+name);
		}		
	}
	function startMove(relMouseX,relMouseY,stickyRadius,moveX,moveY,parent) {
		if(parent == undefined) parent = false;
		var once = false;
		var lock = 0;
		$('#screen').on('mousemove', function(e) {
			if($(".moving").length < 1 || $(".moving").hasClass("resizing")) return false;
			var offset = $(".moving").offset();
			var thisX = e.pageX-relMouseX;
			var thisY = e.pageY-relMouseY;
			if(parent == true)
			{
				//console.log($(".moving").parent().offset().left+ " > "+offset.left+" / "+$(".moving").parent().offset().top+" > "+offset.top);
				if($(".moving").parent().offset().left > offset.left) lock = 1;
				if($(".moving").parent().offset().top > offset.top) lock = 2;
				if(($(".moving").parent().offset().left+ $(".moving").parent().width()) < (offset.left+$(".moving").width())) lock = 3;
				if(($(".moving").parent().offset().top+ $(".moving").parent().height()) < (offset.top+$(".moving").outerHeight())) lock = 4;
				//console.log(($(".moving").parent().offset().left+ $(".moving").parent().width())+" < "+(offset.left+$(".moving").width()+" / "+
				//			($(".moving").parent().offset().top+ $(".moving").parent().height())+" < "+(offset.top+$(".moving").outerHeight())));
			}
			if(stickyRadius > 0 && once == false)
			{
				if((Math.abs(e.pageX-(relMouseX+offset.left)) > stickyRadius) || (Math.abs((relMouseY+offset.top)-e.pageY) > stickyRadius))
				{
						once = true;
						if($(".moving").hasClass("maximized")) {
							$(".moving").find(".maximize").trigger("click");
							relMouseX = $(".moving").outerWidth()/2;
						}
				}
			} else if(lock < 1) {
					if(moveX == true && moveY == true)
					{
						$('.moving').offset({
							left: thisX,
							top: thisY
						});
					} else if(moveX == false && moveY == true)
					{
						$('.moving').offset({
							top: thisY
						});
					} else {
						$('.moving').offset({
							left: thisX
						});
					}
			} else {
				if(lock == 1) {
					$(".moving").offset({left:$(".moving").parent().offset().left});
				} else if(lock == 2) {
					$(".moving").offset({top:$(".moving").parent().offset().top});
				} else if(lock == 3) {
					$(".moving").offset({left:($(".moving").parent().offset().left+ $(".moving").parent().width()-$(".moving").width())});
				} else if(lock == 4) {
					$(".moving").offset({top:($(".moving").parent().offset().top+ $(".moving").parent().height()-$(".moving").outerHeight())});
				}
				lock = 0;
			}
		});
		
	}
	function StartMouseSelection(x,y,pe) {
		if(pe.children(".selection").length < 1) pe.append('<div class="selection hidden"></div>');
		pe.on('mousemove', function(e) {
			var diffx = e.pageX - x;
			var diffy = e.pageY - y;
			if(diffx > 0) {
				if(diffy > 0) pe.children(".selection").removeClass("hidden").offset({left:x,top:y}).width(diffx).css("height",e.pageY-y);
				else pe.children(".selection").removeClass("hidden").offset({left:x,top:e.pageY}).width(diffx).css("height",y-e.pageY);
			}
			else {
				if(diffy > 0) pe.children(".selection").removeClass("hidden").offset({left:e.pageX,top:y}).width(x-e.pageX).css("height",e.pageY-y);
				else pe.children(".selection").removeClass("hidden").offset({left:e.pageX,top:e.pageY}).width(x-e.pageX).css("height",y-e.pageY);
			}
		});
	}
	function startWindowResize(dir,resizeX,resizeY) {
		$('#screen').on('mousemove', function(e) {
			if($(".resizing").length < 1 || $(".resizing").hasClass("moving")) return false;
 			if(dir == "b") {
				$(".resizing > .body").height($(".resizing > .body").height()+(e.pageY-resizeY));
				resizeY = e.pageY;
			}
			if(dir == "t") {
				$(".resizing > .body").height($(".resizing > .body").height()-(e.pageY-resizeY));
				var offset = $(".resizing").offset();
				$(".resizing").offset({top:offset.top+(e.pageY-resizeY)});
				resizeY = e.pageY;
			}
			if(dir == "l") {
				$(".resizing").width($(".resizing").width()-(e.pageX-resizeX));
				var offset = $(".resizing").offset();
				$(".resizing").offset({left:offset.left+(e.pageX-resizeX)});
				resizeX = e.pageX;
			}
 			if(dir == "r") {
				$(".resizing").width($(".resizing").width()+(e.pageX-resizeX));
				resizeX = e.pageX;
			}
		});
	}
	function startTaskbarResize(elem,startx) {
		$('#screen').on('mousemove', function(e) {
			x = e.pageX-startx;
			elem.prev().width(elem.prev().width()+x);
			startx = e.pageX;
		});
	}
	function updateSpos() {
		$(".window.active").data("spos",$(".window.active").offset().left+","+$(".window.active").offset().top+","+$(".window.active").outerWidth()+","+$(".window.active").children(".body").outerHeight());
		console.log("data-spos: "+$(".window.active").data("spos"));
	}
	function NumSort (a, b) {
	  return a - b;
	}
	$("body").on('mousedown',function(e) {
		$('<div contenteditable="true"></div>').appendTo('body').focus().remove();
		if(e.button == 2) {
			if(e.target.id=="screen") {
				removeActive();
				$("#context-menu").empty().addClass("active");
				$("#context-menu").offset({left:e.pageX,top:e.pageY});
				contextelem = $("#screen");
				$("#context-menu").append('<p><a class="disabled">&copy; 2013 by Basti</a><a href="http://epic-clan.de" target="_blank">Besuche epic-clan.de</a></p><p><a onclick="resetItems(contextelem);">Symbole ordnen</a></p>');
			} else {
				$("#context-menu").removeClass("active");
				var elem = $("#window-"+e.target.id.split("-")[1]);
				elem.addClass("active");
				elem.trigger("click");
			}
		} else {
			if($(e.target).closest("#context-menu").length != 1) {
				$("#context-menu").removeClass("active");
			}
			if(e.target.id=="screen" || $(e.target).hasClass("foldercontent")) {
				var parentelem = $(e.target);
				removeActive();
				e.originalEvent.preventDefault();
				StartMouseSelection(e.pageX,e.pageY,parentelem);
			} 
		}
		if($(e.target).closest(".window").length == 1)
		{	
				if(!$(e.target).closest(".window").hasClass("active"))
				{
					removeActive("#context-menu");
					$(e.target).closest(".window").addClass("active");
					$("#task-"+$(e.target).closest(".window").attr("id").split("-")[1]).addClass("active");
					var highestIndex = 0;
					$(".window:not(.new, .minimized)").each(function() {
						if(parseInt($(this).css("zIndex")) > highestIndex) highestIndex = parseInt($(this).css("zIndex"));
						$(this).css("zIndex",(parseInt($(this).css("zIndex"))-1));
					});
					$(e.target).closest(".window").css("zIndex",(highestIndex));
				}
		} 
		
	}).on('mouseup', function() {
			if($(".window.moving:not(.maximized)").length == 1 || $(".window.resizing").length == 1) updateSpos();
			$(".moving").removeClass('moving');
			$(".resizing").removeClass("resizing");
			$(".selection").addClass("hidden");
			$("*").off('mousemove');
	}).on('mousedown',".open-icon", function(e) {
			contextelem.trigger("dblclick");
	}).on('mousedown',".remove-icon", function(e) {
			contextelem.remove();
	}).on('mousedown',".window > .b-resize", function(e) {
		e.originalEvent.preventDefault();
		if(!$(this).parent().hasClass("maximized")) {
			$(this).parent().addClass("resizing");
			startWindowResize("b",e.pageX,e.pageY);
		}
	}).on('mousedown',".window > .t-resize", function(e) {
		e.originalEvent.preventDefault();
		if(!$(this).parent().hasClass("maximized")) {
			$(this).parent().addClass("resizing");
			startWindowResize("t",e.pageX,e.pageY);
		}
	}).on('mousedown',".window > .l-resize", function(e) {
		e.originalEvent.preventDefault();
		if(!$(this).parent().hasClass("maximized")) {
			$(this).parent().addClass("resizing");
			startWindowResize("l",e.pageX,e.pageY);
		}
	}).on('mousedown',".window > .r-resize", function(e) {
		e.originalEvent.preventDefault();
		if(!$(this).parent().hasClass("maximized")) {
			$(this).parent().addClass("resizing");
			startWindowResize("r",e.pageX,e.pageY);
		}
	}).on('mousedown',".window > .lt-resize", function(e) {
		e.originalEvent.preventDefault();
		if(!$(this).parent().hasClass("maximized")) {
			$(this).parent().addClass("resizing");
			startWindowResize("l",e.pageX,e.pageY);
			startWindowResize("t",e.pageX,e.pageY);
		}
	}).on('mousedown',".window > .rt-resize", function(e) {
		e.originalEvent.preventDefault();
		if(!$(this).parent().hasClass("maximized")) {
			$(this).parent().addClass("resizing");
			startWindowResize("r",e.pageX,e.pageY);
			startWindowResize("t",e.pageX,e.pageY);
		}
	}).on('mousedown',".window > .lb-resize", function(e) {
		e.originalEvent.preventDefault();
		if(!$(this).parent().hasClass("maximized")) {
			$(this).parent().addClass("resizing");
			startWindowResize("l",e.pageX,e.pageY);
			startWindowResize("b",e.pageX,e.pageY);
		}
	}).on('mousedown',".window > .rb-resize", function(e) {
		e.originalEvent.preventDefault();
		if(!$(this).parent().hasClass("maximized")) {
			$(this).parent().addClass("resizing");
			startWindowResize("r",e.pageX,e.pageY);
			startWindowResize("b",e.pageX,e.pageY);
		}
	}).on('mousedown',".window > .head", function(e) {
		e.originalEvent.preventDefault();
		if($(e.target).closest(".controls").length < 1 && e.button != 2)
		{
			if(!$(e.target).parent().hasClass("maximized"))
			{
				$(this).parent().addClass('moving');
				var offset = $(this).parent().offset();
				var relMouseX = e.pageX - offset.left;
				var relMouseY = e.pageY - offset.top;
				startMove(relMouseX,relMouseY,3,true,true);
			} else {
				$(this).parent().addClass('moving');
				var offset = $(this).parent().offset();
				var relMouseX = e.pageX - offset.left;
				var relMouseY = e.pageY - offset.top;
				startMove(relMouseX,relMouseY,10,true,true);				
			}
		}
	}).on("mouseup",".window > .head", function(e) {
		if($(e.target).hasClass("head") && e.button == 2) {
			$("#context-menu").addClass("active").empty();
			$("#context-menu").offset({left:e.pageX,top:e.pageY});
			contextelem = $(e.target).closest(".window");
			$('<p><a onclick="contextelem.find(\'.minimize\').trigger(\'click\');">Minimieren</a><a onclick="contextelem.find(\'.maximize\').trigger(\'click\');">Maximieren</a></p><p><a onclick="contextelem.find(\'.close\').trigger(\'click\');">Schlie&szlig;en</a></p>').appendTo("#context-menu");
		}
	}).on("mousedown",".desktop-icon", function(e) {
		e.originalEvent.preventDefault();
		if(!$(e.target).hasClass("active")) removeActive();
		$(this).addClass('moving');
		var offset = $(this).offset();
		var relMouseX = e.pageX - offset.left;
		var relMouseY = e.pageY - offset.top;
		startMove(relMouseX,relMouseY,15,true,true);
	}).on("mouseup",".desktop-icon",function(e) {
		if(e.button == 2) {
			removeActive();
			$("#context-menu").addClass("active").empty();
			$("#context-menu").offset({left:e.pageX,top:e.pageY});
			contextelem = $(this);
			var app = getAppFor(getTypeFor(contextelem.data("name")));
			if(app == "none") app = ""; else app = " ("+app+")";
			$("#context-menu").append('<p><a onclick="contextelem.trigger(\'dblclick\');"><b>&Ouml;ffnen</b>'+app+'</a><a onclick="contextelem.remove();">Ausblenden</a></p>');
		} 
		$(this).toggleClass("active");
		$(this).disableSelection();
	}).on("mousedown",".foldercontent", function(e) {
		e.originalEvent.preventDefault();
		$(".foldercontent > .item.subactive").removeClass("subactive");
		if($(e.target).closest(".item").length == 1) $(e.target).closest(".item").addClass("subactive");
	}).on("mouseup",".foldercontent", function(e) {
		if(e.button == 2) {
			$(".desktop-icon.active,#context-menu.active,#start-window.active").removeClass("active");
			$("#context-menu").addClass("active").empty();
			$("#context-menu").offset({left:e.pageX,top:e.pageY});
			if($(e.target).closest(".item").length == 1) {
				contextelem = $(e.target).closest(".item");
				var app = getAppFor(getTypeFor(contextelem.data("name")));
				console.log(getTypeFor(contextelem.data("name")));
				if(app == "none") app = ""; else app = " ("+app+")";
				$("#context-menu").append('<p><a onclick="contextelem.trigger(\'dblclick\');"><b>&Ouml;ffnen</b>'+app+'</a><a onclick="contextelem.remove();">Ausblenden</a></p>');
			} else {
				contextelem = $(e.target);
				$("#context-menu").append('<p><a class="sub 1">Ansicht</a><a onclick="contextelem.closest(\'.window\').find(\'.close\').trigger(\'click\');">Schlie&szlig;en</a></p>');			
				$("#context-menu").append('<div class="submenu 1"><p><a onclick="contextelem.removeClass(\'tiles\').addClass(\'list\');">Liste</a><a onclick="contextelem.removeClass(\'list\').addClass(\'tiles\');">Kacheln</a></p></div>');
			}
		}
	}).on("dblclick",".window > .head", function(e) {
		if($(e.target).hasClass("head")) $(this).children(".controls").children(".maximize").trigger("click");
	}).on("click",".window > .head > .controls > .maximize",function() {
		var elem = $(this).closest(".window");
		if(elem.hasClass("maximized")) {
			elem.find(".maximize").removeClass("icon-popup").addClass("icon-stop-outline");
			var eleft = elem.data("spos").split(",")[0];
			var etop = elem.data("spos").split(",")[1];
			var ewidth = elem.data("spos").split(",")[2];
			var eheight = elem.data("spos").split(",")[3];
			elem.removeClass("maximized").css({"left":eleft+"px","top":etop+"px","right":"","width":ewidth+"px"}).children(".body").outerHeight(eheight);
		} else {
			elem.find(".maximize").removeClass("icon-stop-outline").addClass("icon-popup");
			elem.addClass("maximized").css({"left":"-7px","top":"-2px","right":"-7px","width":""});
			var offset = elem.children(".body").offset();
			elem.children(".body").outerHeight(document.body.offsetHeight-$("#taskbar").height()-32);
		}
	}).on("click",".window > .head > .controls > .minimize",function() {
		var elem = $(this).closest(".window");
		elem.children(".body").css("opacity",0);
		elem.animate({width:50,height:50,left:$("#task-"+elem.attr("id").split("-")[1]).offset().left,top:$("#task-"+elem.attr("id").split("-")[1]).offset().top,opacity:0},200,function() {
			elem.addClass("minimized");
			$("#task-"+elem.attr("id").split("-")[1]).removeClass("active");
		});
	}).on("click",".window > .head > .controls > .close",function() {
		var elem = $(this).closest(".window");
		elem.css({"transform":"scale(0.9)","opacity":0});
		window.setTimeout(function() { $("#task-"+elem.attr("id").split("-")[1]).remove(); elem.remove(); },150);
		if($(".window:not(.new)").length > 0)
		{
			var highest = 0;
			var id = 0;
			$(".window:not(.new, .minimized)").each(function(index) {
				if(parseInt($(this).css("zIndex")) > highest) {
					highest = parseInt($(this).css("zIndex"));
					id = $(this).attr("id");
				}
			});
			$("#"+id).addClass("active");
			$("#task-"+id.split("-")[1]).addClass("active");
		}
		
	}).on("click",".address .submit",function() {
		$(this).closest(".window").find("iframe").attr('src',$(this).parent().children(".addresstext").val());
	}).on("dblclick",".desktop-icon, .item",function(e) {
		//e.originalEvent.preventDefault();
		if($(this).hasClass('app')) var type = "app";
		else if($(this).hasClass('file')) var type = "file";
		else if($(this).hasClass('folder')) var type = "folder";
		var path = $(this).data("path");
		var name = $(this).data("name");
		open(type,path,name);
	}).on("mouseup","#taskbar .start",function(e) {
		$(this).disableSelection();
		/*$(".window.active,.desktop-icon.active,.task.active").not(this).removeClass("active");*/
		removeActive("#taskbar .start,#start-window");
		$(this).toggleClass("active");
		$("#start-window").toggleClass("active");
	}).on("mouseover","#taskbar .show-desktop",function(e) {
		showDesktopTO = window.setTimeout(showDesktop, 500);
	}).on("mouseout","#taskbar .show-desktop",function(e) {
		$(".window").each(function() {
			window.clearTimeout(showDesktopTO);
			$(this).children(".head, .body").animate({'opacity':1},200);
		});
	}).on("click","#context-menu p a", function(e) {
		if(!$(this).hasClass("disabled") && !$(this).hasClass("sub")) $("#context-menu").removeClass("active");
	}).on("mousedown","#context-menu p a", function(e) {
		e.originalEvent.preventDefault();
	}).on("mouseenter","#context-menu p a", function() {
		if($(this).hasClass("sub")) {
			$(this).addClass("hover");
			$("#context-menu .submenu."+$(this).attr('class').split(' ')[1]).addClass("active").css({"left":$("#context-menu").outerWidth()-5,"top":-$("#content-menu").height()-1});
		}
		else if($(this).closest(".submenu").length < 1) {
			$("#context-menu p a").removeClass("hover");
			$("#context-menu .submenu").removeClass("active");
		}
	}).on("mousedown","#taskbar .tasks > .task", function(e) {
		e.originalEvent.preventDefault();
		$(this).addClass('moving');
		var offset = $(this).offset();
		var relMouseX = e.pageX - offset.left;
		var relMouseY = e.pageY - offset.top;
		startMove(relMouseX,0,40,true,false,true);
	}).on("mouseup","#taskbar .tasks > .task", function(e) {
		var elem = $("#window-"+$(this).attr("id").split("-")[1]);
		if(e.button == 2) {
			$("#context-menu").empty();
			contextelem = $("#window-"+e.target.id.split("-")[1]);
			$('<p><a onclick="contextelem.find(\'.minimize\').trigger(\'click\');">Minimieren</a><a onclick="contextelem.find(\'.maximize\').trigger(\'click\');">Maximieren</a></p><p><a onclick="contextelem.find(\'.close\').trigger(\'click\');">Schlie&szlig;en</a></p>').appendTo("#context-menu");
			$("#context-menu").addClass("active").offset({left:e.pageX,top:e.pageY-$("#context-menu").outerHeight()});
		} else {
			if(elem.hasClass("minimized")) {
				if(elem.hasClass("maximized"))
				{
					var offset = elem.children(".body").offset();
					var eleft = -7;
					var etop = -2;
					var ewidth = "";
					var eheight = document.body.offsetHeight-$("#taskbar").height()-32;
					elem.css({"display":"block","height":"","width":""}).animate({"opacity":1,"left":eleft,"top":etop},200);
				} else {
					var eleft = elem.data("spos").split(",")[0];
					var etop = elem.data("spos").split(",")[1];
					var ewidth = elem.data("spos").split(",")[2];
					var eheight = elem.data("spos").split(",")[3];
					elem.css({"display":"block","height":""}).animate({"opacity":1,"width":ewidth,"left":eleft,"top":etop},200);
				}
				elem.children(".body").animate({"opacity":1,"height":eheight+"px"},200, function() {
					if(elem.hasClass("maximized")) elem.css("right","-7px");
					elem.removeClass("minimized");
				});
				$(this).addClass("active");
			} else if(elem.hasClass("active"))
			{
				elem.find(".minimize").trigger("click");
			} else {
				elem.trigger("mousedown");
				$(this).addClass("active");
			}
		}
	}).on("mousedown","#taskbar .tasks", function(e) {
			removeActive();
	}).on("mouseup","#taskbar .tasks", function(e) {
		if(e.button == 2 && $(e.target).hasClass("tasks")) {
			removeActive();
			$("#context-menu").empty().addClass("active");
			contextelem = $(this);
			$("#context-menu").append('<p><a onclick="resetItems(contextelem);">Tasks ordnen</a></p>');
			$("#context-menu").offset({left:e.pageX,top:e.pageY-$("#context-menu").outerHeight()});
		}
	}).on("mouseup","img:not(.thumb)", function(e) {
		if(e.button == 2) {
				$("#context-menu").addClass("active").empty();
				$("#context-menu").offset({left:e.pageX,top:e.pageY});
				$('<p><a onclick="$(\'#screen\').css(\'background-image\',\'url('+$(e.target).attr('src')+')\')">Als Hintergrund einrichten</p>').appendTo("#context-menu");
		}				
	}).on("mousedown","#taskbar .spacer", function(e) {
		e.originalEvent.preventDefault();
		startTaskbarResize($(e.target).closest("td"),e.pageX);
	});
	
	$(window).keydown(function(e) {
		switch(e.keyCode) {
			case 9:	
				e.preventDefault();
				var lowestIndex = 1001;
				$(".window:not(.new, .minimized)").each(function() {
					if(parseInt($(this).css("zIndex")) < lowestIndex) lowestIndex = parseInt($(this).css("zIndex"));
				});
				$(".window:not(.minimized,.new)").each(function() {
					if(parseInt($(this).css("zIndex")) == lowestIndex) {
						removeActive();
						/*$(".window:not(.minimized,.new)").each(function() { $(this).css("zIndex",parseInt($(this).css("zIndex"))-1); });
						$(this).css("zIndex",1000);*/
						$(this).trigger("mousedown");
						return false;
					}
				});
			break;
			/*case 91:
			case 219: $("#taskbar .start").trigger("mouseup");
			break;*/
		}
		if(e.ctrlKey) $("#taskbar .start").trigger("mouseup");
	});
	
});