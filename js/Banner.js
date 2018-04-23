// JavaScript Document
$(function() {
	var maps = $('#allmap');
	var vedio = $('#imursVedio');
	var video = vedio.closest('div');
	var timer = null;
	var time = 10500;
	fnvideo();
	clearInterval(timer);
	timer = setInterval(fnvideo, timer);
	function fnvideo() {
		if(vedio.hasClass('zIndex')) {
			//			maps.addClass('zIndex');
			vedio.removeClass('zIndex').attr("src", "");
			timer = 5000;
		} else {
			//			maps.removeClass('zIndex');
			vedio.addClass('zIndex').attr("src", "images/iMUTS.mp4");
			timer = 10500;
		}
	}
	var html, closeBtn, popupBtn, self = video[0],popupbox = document.createElement('div');
	popupbox.setAttribute('class','popupbox');
	html = `<div class="wrap">
				<a class="closeBtn"></a>
				<video class="popupBtn popupVedio" width="960" height="540" controls="controls" preload autoplay >您的浏览器不支持 video 标签。</video>
			</div>`;
	popupbox.innerHTML = html;
	self.appendChild(popupbox);
	popupBtn = self.getElementsByClassName('popupBtn')[0];
	popupvideo = self.getElementsByClassName('popupVedio')[0];
	closeBtn = self.getElementsByClassName('closeBtn')[0];
	popupBtn.onclick = function() { //打开弹出层界面
		this.nextElementSibling.style.display = 'block';
		popupvideo.src="images/iMUTS.mp4";
	}
	popupvideo.onended =function () {
	    setTimeout(function () {
	    	popupvideo.src="images/iMUTS.mp4";
			popupvideo.autoplay=false;
	    },1000)
	}
	closeBtn.onclick = function() { //打开弹出层界面
		popupbox.style.display = 'none';
	}
})