$(initPage); // Main program entrance

function hoverHint($el,hint){
	$el.on("mouseenter pointerenter",e=>{
		const hintBar=$("#content-hint-bar");
		hintBar.text(hint);
		hintBar.css("opacity","0.6");
	});
	$el.on("mouseleave pointerleave",e=>{
		const hintBar=$("#content-hint-bar");
		hintBar.css("opacity","0");
	});
}

function arriving(){
	loadBackground($("body"),"./resources/main-bg.jpg").catch(()=>{});
	$(window).on("focus",e => {
		$("#page-mask").fadeOut(500);
	});
	return new Promise(res=>{
		$("#page-mask").fadeOut(500,res);
	});
}

function jumpTo(url){
	$("#page-mask").fadeIn(500,()=>{
		window.location.href=url;
	});
}

function initPage(){
	const $list=$("#content-list");
	if(!PAGE_ITEMS){
		throw new Error("PAGE_ITEMS not found. unable to load");
	}
	for(let i=0;i<PAGE_ITEMS.length;i++){
		const item=PAGE_ITEMS[i];
		const $el=$("<div>");
		$el.html(item.name);
		const $elHint=$("<div class='extra-hint'>").text(item.hint);
		$el.append($elHint);
		hoverHint($el,item.hint);
		$list.append($el);

		if(item.url){
			$el.click(e=>{
				jumpTo(item.url);
			});
		}
	}
	arriving();

	$(window).on("resize",e=>{
		const x=window.innerWidth;
		const y=window.innerHeight;
		onResize(x,y);
	});
	onResize(window.innerWidth,window.innerHeight); // kick at first
}

let nowStyle="";
function onResize(x,y){
	const $style=$("#page-style");
	const newStyleHREF=x>y?"./styles/main-style-wide.css":"./styles/main-style-thin.css";
	if(newStyleHREF!=nowStyle){ // update
		$style.attr("href",newStyleHREF);
		nowStyle=newStyleHREF;
	}
}