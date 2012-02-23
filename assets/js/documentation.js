var addIds = function(id) {
	hArray = ['h1', 'h2', 'h3'];
	for(var i in hArray){
		var h = hArray[i];
		var cur = 0;
		$("#"+id+" "+h).each(function(index){		
			this.id = this.parentNode.id+"_"+h+"_"+cur;
			cur++;
		});		
	}
}

var addAnchors = function(id) {
	hArray = ['h1', 'h2', 'h3'];
	for(var i in hArray){
		var h = hArray[i];
		$("#"+id+" "+h).each(function(index){		
			this.innerHTML += ("<a href='#"+this.id+"' class='scroll'/>")
		});		
	}
}

var setActive = function(id) {
	var skip = 0;
	$(".active").each(function(){
		if(this.id === id){
			skip = 1
		} 
		$("#"+this.id).removeClass('active');
		$("#"+this.id+"_ul").toggle();
	});
	if (!skip){
		$("#"+id).addClass('active');
		$("#"+id+"_ul").toggle();		
	}
}

var setNav = function(id) {
	var navId = id + "_nav";
	var count = -1;
	$("[id^="+id+"_]").each(function(index){
		var tmp = this.id.split("_");
		var i = tmp[0];
		var h = tmp[1];
		var n = tmp[2];
		if (h === "h1"){
			$("#sidebarnav").append("<li class='nav-h1'><a href='#"+this.id+"' class='scroll'>"+$.trim(this.innerHTML)+"</a></li>");
			$("#sidebarnav").append("<ul id='"+navId+"' class='nav nav-list'></ul>");	
		} else if (h === "h2") {
			count++;
			$("#"+navId).append("<li id='"+navId+"_"+count+"' class='nav-h2'><a href='#"+this.id+"' class='scroll'>"+$.trim(this.innerHTML)+"</a></li>");
			$("#"+navId).append("<ul id='"+navId+"_"+count+"_ul' class='nav nav-list'></ul>");						
		} else {
			$("#"+navId+"_"+count+"_ul").append("<li class='nav-h3'><a href='#"+this.id+"' class='scroll'>"+$.trim(this.innerHTML)+"</a></li>");
		}
	});
}

// fix main-content div's margin
var fixMainMargin = function(){
	$("#main-content").css("margin-left", $("#sidebar").width() + 40);	
}

var scrollEvent = function(event){
	//prevent the default action for the click event
	event.preventDefault();
	event.stopPropagation();
	
	//get the full url - like mysitecom/index.htm#home
	var full_url = this.href;

	//split the url by # and get the anchor target name - home in mysitecom/index.htm#home
	var parts = full_url.split("#");
	var trgt = parts[1];

	//get the top offset of the target anchor
	var target_offset = $("#"+trgt).offset();
	var target_top = target_offset.top - 40;

	var tmp = trgt.split("_");
	var i = tmp[0];
	var h = tmp[1];
	var n = tmp[2];
	if (h === "h2"){
		setActive(i+"_nav_"+n);			
		fixMainMargin();
	} else if (h === "h1"){
		$(".active").each(function(){
			$("#"+this.id).removeClass('active');
			$("#"+this.id+"_ul").toggle();
		});
	} 

	//goto that anchor by setting the body scroll top to anchor top
	$('html, body').animate({scrollTop:target_top}, 500);
};

var bindScoll = function(id){
	$("[href^=#"+id+"_h1]").click(scrollEvent);
	$("#"+id+"_nav > li > .scroll").click(scrollEvent);
	$("#"+id+"_nav > ul > li .scroll").click(scrollEvent);
}

var bindWaypoints = function(id){
	$("[id^="+id+"_h2]").waypoint(function(event, direction) {
		var tmp = this.id.split("_");
		var i = tmp[0];
		var h = tmp[1];
		var n = tmp[2];
		
		setActive(i+"_nav_"+n);
		event.stopPropagation();
	}, {
		onlyOnScroll : true,
		offset: -40
	});
}

$(document).ready(function() {
	// load and create html from markdown
	var converter = new Showdown.converter();
	var list = ['Shock.markdown', 'AWE.markdown'];
	
	$.each(list, function(index){
		var req = $.get("./markdown/"+list[index], function(data) {
			var id = list[index].replace(".", "");
			$("#main-content").append("<div id='"+id+"'>"+(converter.makeHtml(data))+"</div>");
			addIds(id);
			setNav(id);
			addAnchors(id);
			fixMainMargin();
			bindScoll(id);
			//bindWaypoints(id);
		}, "html");
		req.error(function(err) { console.log(err); });		
	});
	

});