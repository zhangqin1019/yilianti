$(function(){
	//判断是否登录
	loginVerify();
	var $regularlyItems=$(".regularly-item-list li");
	$regularlyItems.each(function(){
		var _$this=$(this);
		_$this.children(".flip-box").eq(0).addClass("out").removeClass("in");
	    setTimeout(function() {
	    	_$this.find(".flip-box").show().eq(1).addClass("in").removeClass("out");
	    	_$this.children(".flip-box").eq(0).hide();
	    }, 225);
	});
	$regularlyItems.hover(function(){
		var _$this=$(this);
	    _$this.children(".flip-box").eq(1).addClass("out").removeClass("in");
	    setTimeout(function() {
	    	_$this.find(".flip-box").show().eq(0).addClass("in").removeClass("out");
	    	_$this.children(".flip-box").eq(1).hide();
	    }, 3000);
	},function(){
		var _$this=$(this);
		_$this.children(".flip-box").eq(0).addClass("out").removeClass("in");
	    setTimeout(function() {
	    	_$this.find(".flip-box").show().eq(1).addClass("in").removeClass("out");
	    	_$this.children(".flip-box").eq(0).hide();
	    }, 3000);
	});
	$(".flip-lists").click(function(){
		$(this).find("a")[0].click();
	});
	var search = decodeURI(location.search.split('?')[1]).trim();
	var hoverLink = $('.hoverLink');
	hoverLink.click(function () {
		var aSearch = decodeURI(this.search).trim();
		if (aSearch=='') {
			this.search = search;
		} else if (aSearch.indexOf(search) == -1) {
			this.search += '&'+ search;
		}
	})
});
