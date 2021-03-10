$(initPage); // Main program entrance

function arriving(){
	loadBackground($("body"),PAGE_BG||"./resources/main-bg.jpg").catch(()=>{
		// default image
		loadBackground($("body"),"./resources/main-bg.jpg");
	});
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
	arriving();

	if(!PAGE_TITLE){
		$("#title-text").text("Null");
		$("#content-list").addClass("error-block");
		$("#page-content").addClass("error-container");
		$("#content-list").text("No gallery title selected");
	}
	else{
		$("#title-text").text(PAGE_TITLE);
	}

	loadConfig().then(ct=>{
		const items=JSON.parse(ct);
		let item=null;
		for(let i=0;i<items.length;i++){ // find gallery with name
			const t=items[i];
			if(t.name==PAGE_TITLE){
				item=t;
				break;
			}
		}
		if(!item){ // not found
			const err={status:`Gallery ${PAGE_TITLE} not found`};
			throw err;
		}
		const content=item.content;
		if(!content||!content.length){ // empty gallery
			const err={status:`Gallery ${PAGE_TITLE} is empty`};
			throw err;
		}

		for(const c of content){ // @TODO: scrolling
			const $img=$(`<img src="//${c[0]}.sinaimg.cn/mw600/${c[1]}">`);
			$("#content-list").append($img);
		}
	}).catch(err=>{
		console.warn(err);
		if(err.status){
			$("#content-list").text(err.status);
		}
		else{
			$("#content-list").text("Error");
		}
	});

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
	const newStyleHREF=x>y?"./styles/gallery-style-wide.css":"./styles/gallery-style-thin.css";
	if(newStyleHREF!=nowStyle){ // update
		$style.attr("href",newStyleHREF);
		nowStyle=newStyleHREF;
	}
}

// ================ loading ================
function loadConfig(){
	if(!PAGE_CONFIG){
		throw new Error("No PAGE_CONFIG found.");
	}
	const TIMEOUT_DOWNLOAD=10000; // there should be progress in 10s
	return new Promise((res,rej)=>{
		const req=new XMLHttpRequest();
		let abortTimer=0;
		function clearAbortTimer(){
			if(abortTimer){
				clearTimeout(abortTimer);
				abortTimer=0;
			}
		}
		function restartAbortTimer(){
			clearAbortTimer();
			abortTimer=setTimeout(()=>{ // cancel download
				req.abort();
			},TIMEOUT_DOWNLOAD);
		}

		req.open("GET",PAGE_CONFIG);
		req.responseType="text"; // require text
		req.onload=()=>{ // 100% is also captured by onprogress
			if(req.status>=400){
				rej(req);
			}
			else{
				res(req.response);
			}
		};
		req.onprogress=event=>{ // download process can be monitored
			restartAbortTimer(); // restart download monitoring
		}
		req.ontimeout=()=>rej("Timeout");
		req.onabort=()=>rej("Timeout");
		req.onerror=()=>rej(req);
		req.send();
		restartAbortTimer(); // start countdown
	});
}