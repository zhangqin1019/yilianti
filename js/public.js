var imgsrc;
$(function(){
	var onoffconsole = $.objSearch;
    var search = $.objSearch;
	//判断是否登录-----js/jquery-1.8.3.min.js
	loginVerify();
	//hash值改变刷新页面
	window.onhashchange = function (){
		location.reload();
	}
	//改变storage事件监听video窗口
	window.addEventListener('storage',function () {
		var newWindow = localStorage.getItem('newWindow');
		if (newWindow == 'true') {
			sessionStorage.setItem('newWindow','true');
		} else {
			sessionStorage.removeItem('newWindow');
		}
	})
    $("body").bind("click",function(){
        parent.$('.y_rt',parent.document).trigger('click');
    });
    //search栏action地址
    $('#forms').attr('action',$.ip+$('#forms').attr('action'))
    //判断页面链接与缓存sessionStorage下的项目html相同
    var whref = decodeURI(location.href);
    var storageHtml = sessionStorage.getItem('html');
 	if (whref!=storageHtml) {
 		sessionStorage.setItem('html',whref);
 	}
    //backnav
    $('.backnav').click(backNav);
    //给面包屑导航最后的a标签链接更换为当前window的href
    $('.list-broad a').last('a').click(function () {
    	this.href = location.href;
    })
    //会诊申请
    $('#border').attr('href',$('#border').attr('href')+'?hospitalName='+search.hospitalName+'&hospitalId='+search.hospitalId);
	//给taba_menu切换d的a标签链接添加申请ID
	$('.tab_menu>li>a').click(function() {
		var str = decodeURI(this.href);
		var search = decodeURI(location.search);
		if(str.indexOf('.html') != -1 && $(this).is('[href]')) {
			$(this).attr('href', this.href + search);
		}
	});
    //加载页面前执行(页面正在加载)
    loading_start();
    //页面加载完成时执行
    $(window).load(function(){
        loading_end();
    });
    //日期默认为当前时间
    var dates = $('.date');
    var getTime = new Date();
    var year = getTime.getFullYear();
    var mon = getTime.getMonth() + 1;
    var day = getTime.getDate();
    function addZero(num) {
      if(num<10){
        num = '0' + num;
      };
      return num;
    }
    dates.val(year+'-'+addZero(mon)+'-'+addZero(day));
    //对应页面菜单出现对应样式
	var mateHtml = $(window.parent.document).find('#mateHtml');
	//菜单二级导航的a
	var menu2_a = mateHtml.children('li').children('ul').children('li').children('a');
	$(window).load(function () {
		//面包屑导航a标签
		var nav_3 = $('.list-broad a').eq(2);
		var nav_3_href = decodeURI(nav_3.attr('href'));
		menu2_a.each(function (i) {
			var menu2_a_href = decodeURI(menu2_a.eq(i).attr('href'));
			menu2_a_href = menu2_a_href.indexOf('../') == -1 ? menu2_a_href : menu2_a_href.split('../')[1];
			if (nav_3_href.indexOf(menu2_a_href) != -1||menu2_a_href.indexOf(nav_3_href) != -1) {
	            //清除同一个li里面的a
				menu2_a.eq(i).closest('li').siblings('li').children('a').removeClass('click2_active');
	            //清除不同一个li里面的a
				menu2_a.eq(i).closest('ul').closest('li').siblings('li').children('ul').children('li').children('a').removeClass('click2_active');
				menu2_a.eq(i).addClass('click2_active');
				var menu1_a = menu2_a.eq(i).closest('ul').siblings('a');
				if (!menu1_a.hasClass('click_active')) {
					menu1_a.addClass('click_active').closest('li').siblings('li').children('a').removeClass('click_active');
					menu1_a.siblings('ul').slideDown(500).closest('li').siblings('li').children('ul').slideUp(500);
					menu1_a.closest('li').addClass('selected').siblings('li').removeClass('selected');
				}
			}
		});
	    //保存面包屑导航的a标签链接href
		var nav_3 = $('.list-broad a:gt(1)'),
			nav_last = $('.list-broad a').last('a'),
			strName = nav_last.text(),
			strHref = decodeURI(location.href),
			objName = sessionStorage.getItem('navName');
		if (nav_3.length>1) {
			nav_3.each(function (index) {
				var nav_txt = nav_3.eq(index).text();
				objName = objName ? objName : '';
				if (nav_txt != strName&&objName.indexOf(nav_txt)==-1&&index<nav_3.length-1) {
					if (strName=='远程视频'&&nav_txt==nav_3.eq(-2).text()) {
						nav_3[index].search = decodeURI(location.search);
	   					sessionStorage.setItem(nav_txt,decodeURI(nav_3[index].href));
					} else {
						nav_3[index].search = decodeURI(location.search).split('&').splice(1).join('&');
	   					sessionStorage.setItem(nav_txt,decodeURI(nav_3[index].href));
					}
	   				addName(nav_txt);
				}
			})
		}
	    sessionStorage.setItem(strName,strHref);
	    addName(strName);
	    function addName(strName) {
	    	if (!objName||objName.indexOf(strName)==-1) {
		    	if (!objName) {
			    	objName=strName;
			    	sessionStorage.setItem('navName',objName);
			    } else{
			    	objName+='/'+strName;
			    	sessionStorage.setItem('navName',objName);
			    }
		    }
	    }
		objName = sessionStorage.getItem('navName');
		arrName = objName.split('/');
		var step = 0;
		arrName.forEach(function (sName,index) {
			var nowIndex = index-step,
				strName = nav_3.eq(nowIndex).text(),
				strHref = sessionStorage.getItem(strName);
			if (strName==sName) {
				nav_3.eq(nowIndex).attr('href',strHref);
			} else {
				step++;
				sessionStorage.removeItem(sName);
				arrName[index]='';
			}
			arrName = arrName.join('') == '' ? false : arrName;
		})
		objName = arrName ? arrName.join('/').match(/[^\/]+/g).join('/') : '';
		sessionStorage.setItem('navName',objName);
	})
	/*屏幕与视频高度自适应*/
	var content = $('body');
	var wrap = $('#wrap')[0];
	var footer = $('.list-footer');
	var videoWrap = $('#videoWrap');
	var video = videoWrap.children('.video');
	var btn_join = $('#div_join');
	var height = 0;
	var videoheight = 0;
	function resize() {
		if(wrap){
			var iModheight = wrap.offsetTop + BoundingHeight(wrap);
			var minWidth = parseFloat(getComputedStyle(content[0]).minWidth)+BoundingWidth(content[0]);
			var width = document.documentElement.clientWidth;
			height = parent.window == window ? document.documentElement.clientHeight : parent.window.document.documentElement.clientHeight - 50 - (minWidth > width ? 17 : 0);
			$(wrap).css('min-height',height - iModheight - BoundingHeight(footer[0]) - footer.height())
		}
		if (video[0]) {
			videoWrap.css({'height':height - iModheight,'background': '#000','margin': 0});
			videoheight = height - iModheight - BoundingHeight(btn_join[0]) - btn_join.height();
			video.css('height',videoheight);
			fnChild(video[0]);
		}
		var h1 = $('#eCharts3 .count-table').height() + BoundingHeight($('#eCharts3 .count-table')[0]);
		var h2 = $('#eCharts6 .count-table').height() + BoundingHeight($('#eCharts6 .count-table')[0]);
		$('#eWrap1 .content').eq(0).css({'max-height':h1,'height':h1});
		$('#eWrap2 .content').eq(0).css({'max-height':h2,'height':h2});
	};
	resize();
	window.onresize = function() {
		var saveimgDd = $('#saveimg dd');
		saveimgDd.each(function(i){
			var cvs = saveimgDd.eq(i).find('.popupbox canvas#saveImg')[0];
			loadImg(cvs,imgsrc);
		})
		resize();
	};
	//视频全屏
	var docElm = location.href.search('videoWindow.html') != -1 ? document.documentElement : $('div#videoWrap')[0],
		FullScreen = $('#FullScreen');
	FullScreen.click(function () {
		var that = $(this);
		if (that.text()=='全屏') {
			fullscreen(docElm);
		} else{
			exitFullscreen();
		}
	})
	fullscreenchange(docElm,function (self) {
		if (FullScreen.text()=='全屏') {
			$(self).addClass('FullScreen');
			FullScreen.text('取消全屏');
		} else{
			$(self).removeClass('FullScreen');
			FullScreen.text('全屏');
		}
		setTimeout(function () {
			var video = $(self).find('.video');
				vheight = window.innerHeight,
				videoheight = vheight - BoundingHeight(btn_join[0]) - btn_join.height();
			video.data('height',videoheight);
			video.css('height',video.data('height'));
		},30)
	})
	var callback = function(records) {
		records.map(function(record) {
			fnChild(video[0]);
		});
	};
	var obser = new MutationObserver(callback);
	var options = {
		childList: true,
	};
	if (video[0]) {
		obser.observe(video[0], options); //开始监听
	}
	function fnChild(obj) {
		var child = $(obj).children('div');
		$('#agora_local').css('position','absolute');
		$('#agora_local').addClass('tabvideosmall');
		if(child.length > 2) {
			$('.agora_remote').css('height', '50%');
		} else if(child.length == 2) {
			$('.agora_remote').css('height', '100%');
		} else if(child.length == 1) {
			$('#agora_local').css({
				'position':'relative',
				'height': '100%',
				'width': '100%'
			});
			$('#agora_local').removeClass('tabvideosmall');
		}
	}
	function BoundingHeight(ele) {
		ele = ele || document.body;
		var getStyle = getComputedStyle(ele);
		var marginTop = parseFloat(getStyle.marginTop);
		var marginBottom = parseFloat(getStyle.marginBottom);
		var paddingTop = parseFloat(getStyle.paddingTop);
		var paddingBottom = parseFloat(getStyle.paddingBottom);
		var borderTop = parseFloat(getStyle.borderTop);
		var borderBottom = parseFloat(getStyle.borderBottom);
		return marginTop + marginBottom + paddingTop + paddingBottom + borderTop + borderBottom;
	};
	function BoundingWidth(ele) {
		ele = ele || document.body;
		var getStyle = getComputedStyle(ele);
		var marginTop = parseFloat(getStyle.marginLeft);
		var marginBottom = parseFloat(getStyle.marginRight);
		var paddingTop = parseFloat(getStyle.paddingLeft);
		var paddingBottom = parseFloat(getStyle.paddingRight);
		var borderTop = parseFloat(getStyle.borderLeft);
		var borderBottom = parseFloat(getStyle.borderRight);
		return marginTop + marginBottom + paddingTop + paddingBottom + borderTop + borderBottom;
	};

	//打印
	$('.btn-print').click(function (){
		$('.print').addClass('resource-container');
		$(".print").jqprint({
			debug: false,
			importCSS: true,
			printContainer: true,
			operaSupport: true
		});
		$('.print').removeClass('resource-container');
	})
});
//加载页面前执行(页面正在加载)
function loading_start(){
    var h = $(window).height();
    $(".overlay").css({"height": h });
    $(".overlay").css({'display':'block','opacity':'0.7','filter':'alpha(opacity=0.7)'});
    $(".showbox").show();
    $(".showbox").stop(true).animate({'top':'44%','opacity':'1'},200);
}

