$(function(){
	// 菜单栏
	$('.dropdown').tendina({
		animate: true,
		speed: 500,
		openCallback: function($clickedEl) {
			
		},
		closeCallback: function($clickedEl) {
			
		}
	});
	//列表项被选中时的状态
	$(".dropdown > li > a").on('mouseenter',function(){
		$(this).addClass("hover_active");
	}).on('mouseleave',function(){
		$(this).removeClass("hover_active");
	}).on('click',function(){
		if($(this).hasClass("click_active")){
			$(this).removeClass("click_active");
		}else{
			$(".dropdown > li > a.click_active").removeClass("click_active");
			$(this).addClass("click_active");
		}	
	});
	//二级列表项被选中时的状态
	$(".dropdown > li  > ul > li > a").on('mouseenter',function(){
		$(this).addClass("hover2_active");
	}).on('mouseleave',function(){
		$(this).removeClass("hover2_active");
	}).on('click',function(){
		if($(this).siblings().length  > 0){
			$(this).closest("li").siblings().find("a").removeClass("hover2_active click2_active");
			$(this).addClass("click2_active");
		}else{
			$(".dropdown > li > ul > li > a").removeClass("hover2_active click2_active");
			$(this).addClass("click2_active");
		}
		if($(this).siblings().length  == 0){
			$(".dropdown > li > ul li >ul li > a").removeClass("hover3_active click3_active");
		}
	});
	//三级列表项被选中时的状态
	/*$(".dropdown > li  > ul > li > ul > li > a").on('mouseenter',function(){
		$(this).addClass("hover3_active");
	}).on('mouseleave',function(){
		$(this).removeClass("hover3_active");
	}).on('click',function(){
		$(".dropdown > li > ul > li > a").removeClass("hover2_active click2_active");
		$(".dropdown > li > ul li >ul li > a").removeClass("hover3_active click3_active");
		$(this).addClass("click3_active");
	});*/
});