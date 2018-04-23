function canvas() {
	// js 部分
	var onoffconsole = false;//console开关
	var onoff = false; //全屏图片居中开关
	var selectImg = document.getElementById("selectImg").getElementsByTagName("img");
	var showFold = document.getElementById("showFold");
	var smallBtn = document.getElementById("scaleSmall");
	var bigBtn = document.getElementById("scaleBig");
	var menuFold = document.getElementById("menuFold");
	var selectFold = menuFold.getElementsByTagName("dd");
	var viewbox = document.getElementsByClassName("viewbox")[0];
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext('2d');
	var cvsparent = canvas.parentNode;
	var srcAll = '';//导航图and缩略图
	var srcSmall = '';//256*256的小图
	var imgSmall = new Image(); //加载导航图
	sourceView(selectImg[0].src)
	var scale = 1; //当前放大倍数
	var oldscale = 0; //上一次放大倍数
	var config = {}; //配置参数
	config.step = 39; //每次缩放的公差
	config.maxScale = 40; //最大放大倍数
	config.minScale = 1; //最小缩小倍数
	var moveStatus = {}; //图片移动的状态参数
	var dst = { //导航图宽高
		width: 0,
		height: 0
	};
	
	var scaleX = 0; //x轴的倍数
	var scaleY = 0; //y轴的倍数
	//x、y轴的总小图数
	source.allnumx = Math.floor(source.width / 256);
	source.allnumy = Math.floor(source.height / 256);
	//获取内容区域宽高
	config.view = {
		'w': cvsparent.clientWidth,
		'h': cvsparent.clientHeight
	};
	var li = $('.tab_menu > li.pathologyTab');
	var show = $('#pathology');
	li.click(function (){
		if(!show.hasClass('.show')){
			setTimeout(function(){
				imgLoadConfig();
				navImg();
			},30)
			show.addClass('.show')
		}
	})
	
	//切换病理图片
	$(selectImg).closest('dd').click(function () {
		sourceView($(this).children('img')[0].src);
		navImg();
	})
	
//	.siblings('li').click(function(){
//		show.removeClass('.show')
//	})

	//点击放大
	bigBtn.onclick = function() {
		scale = (scale >= config.maxScale) ? config.maxScale : +(scale + config.step).toFixed(2);
		showFold.innerText = scale;
		if(scale != oldscale) {
			cScale();
			if(scale == 1) {
				initialImg({
					'top': viewbox.offsetTop,
					'left': viewbox.offsetLeft
				});
			} else {
				imgLoading({
					'top': viewbox.offsetTop,
					'left': viewbox.offsetLeft
				});
			}
			oldscale = scale
		}
	}

	//点击缩小
	smallBtn.onclick = function() {
		scale = (scale <= config.minScale) ? config.minScale : +(scale - config.step).toFixed(2);
		showFold.innerText = scale;
		if(scale != oldscale) {
			cScale();
			if(scale == 1) {
				initialImg({
					'top': viewbox.offsetTop,
					'left': viewbox.offsetLeft
				});
			} else {
				imgLoading({
					'top': viewbox.offsetTop,
					'left': viewbox.offsetLeft
				});
			}
			oldscale = scale
		}
	}

	//点击缩放相应倍数
	for(var i = 0; i < selectFold.length; i++) {
		selectFold[i].onclick = function() {
			if(this.innerText == '1' || this.innerText == '40') {
				showFold.innerText = scale = (+this.innerText);
				if(scale != oldscale) {
					cScale();
					if(scale == 1) {
						initialImg({
							'top': viewbox.offsetTop,
							'left': viewbox.offsetLeft
						});
					} else {
						imgLoading({
							'top': viewbox.offsetTop,
							'left': viewbox.offsetLeft
						});
					}
					oldscale = scale
				}
			}
			return false;
		}
	}

	//滚轮缩放
	canvas.onmousewheel = function(e) {
		if(e.wheelDelta > 0) {
			scale = (scale >= config.maxScale) ? config.maxScale : +(scale + config.step).toFixed(2);
		} else {
			scale = (scale <= config.minScale) ? config.minScale : +(scale - config.step).toFixed(2);
		}
		showFold.innerText = scale;
		if(scale != oldscale) {
			cScale();
			if(scale == 1) {
				initialImg({
					'top': viewbox.offsetTop,
					'left': viewbox.offsetLeft
				});
			} else {
				imgLoading({
					'top': viewbox.offsetTop,
					'left': viewbox.offsetLeft
				});
			}
			oldscale = scale
		}
		return false;
	}

	//屏幕大小改变重新渲染
	window.onresize = function() {
		config.view.w = cvsparent.clientWidth;
		config.view.h = cvsparent.clientHeight;
		imgLoadConfig();
		cScale();
		if(scale == 1) {
			initialImg({
				'top': viewbox.offsetTop,
				'left': viewbox.offsetLeft
			});
		} else {
			imgLoading({
				'top': viewbox.offsetTop,
				'left': viewbox.offsetLeft
			});
		}
	}

	//配置图片宽高（原始图）
	function sourceView(src) {
		srcAll = src;
		srcSmall = srcAll.split('/');
		srcSmall.pop();
		srcSmall = srcSmall.join('/');
		imgSmall.src = srcAll;
		var srcArr = srcAll.split('/');
		if (srcArr[srcArr.length-1] == '3.jpeg'){
			source = { //相应倍数的图片大小
				width: 30564,
				height: 65500
			};
		} else if (srcArr[srcArr.length-1] == '2.jpeg') {
			source = { //相应倍数的图片大小
				width: 31772,
				height: 50616
			};
		} else {
			source = { //相应倍数的图片大小   1.jpeg
				width: 22056,
				height: 13763
			};
		}
	}

	//初始图
	function initialImg(obj) {
		var img = new Image(); //加载导航图
		img.src = srcAll;
		preImageScale(img, canvas, function(x, y, width, height) {
			scaleX = +(width / dst.width).toFixed(2); //x轴的倍数
			scaleY = +(height / dst.height).toFixed(2); //y轴的倍数
			var viewboXCR = obj || viewScale(dst.width, dst.height, canvas);
			x = +(-viewboXCR.left * scaleX).toFixed(2);
			y = +(-viewboXCR.top * scaleY).toFixed(2);
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.save();
			context.drawImage(this, x, y, width, height);
			context.restore();
		});
	}

	function imgLoadConfig() {
		//获取内容区域宽高
		config.view = {
			'w': cvsparent.clientWidth,
			'h': cvsparent.clientHeight
		};
		canvas.width = config.view.w; //设置canvas与父元素等宽高
		canvas.height = config.view.h;
		config.numX = Math.ceil(config.view.w / 256); //x、y轴的小图渲染张数
		config.numY = Math.ceil(config.view.h / 256);
		config.modW = config.numX * 256 - config.view.w; //x、y轴超出的图片区间
		config.modH = config.numY * 256 - config.view.h;
	}

	function imgLoading(obj) {
		scaleX = +(source.width / dst.width).toFixed(2); //x轴的倍数
		scaleY = +(source.height / dst.height).toFixed(2); //y轴的倍数
		var viewboXCR = obj || viewScale(dst.width, dst.height, canvas);
		var Nx = Math.floor((scaleX * viewboXCR.left) / 256);
		var Ny = Math.floor((scaleX * viewboXCR.top) / 256);
		var modX = Math.floor((scaleX * viewboXCR.left) % 256);
		var modY = Math.floor((scaleX * viewboXCR.top) % 256);
		var mx = 0;
		var my = 0;
		if(config.modW - modX < 0) {
			mx = 1;
		};
		if(config.modH - modY < 0) {
			my = 1;
		};
		//当Nx、Ny为负数是，重置自身的开始值为0
		if(Nx < 0) {
			Nx++;
		};
		if(Ny < 0) {
			Ny++;
		};
		var imgXY = new Image(); //给定每个一个图片的偏移量，以防有余数
		imgXY.src = srcSmall+'/xpos=0&ypos=0.jpg';
		var imgX = imgXY.width;
		var imgY = imgXY.height;
		context.clearRect(0, 0, canvas.width, canvas.height);
		for(var x = Nx, sx = 0; x < (Nx + config.numX + mx); x++, sx++) {
			for(var y = Ny, sy = 0; y < (Ny + config.numY + my); y++, sy++) {
				if(source.allnumx < x || source.allnumy < y) {
					break; //超出图片最大尺寸跳出循环
				};
				if(x < 0 || y < 0) {
					continue; //当图片坐标为0时跳过此次循环
				};
				(function(sx, sy) {
					window['imgs' + x + y] = new Image();
					window['imgs' + x + y].src = srcSmall+'/xpos=' + x + '&ypos=' + y + '.jpg';
					preImage(window['imgs' + x + y], function(x, y, width, height) {
						x = x * sx - modX;
						y = y * sy - modY;
						context.save();
						context.drawImage(this, x, y, width, height);
						context.restore();
					}, {
						'x': imgX,
						'y': imgY
					});
				})(sx, sy);
			};
		};
	}

	function preImage(img, callback, wo) { //256小图渲染
		var wo = wo || {};
		//		var callback = callback || function (){};
		if(img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
			configImg(img, wo);
			callback.call(img, wo.x, wo.y, wo.width, wo.height);
			return; // 如果图片已经存在于浏览器缓存，直接返回，不用再处理onload事件  
		}
		img.onload = function() { //图片下载完毕时异步调用callback函数。  
			configImg(img, wo);
			callback.call(img, wo.x, wo.y, wo.width, wo.height); //将回调函数的this替换为Image对象  
		};
	}

	function configImg(img, wo) { //256小图配置info
		var wo = wo || {};
		wo.x = wo.x || img.width;
		wo.y = wo.y || img.height;
		wo.width = wo.width || img.width;
		wo.height = wo.height || img.height;
	}

	function navImg() { //导航图函数
		//缩略图canvas
		var wh = {
			'width': 200,
			'height': 200
		};
		onoffconsole&&console.log('navImg:',true)
		var viewImg = document.getElementById("viewImg");
		var viewSmall = document.getElementById("viewSmall");
		var xline = document.getElementsByClassName("xline")[0];
		var yline = document.getElementsByClassName("yline")[0];
		var cvsSmall = viewSmall.getContext('2d');
		var xlineoff = xline.getBoundingClientRect();
		var ylineoff = yline.getBoundingClientRect();
		preImageScale(imgSmall, wh, function(x, y, width, height) {
			onoffconsole&&console.log('preImageScale:',true);
			viewSmall.width = dst.width = width; //导航图定义宽高
			viewSmall.height = dst.height = height;
			viewSmall.parentNode.style.width = width + 'px'; //导航wrap的宽高
			viewSmall.parentNode.style.height = height + 'px';
			var xlinetTop = +(height / 2 - xlineoff.height / 2).toFixed(2); //辅助线的定位
			var ylineLeft = +(width / 2 - ylineoff.width / 2).toFixed(2);
			xline.style.top = xlinetTop + 'px';
			yline.style.left = ylineLeft + 'px';
			var viewboxCR = viewScale(width, height, canvas); //导航栏模拟窗口的宽高上左边距
			viewbox.style.width = viewboxCR.w + 'px';
			viewbox.style.height = viewboxCR.h + 'px';
			viewbox.style.top = viewboxCR.top + 'px';
			viewbox.style.left = viewboxCR.left + 'px';
			cvsSmall.save();
			cvsSmall.drawImage(this, x, y, width, height);
			cvsSmall.restore();
			moveStatus = { //移动状态的参数
				'mouseX': 0,
				'mouseY': 0,
				'viewboxTopY': viewboxCR.top,
				'viewboxLeftX': viewboxCR.left,
				'viewboxWidth': viewboxCR.w,
				'viewboxHeight': viewboxCR.h,
				'xlineY': xlinetTop,
				'ylineX': ylineLeft
			};
			if(scale == 1) {
				initialImg({
					'top': moveStatus.viewboxTopY,
					'left': moveStatus.viewboxLeftX
				});
			} else {
				imgLoading({
					'top': moveStatus.viewboxTopY,
					'left': moveStatus.viewboxLeftX
				});
			}
			oldscale = scale;
		}, {
			"x": 0,
			"y": 0
		}); //x,y横坐标，纵坐标，图像宽度，width,图像高度，height

		var isMove = false;
		var isClick = false;

		canvas.onmousedown = function(e) {
			isMove = true;
			isClick = false;
			canvas.style.cursor = "move";
			var box = windowToViewImg(e.clientX, e.clientY, canvas);
			moveStatus.mouseX = +(box.x / scaleX).toFixed(2); //返回显示窗口在导航图的对应尺寸
			moveStatus.mouseY = +(box.y / scaleY).toFixed(2);
			return false;
		}

		canvas.onmouseout = function(e) {
			if(!this.contains(e.toElement)) {
				isMove = false;
				canvas.style.cursor = "default"; //更改光标状态
				return false;
			}
		}

		canvas.onmouseup = function(e) {
			isMove = false;
			if(isClick) {
				canvas.style.cursor = "default";
			}
			return false;
		}

		canvas.onmousemove = function(e) {
			if(isMove) {
				isClick = true;
				var box = windowToViewImg(e.clientX, e.clientY, canvas);
				var x = +(box.x / scaleX).toFixed(2); //返回显示窗口在导航图的对应尺寸
				var y = +(box.y / scaleY).toFixed(2);
				//前两个参数是鼠标结束位置，后两个参数设置鼠标与img移动的方向是否一致
				drawViewByMove(x, y, (moveStatus.mouseX - x), (moveStatus.mouseY - y));
			}
			return false;
		}

		viewImg.onclick = function(e) {
			if(!isClick) {
				var box = windowToViewImg(e.clientX, e.clientY, viewImg);
				drawViewByClick(box.x, box.y);
			}
		}

		viewImg.onmousedown = function(e) {
			isClick = false;
			return false;
		}

		viewbox.onmousedown = function(e) {
			isMove = true;
			isClick = false;
			viewbox.style.cursor = "move";
			var box = windowToViewImg(e.clientX, e.clientY, viewImg);
			moveStatus.mouseX = box.x;
			moveStatus.mouseY = box.y;
			return false;
		}

		viewImg.onmouseout = function(e) {
			if(!this.contains(e.toElement)) {
				isMove = false;
				viewbox.style.cursor = "default";
				return false;
			}
		}

		viewbox.onmouseup = function(e) {
			if(isClick) {
				isMove = false;
				viewbox.style.cursor = "default";
			}
			return false;
		}

		viewImg.onmousemove = function(e) {
			if(isMove) {
				isClick = true;
				var box = windowToViewImg(e.clientX, e.clientY, viewImg);
				drawViewByMove(box.x, box.y, (box.x - moveStatus.mouseX), (box.y - moveStatus.mouseY));
			}
			return false;
		}

		//拖动渲染相应区域的256img
		function drawViewByMove(x, y, mouseX, mouseY) {
			moveStatus.viewboxLeftX = moveStatus.viewboxLeftX + mouseX;
			moveStatus.viewboxTopY = moveStatus.viewboxTopY + mouseY;
			moveStatus.xlineY = moveStatus.xlineY + mouseY;
			moveStatus.ylineX = moveStatus.ylineX + mouseX;
			viewbox.style.left = moveStatus.viewboxLeftX + 'px';
			viewbox.style.top = moveStatus.viewboxTopY + 'px';
			xline.style.top = moveStatus.xlineY + 'px';
			yline.style.left = moveStatus.ylineX + 'px';
			if(scale == 1) {
				initialImg({
					'top': moveStatus.viewboxTopY,
					'left': moveStatus.viewboxLeftX
				});
			} else {
				imgLoading({
					'top': moveStatus.viewboxTopY,
					'left': moveStatus.viewboxLeftX
				});
			}
			moveStatus.mouseX = x;
			moveStatus.mouseY = y;
		}

		//点击渲染相应区域的256img
		function drawViewByClick(x, y) {
			moveStatus.viewboxLeftX = x - (viewbox.offsetWidth / 2).toFixed(2);
			moveStatus.viewboxTopY = y - (viewbox.offsetHeight / 2).toFixed(2);
			moveStatus.xlineY = y - (xlineoff.height / 2).toFixed(2);
			moveStatus.ylineX = x - (ylineoff.width / 2).toFixed(2);
			viewbox.style.left = moveStatus.viewboxLeftX + 'px';
			viewbox.style.top = moveStatus.viewboxTopY + 'px';
			xline.style.top = moveStatus.xlineY + 'px';
			yline.style.left = moveStatus.ylineX + 'px';
			if(scale == 1) {
				initialImg({
					'top': moveStatus.viewboxTopY,
					'left': moveStatus.viewboxLeftX
				});
			} else {
				imgLoading({
					'top': moveStatus.viewboxTopY,
					'left': moveStatus.viewboxLeftX
				});
			}
			moveStatus.mouseX = x - (viewbox.offsetHeight / 2).toFixed(2);
			moveStatus.mouseY = y - (viewbox.offsetWidth / 2).toFixed(2);
		}

		//返回相对于目标元素左上角的坐标值
		function windowToViewImg(x, y, obj) {
			var box = obj.getBoundingClientRect();
			return {
				'x': x - box.left,
				'y': y - box.top
			};
		}
	}

	//图片等比例渲染
	function preImageScale(img, view, callback, wo) {
		var wo = wo || {};
		//		var callback = callback || function (){};
		if(img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
			configNavImg(img, view, wo);
			callback.call(img, wo.x, wo.y, wo.width, wo.height);
			return; // 直接返回，不用再处理onload事件  
		}
		img.onload = function() { //图片下载完毕时异步调用callback函数。  
			configNavImg(img, view, wo);
			callback.call(img, wo.x, wo.y, wo.width, wo.height); //将回调函数的this替换为Image对象  
		};
	}

	function configNavImg(img, view, wo) { //导航图配置info
		var wo = wo || {};
		var view = view || {};
		var imgWidth = view.width;
		var imgHeight = +(view.width * img.height / img.width).toFixed(2);
		if(img.width < img.height) {
			imgWidth = +(view.height * img.width / img.height).toFixed(2);
			imgHeight = view.height;
		}
		wo.width = wo.width || imgWidth;
		wo.height = wo.height || imgHeight;
	}

	function cScale() {
		var box = viewScale(dst.width, dst.height, canvas);
		moveStatus.viewboxLeftX = +(moveStatus.viewboxWidth / 2 + moveStatus.viewboxLeftX - box.w / 2).toFixed(2);
		moveStatus.viewboxTopY = +(moveStatus.viewboxHeight / 2 + moveStatus.viewboxTopY - box.h / 2).toFixed(2);
		viewbox.style.width = box.w + 'px';
		viewbox.style.height = box.h + 'px';
		viewbox.style.left = moveStatus.viewboxLeftX + 'px';
		viewbox.style.top = moveStatus.viewboxTopY + 'px';
		moveStatus.viewboxWidth = box.w;
		moveStatus.viewboxHeight = box.h;
	}

	function viewScale(w, h, obj2) { //返回等比例宽高以及返回父元素居中的上左边距
		var obj1 = {
			width: w,
			height: h
		};
		var obj2 = obj2.getBoundingClientRect();
		var Width = +(obj1.width / scale).toFixed(2);
		var Height = +(obj1.width * obj2.height / obj2.width / scale).toFixed(2);
		if(obj1.width < obj1.height) {
			Width = +(obj1.height * obj2.width / obj2.height / scale).toFixed(2);
			Height = +(obj1.height / scale).toFixed(2);
		}
		var Top = +(obj1.height / 2 - Height / 2).toFixed(2);
		var Left = +(obj1.width / 2 - Width / 2).toFixed(2);
		return {
			w: Width,
			h: Height,
			top: Top,
			left: Left
		};
	}
	//全屏按钮
	var btn = document.getElementById("FullScreen");
	btn.onclick = function() {
		var docElm = document.getElementById('cvswrap');
		if(btn.innerText == '全屏显示') {
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
			//Chrome等 
			else if(docElm.msRequestFullScreen) {
				docElm.msRequestFullScreen();
			}
		} else {
			exitFullscreen();
		}
		return false;
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
		};
	}
	fullscreenchange(document.getElementById('cvswrap'),function (self) {
		if (btn.innerText=='全屏显示') {
			onoff = true;
			btn.className = 'exitFullscreen';
			btn.innerText = '取消全屏';
		} else{
			onoff = false;
			btn.className = 'fullscreen';
			btn.innerText = '全屏显示';
		}
	})

	
}