//加载页面结束执行
function loading_end(){
    setTimeout(function(){
        $(".showbox").stop(true).animate({'top':'50%','opacity':'0'},400,function(){
          $(".showbox").fadeOut();
        });
        $(".overlay").css({'display':'none','opacity':'0'});
    },200);
}

//视频切换
function tabvideo() {
	var agora_local = $('#agora_local');
	if (agora_local.hasClass('tabvideosmall')) {
		agora_local.addClass('tabvideobig').removeClass('tabvideosmall').find('video').css('transform','rotateY(0deg)');
	} else{
		agora_local.addClass('tabvideosmall').removeClass('tabvideobig').find('video').css('transform','rotateY(180deg)');
	}
}
/*全屏函数*/
function fullscreen(docElm) {
	//W3C 
	if(docElm.requestFullscreen) {
		docElm.requestFullscreen();
	}
	//FireFox 
	else if(docElm.mozRequestFullScreen) {
		docElm.mozRequestFullScreen();
	}
	//Chrome等 
	else if(docElm.webkitRequestFullScreen) {
		docElm.webkitRequestFullScreen();
	}
	else if(docElm.msRequestFullScreen) {
		docElm.msRequestFullScreen();
	}
}
function exitFullscreen() {
	if(document.exitFullscreen) {
		document.exitFullscreen();
	} else if(document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if(document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
	} else if(document.msExitFullscreen) {
		document.msExitFullscreen();
	}
}
function fullscreenchange(docElm,callback) {
	docElm&&docElm.addEventListener("fullscreenchange", function () {
		typeof callback === 'function' && callback(this);
 	}, false);
	docElm&&docElm.addEventListener("msfullscreenchange", function () {
		typeof callback === 'function' && callback(this);
	}, false);
	docElm&&docElm.addEventListener("mozfullscreenchange", function () {
		typeof callback === 'function' && callback(this);
	}, false);
	docElm&&docElm.addEventListener("webkitfullscreenchange", function () {
		typeof callback === 'function' && callback(this);
	}, false);
}
/*存档阅片*/
function saveImg(saveimg,imgarr){
	if(imgarr[0].imageurl){
		saveimg.each(function(i){
			if(i==0){
				var htmlStr ='<div class="dis-table">',
					onoff = false;
				for(var row=0;row>=0;row++){
					var step = row*5;
					htmlStr += '<div class="dis-table-row">';
					for(var d=step;d<(step+5);d++){
						if(imgarr[d].fileType==1){
							htmlStr += '<span class="input-pub dis-table-cell"><img class="popupBtn" src="'+$.imgurl+imgarr[d].imageurl+'" title="点击全屏显示" alt="视频图片"/></span>';
							onoff = true;
						}else{
							step+=1;
						};
						if(!imgarr[d+1]){
							row=-2;
							break;
						}
					};
					htmlStr += '</div>';
				}
				htmlStr += '</div>';
				onoff&&saveimg.eq(i).html(htmlStr);
			};
			if(i==1){
				var htmlStr ='<div class="dis-table">'
					onoff = false;
				for(var row=0;row>=0;row++){
					var step = row*5;
					htmlStr += '<div class="dis-table-row">';
					for(var d=step;d<(step+5);d++){
						if(imgarr[d].fileType==2){
							htmlStr += '<span class="input-pub dis-table-cell"><img class="popupBtn" src="'+$.imgurl+imgarr[d].imageurl+'" title="点击全屏显示" alt="视频图片"/></span>';
							onoff = true;
						}else{
							step+=1;
						};
						if(!imgarr[d+1]){
							row=-2;
							break;
						}
					};
					htmlStr += '</div>';
				}
				htmlStr += '</div>';
				onoff&&saveimg.eq(i).html(htmlStr);
			};
		});
	};
}
/*图片放大缩小移动*/
function loadImg(ele,imgUrl) {
	// 基础配置
	var config = {
		width: ele.parentNode.offsetWidth, // 设置canvas的宽
		height: ele.parentNode.offsetHeight, // 设置canvas的高
		imgSrc: imgUrl, // 图片路径
		maxScale: 4.0, // 最大放大倍数
		minScale: 0.1, // 最小放大倍数
		step: 0.1 // 每次放大、缩小 倍数的变化值
	};
	// 标记是否移动事件
	var isMove = false;
	var imgStatus = {
		'scale': 1,
		'rotate': 0
	};
	var lastStatus = {};
	var currentStatus = {};
	var canvas = ele;
	canvas.width = config.width;
	canvas.height = config.height;
	var ctx = canvas.getContext("2d");
	var img = new Image();
	img.src = config.imgSrc;
	img.onload = function() {
		lastStatus = {
			"imgX": -1 * img.width / 2,
			"imgY": -1 * img.height / 2,
			'mouseX': 0,
			'mouseY': 0,
			'translateX': canvas.width / 2,
			'translateY': canvas.height / 2,
			'scale': 1.0,
			'rotate': 0
		};
		drawImgByStatus(canvas.width / 2, canvas.height / 2);
	};
	canvas.onmousedown = function(e) {
		isMove = true;
		canvas.style.cursor = "move";
		var box = windowToCanvas(e.clientX, e.clientY);
		lastStatus.mouseX = box.x;
		lastStatus.mouseY = box.y;
		return false;
	}
	canvas.onmouseout = function(e) {
		isMove = false;
		canvas.style.cursor = "default";
	}
	canvas.onmouseup = function(e) {
		isMove = false;
		canvas.style.cursor = "default";
	}
	canvas.onmousemove = function(e) {
		if(isMove) {
			var box = windowToCanvas(e.clientX, e.clientY);
			drawImgByMove(box.x, box.y);
		}
	}
	canvas.onmousewheel = function(e) {
		if(e.wheelDelta > 0) {
			imgStatus.scale = (imgStatus.scale >= config.maxScale) ? config.maxScale : imgStatus.scale + config.step;
		} else {
			imgStatus.scale = (imgStatus.scale <= config.minScale) ? config.minScale : imgStatus.scale - config.step;
		}
		imgStatus.scale = parseFloat(imgStatus.scale.toFixed(1));
		drawImgByStatus(canvas.width / 2, canvas.height / 2);
		return false;
	}
	function drawImgByMove(x, y) {
		lastStatus.translateX = lastStatus.translateX + (x - lastStatus.mouseX);
		lastStatus.translateY = lastStatus.translateY + (y - lastStatus.mouseY);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.translate(lastStatus.translateX, lastStatus.translateY);
		ctx.rotate(imgStatus.rotate * Math.PI / 180);
		ctx.scale(imgStatus.scale, imgStatus.scale);
		ctx.drawImage(img, lastStatus.imgX, lastStatus.imgY, img.width, img.height);
		ctx.restore();
		lastStatus.mouseX = x;
		lastStatus.mouseY = y;
	}
	function drawImgByStatus(x, y) {
		var imgX = lastStatus.imgX - (x - lastStatus.translateX) / lastStatus.scale;
		var imgY = lastStatus.imgY - (y - lastStatus.translateY) / lastStatus.scale;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(imgStatus.rotate * Math.PI / 180);
		ctx.scale(imgStatus.scale, imgStatus.scale);
		ctx.drawImage(img, imgX, imgY, img.width, img.height);
		ctx.restore();
		lastStatus = {
			'imgX': imgX,
			'imgY': imgY,
			'translateX': x,
			'translateY': y,
			'scale': imgStatus.scale,
			'rotate': imgStatus.rotate
		};
	}
	/**
	 * 计算相对于canvas左上角的坐标值
	 */
	function windowToCanvas(x, y) {
		var box = canvas.getBoundingClientRect();
		return {
			'x': x - box.left,
			'y': y - box.top
		};
	}
};
//返回函数
function backNav() {
	var nav_3 = $('.list-broad a:gt(1)');
	location.href = decodeURI(nav_3.eq(-2).attr('href'));
}
//刷新
function refresh(infId,yz) {
	if (infId) {
		if(yz){
			$.ajax({
				url: $.ip + '/inform/updateMessage',
				type: 'post',
				async: true,
				data: {
					"infId": infId
				},
				dataType: 'json',
				success: function(data) {
					location.href = location.href.split(/&typ=1|typ=1/).join('');//关闭视频
				},
				error: function(data) {
					onoffconsole&&console.log(data.err);
				}
			})
		};
	}else{
		if(yz){
			location.href = location.href.split(/&typ=1|typ=1/).join('');//关闭视频
			return false;
		};
		location.reload();
	}
	return;
}
//病理图片判断
function pathlogy(){
    if (getRequest(location.search).id == 119) {
    	$('#selectImg dl dd img').eq(0).attr('src','https://imuts.oss-cn-shenzhen.aliyuncs.com/image3/3.jpeg')
    } else{
    	$('#selectImg dl dd img').eq(0).attr('src','https://imuts.oss-cn-shenzhen.aliyuncs.com/image/1.jpeg')
    }
}