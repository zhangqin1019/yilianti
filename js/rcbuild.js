$(function () {
	var height = document.documentElement.clientHeight-308;
	var wrap= $('#wrap');
	var next_btn = $('#wrap .next-btn');
	var table = $('#wrap .jdt-item form .active-none');
	var jdt_btn = $('#wrap .jdt-btn');
	var agreeBtn = $('#wrap .agree');
	var aclass = ['two-step','three-step','four-step'];
	wrap.css('min-height',height);
	//wrap.children('div').eq(0).siblings('div').css('display','none');
	next_btn.click(function () {
		$(this).parents('.jdt-item').next().css('display','block').siblings('.jdt-item').css('display','none');
	});
//	next_btn.eq(next_btn.length-2).click(function () {
//		$(this).parents('.jdt-item').next().css('display','block').siblings().css('display','none');
//	});
	jdt_btn.each(function (i) {
		jdt_btn.eq(i).click(function () {
			console.log($(this).index('.jbt-btn'))
			$(this).parents('.jdt-item').siblings('ul').addClass(aclass[$(this).index('.jbt-btn')]).children('li').eq($(this).index('.jbt-btn')+1).addClass('lis');
		});
	});
	agreeBtn.click(function (){
		$(this).parents('.jdt-item').children('.next-btn').removeAttr('disabled');
	}).next('label').children('input').click(function () {
		$(this).parents('.jdt-item').children('.next-btn').attr('disabled',true);
	});
	//提交申请
	var objSearch = getRequest(location.search);
	$("#submit").click(function(){
		var hide = $('.jdt-item')
		var aclass = ['two-step','three-step'];
		 $.ajax({
	        url: $.ip+'/member/applyInsert',
	        type: "post",
	        data:$('#form').serialize()+'&hospitalId='+objSearch.hospitalId,
	        dataType:'json',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
	        success: function(data) { 
	        	console.log(data);
	            if(data.msg==1){
	            	hide.eq(0).css('display','none').next('.jdt-item').css('display','block');
	            }else{
	            	Showbo.Msg.alert("添加失败！");
	            }
	        },
	        errer: function(data){
	        	Showbo.Msg.alert(data.msg)
	        }
	   });
	});
	
	
	//提交申请
	var objSearch = getRequest(location.search);
	$("#submit1").click(function(){
		 $.ajax({
	        url: $.ip+'/member/applyPlan',
	        type: "post",
	        data:{"memberContract":"1"},
	        dataType:"json",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
	        success: function(data) {
	            if(data.msg){
	            	var hide = $('.jdt-item')
	        		var aclass = ['two-step','three-step'];
	            	hide.eq(2).css('display','none').next('.jdt-item').css('display','block');
					hide.eq(2).siblings('ul').addClass(aclass[0]).children('li').eq(1).addClass('lis');
	            }else{
	            	alert("网络异常！");
	            }
	        },
	        errer: function(data){
	        	alert(data.msg)
	        }
	   });
	});
    $('.infos').eq(0).click(function (){
		$.ajax({
			url:$.ip+'/member/applysAjax?hospitalId='+objSearch.hospitalId,
			type:'post',
		    dataType:"json",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			success:function(data){
				if(data.estatus!="1"){
					$('#consentNo').css('display','block').siblings('p').css('display','none');
				}else{
					$('#consent').css('display','block').siblings('p').css('display','none').siblings('div').css('display','block');
				}
			}
			
		})
	})
	 $('.infos').eq(1).click(function (){
		$.ajax({
			url:$.ip+'/member/applysAjax?hospitalId='+objSearch.hospitalId,
			type:'post',
		    dataType:"json",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			success:function(data){
				if(data.manageContract=="9"){
					$('#contractNo').css('display','block').siblings('p').css('display','none');
				}else if(data.manageContract=="0"){
					$('#contract').css('display','block').siblings('p').css('display','none');
				}else{
					$('#contractYes').css('display','block').siblings('p').css('display','none').siblings('div').css('display','block');
				}
			}
			
		})
	})
	
});