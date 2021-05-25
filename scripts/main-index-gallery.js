/**
 * Use Sinaimg as image provider
 */

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
	const $list=$("#content-list");

	loadConfig().then(content=>{
		const items=JSON.parse(content);
		for(let i=0;i<items.length;i++){
			const item=items[i];
			if(item.title){ // title info
				$("#title-text").text(item.title);
				continue;
			}
			if(!item.content||!item.content.length){ // empty
				continue;
			}
			const $el=$("<div>");
			$el.append($("<div class='text-name'>").text(item.name));
			const $elHint=$("<div class='gallery-row'>");

			const N=Math.min(item.content.length,4); // at most 4 pics
			for(let i=0;i<N;i++){
				const c=item.content[i];
				let $img;
				if(c.length==2){
					$img=$(`<img src="//${c[0]}.sinaimg.cn/mw600/${c[1]}">`);
				}
				else{
					$img=$(`<img src="${c[0]}">`);
				}
				$elHint.append($img);
			}

			$el.append($elHint);
			$list.append($el);
	
			
			$el.click(e=>{
				const encodedTitle=encodeURIComponent(item.name);
				jumpTo(`./gallery.html${window.location.search}&title=${encodedTitle}`);
			});
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

// ================ Loading =================
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