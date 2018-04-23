//ie6 ie7处理
$(document).ready(function(){
	//判断是否登录------js/jquery-1.8.3.min.js
	loginVerify();
    if(navigator.userAgent.indexOf("MSIE")>0){   
        if(navigator.userAgent.indexOf("MSIE 6.0")>0){   
          alert("你的浏览器版本太旧,请升级或使用主流的浏览器(谷歌,火狐等等)!");   
          window.close();
        }    
    } 
//框架宽度高度%
    function down_height() {
        var win_h = window.innerHeight;
        var y_top = $(".D2_logo").height();
        $(".y_main,.y_rt").css("height", win_h);
        $(".y_lt,.y_lt_small").css("height", win_h - y_top);
        $(".y_iframe,.tab_iframe").css("height", win_h - y_top);
    };
    down_height();
//窗口变化,对应尺寸变化    
    $(window).resize(function(){
        var win_w = $(window).width();
        down_height();
        if (win_w<770) {
          $(".D2_rt_menber").hide();
        }else{
          $(".D2_rt_menber").show();
        }
    });
    //加载页面前执行(页面正在加载)
    function loading_start(){
       var h = $(window).height();
       $(".overlay").css({"height": h });
       $(".overlay").css({'display':'block','opacity':'0.7','filter':'alpha(opacity=0.7)'});
       $(".showbox").stop(true).animate({'top':'44%','opacity':'1'},200);
    }
    loading_start();
    //加载页面结束执行
     function loading_end(){
      setTimeout(function(){
          $(".showbox").stop(true).animate({'top':'50%','opacity':'0'},400,function(){
            $(".showbox").fadeOut();
          });
          $(".overlay").css({'display':'none','opacity':'0'});
      },200);
    }
    //页面加载完成时执行
    $(window).load(function(){
        loading_end();
    });
	//判断引导页传入的连接
    var search = '';
	var iframe = $('.tab_iframe');
	var objUrl = getRequest(location.search);
	var sUrl = objUrl.url;
	var arrUrl = [];
	var search = '';
	delete objUrl.url;
	delete objUrl.applyStatu;
	for (keys in objUrl) {
		arrUrl.push(keys+'='+objUrl[keys])
	}
	search = arrUrl.join('&');
	if(!sessionStorage.getItem('url')){
		sessionStorage.setItem('url','true');
		iframe.attr('src',sUrl+'?'+search);
	}
	//医院登录名称
	$('.D2_user_name').text(objUrl.hospitalName||objUrl.docName);
    //页面刷新时保留在当前页面
    var oldHtml=sessionStorage.getItem('oldHtml');
    var newHtml=decodeURI(location.href).trim();
    if (oldHtml) {
      if (oldHtml!=newHtml) {
        sessionStorage.removeItem('html');
      }
    }
    var storageHtml=sessionStorage.getItem('html');
    if(storageHtml){
      $(".tab_iframe").attr("src",storageHtml);
    }else{
    	$(window).load(function(){
            var htmls=$(".tab_iframe").attr("src");
            sessionStorage.setItem('html',htmls+'?'+search);
    	})
    	setItem();
    }
	//点击a链接加上search参数
    $('.dropdown > li  > ul > li > a').click(aClick);
    $(".tab_iframe").load(function () {
 		var childdm = $(window.frames["main"].document);
     	var oa = childdm.contents().find('a');
     	var title = childdm.contents().find('.list-title h3');
     	var search = $.objSearch;
     	oa.each(function (i) {
		    oa.eq(i).click(aClick);
     	})
     	//医院或者专家标题
    	title.text(title.text()+(search.hospitalName||search.docName));
    });
	function aClick(){
		var aSearch = decodeURI(this.search).trim();
		var ahref = decodeURI(this.href).trim();
     	if (this.href&&ahref.indexOf('.html') != -1&&ahref.indexOf('cornerstoneImageLoader') == -1) {
			if (aSearch == '') {
				this.search=search;
			} else if (aSearch.indexOf(search) == -1) {
				this.search+='&'+search;
			};
			var htmls=decodeURI(this.href).trim();
	    	sessionStorage.setItem('html',htmls);
	    	setItem();
	    };
   }
    function setItem(){
        sessionStorage.setItem('oldHtml',newHtml);
    }
    localStorage.setItem('videoHTML','open');
    //退出时初始化sessionStorage状态
    $(".clearStorage").mouseup(function(){
		sessionStorage.clear();
		clearStorage();
    });
	function clearStorage() {
		localStorage.getItem('videoHTML')&&localStorage.removeItem('videoHTML');
	}
    //消息框显示隐藏
    var info =  $('.D2_rt_menber .D2_rt_ul_info');//消息显示触发元素
    var infos = $('.D2_rt_menber .D2_rt_infos');//消息内容
    var imgInfo =  $('.D2_rt_menber .D2_rt_ul_info img');//消息显示触发元素的图标
    info.hover(function(){
    	infos.stop().toggle(500);
		imgInfo.attr('src','../images/infos.png')
    },function(){
    	infos.stop().toggle(1000);
    })
    infos.hover(function(e){
        infos.stop().toggle(500);
    },function(e){
    	infos.stop().toggle(1000);
    })
});
