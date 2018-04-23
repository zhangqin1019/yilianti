(function () {
	var onoffconsole = $.onoffconsole;//console开关
    String.prototype.temp = function(obj) {
        return this.replace(/\$\w+\$/gi, function(matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return(returns + "") == "undefined"||(returns + "") == "null" ? "" : returns;
        });
    };
    String.prototype.tempself = function(obj) {
        return this.replace(/\$\w+\$/gi, function(matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return(returns + "") == "undefined"||(returns + "") == "null" ? "$"+ matchs.replace(/\$/g, "") + "$": returns;
        });
    };
    var Loaddata = function (ele) {
    	return new Loaddata.fn.model(ele);
    };
    
    Loaddata.fn = Loaddata.prototype = {
    	constructor: Loaddata,
    	model: function (ele) {
			var $this = this;
	        this.modelarr = $('<div class="hide"></div>');
			$.ajax({
				type:"get",
				url:"../modeltable.html",
				async:false,
				success:function (data) {
					$this.modelarr.html(data);
				}
			});
	        return this;
		}
	};
	
	Loaddata.fn.model.prototype = Loaddata.fn;
	Loaddata.extend = Loaddata.fn.extend = function () {
		var target=arguments[0],i=1,length=arguments.length,options;
		if(i === length) {
			target = this;
			i -= 1
		}
		for(; i < length; i += 1) {
			if((options = arguments[i]) != null) {
				for(attr in options) {
					target[attr] = options[attr];
				}
			}
		}
        return target;
    };
	Loaddata.extend({
		href : decodeURI(location.href),
		search : decodeURI(location.search),
		hash : decodeURI(location.hash),
	});
	Loaddata.extend({
		arrHref : Loaddata.href.split('/'),
        objSearch : getRequest(Loaddata.search),
		objHash : getRequest(Loaddata.hash),
		years : {},
		months : {},
		dates : {},
		imgsrcs : {},
		loadobj : {},
		btssort : function (arr) {
			arr.sort(function (a,b) {
				return b-a;
			});
		},
		nowDate: fnnowDate()
    });
	Loaddata.extend({
		htmlDoc : Loaddata.arrHref[Loaddata.arrHref.length - 1].split(/\?|\#/)[0],
		imgloadmd : function (data,htmlmd) {
			onoffconsole&&console.log(data);
			var table = $('.'+htmlmd),
				htmlList = '',
				htmlTemp = this.modelarr.children('#examineurl').val(),
				years = Loaddata.years[htmlmd] = [],
				months = Loaddata.months[htmlmd] = [],
				dates = Loaddata.dates[htmlmd] = [],
				imgsrcs = Loaddata.imgsrcs[htmlmd] = [],
				obj = Loaddata.loadobj[htmlmd] = {
					'data':{},
					'str':{
						'yearlist': '',
						'monthlist': '',
						'examineTab': '',
						'examineImg': '',
						'idyear': htmlmd + 'year',
						'idmonth': htmlmd + 'month',
						'idexamineTab': htmlmd + 'examineTab',
						'idexamineImg': htmlmd + 'examineImg',
						'idImgload': htmlmd
					}
				};
			//生成多级数组
			//years数组
			data&&data.forEach(function (data) {
				year = data.uploaddate.split('-')[0];
				onoffconsole&&console.log(years.includes(year));
				if (!years.includes(year)){
					years.push(year);
					months.push([]);
					dates.push([]);
					imgsrcs.push([]);
					Loaddata.btssort(years);
				};
			});
			onoffconsole&&console.log(years);
			//months数组
			data&&data.forEach(function (data) {
				year = data.uploaddate.split('-')[0];
				month = data.uploaddate.split('-')[1];
				var index = years.indexOf(year);
				onoffconsole&&console.log(years.includes(month));
				if (index != -1 && !months[index].includes(month)){
					months[index].push(month);
					dates[index].push([]);
					imgsrcs[index].push([]);
					Loaddata.btssort(months[index]);
				};
			});
			onoffconsole&&console.log(months);
			//dates数组
			data&&data.forEach(function (data) {
				var idxs = [];
				year = data.uploaddate.split('-')[0];
				month = data.uploaddate.split('-')[1];
				idxs.push(years.indexOf(year));
				idxs.push(months[idxs[0]].indexOf(month));
				var getDate = years[idxs[0]]+'-'+months[idxs[0]][idxs[1]],
					listDate = data.uploaddate.split(' ')[0],
					target = dates[idxs[0]][idxs[1]];
				if (listDate.indexOf(getDate) != -1 && !target.includes(listDate)) {
					onoffconsole&&console.log('listDate.indexOf(getDate)');
					target.push(listDate);
					imgsrcs[idxs[0]][idxs[1]].push([]);
					Loaddata.btssort(target);
				}
			});
			onoffconsole&&console.log(dates);
			//imgsrcs数组
			data&&data.forEach(function (data) {
				var idxs = [];
				year = data.uploaddate.split('-')[0];
				month = data.uploaddate.split('-')[1];
				date = data.uploaddate.split(' ')[0],
				idxs.push(years.indexOf(year));
				idxs.push(months[idxs[0]].indexOf(month));
				idxs.push(dates[idxs[0]][idxs[1]].indexOf(date));
				var getDate = dates[idxs[0]][idxs[1]][idxs[2]],
					listDate = data.uploaddate.split(' ')[0],
					imgsrc = $.imgurl + data[htmlmd];
					target = imgsrcs[idxs[0]][idxs[1]][idxs[2]];
				if (listDate == getDate) {
					onoffconsole&&console.log('listDate == getDate');
					target.push(imgsrc);
				}
			});
			onoffconsole&&console.log(imgsrcs);
			//渲染数据****** year:years, month:months, date:dates, imgsrc:imgsrcs
			loadimg('');
			htmlList += htmlTemp.temp(obj.str);
			data.length&&table.html(htmlList);
			var elemonth = document.getElementById(obj.str.idyear),
				eleexamineTab = document.getElementById(obj.str.idexamineTab),
				eleexamineImg = document.getElementById(obj.str.idexamineImg);
			getele(elemonth,eleexamineTab,eleexamineImg);
			/*多级联动*/
			/**
			 * @param {Object} arr 必填，数组
			 * @param {NumberString} idxstr 必填，每级的下标
			 * @param {Number} maxstep 必填，最大执行次数
			 * @param {Number} step 必填， 当前执次数
			 * @param {Function} callback 选填，回调函数
			 * @param {String} idxs 不填
			 */
			function loaddata(arr,idxstr,maxstep,step,callback,idxs) {
				idxs = idxs || '';
				arr = arr || [];
				if(!idxstr){idxstr='0';};
				var index = idxstr.substr(step,1)||'0';
				maxstep == 0 ? (nowarr=arr,index='') : (step++,nowarr=arr[index]);
				idxs+=index;
				if(maxstep<=step) {typeof callback == 'function' && callback(nowarr,idxs);return};
				loaddata(nowarr,idxstr,maxstep,step,callback,idxs);
			}
			/**
			 * @param {NumberString} val 
			 */
			function loadimg(val) {
				(val.length == 0 || val=='') && loaddata(years,val,0,0,function (years,value) {//渲染年
					years.forEach(function (data,i) {
						obj.data.year = data;
						obj.str.yearlist += '<option value="'+value+i+'">$year$</option>'.temp(obj.data);
					})
					onoffconsole&&console.log(years);
				});
				(val.length <= 1 || val=='') && loaddata(months,val,1,0,function (months,value) {//渲染月份
					obj.str.monthlist = '';
					months&&months.forEach(function (data,i) {
						obj.data.month = data;
						obj.str.monthlist += '<option value="'+value+i+'">$month$</option>'.temp(obj.data);
					})
					onoffconsole&&console.log(months);
				});
				(val.length <= 2 || val=='') && loaddata(dates,val,2,0,function (dates,value) {//渲染日期
					onoffconsole&&console.log(dates);
					obj.str.examineTab = '';
					dates&&dates.forEach(function (data,i) {
						var current = '';
						if(i == 0) current = 'class="current"';
						obj.data.selectdate = data;
						obj.str.examineTab += '<li '+ current +' data-value="'+value+i+'"><a>$selectdate$</a></li>'.temp(obj.data);
					})
					onoffconsole&&console.log(dates);
				});
				(val.length <= 3 || val=='') && loaddata(imgsrcs,val,3,0,function (imgsrcs,value) {//渲染img
					obj.str.examineImg = '';
					imgsrcs&&imgsrcs.forEach(function (data,i) {
						obj.data.examineurl = data;
						if(i == 0) {
							obj.str.examineImgload = data;
							onoffconsole&&console.log(data);
						}
						obj.str.examineImg += '<dd class="input-pub"><img src="$examineurl$"/></dd>'.temp(obj.data);
					})
					onoffconsole&&console.log(imgsrcs);
				});
			}
			/**
			 * @param {Object} month
			 * @param {Object} examineTab
			 * @param {Object} examineImg
			 * 以上参数均为获取的元素
			 */
			function getele(month,examineTab,examineImg) {
				var eleyear = document.getElementById('year')||false,//获取年select
					mcontainer = month||false,//获取月select
					tabcontainer = examineTab||false,//获取日期容器ul
					urlcontainer = examineImg||false,//获取img容器dl
					examinecanvas = document.getElementById(obj.str.idImgload)||false;//获取canvas
					onoffconsole&&console.log(examineImg);
				eleyear && (eleyear.onchange = function () {//根据年渲染相关的月，日期，img数据
					onoffconsole&&console.log(eleyear.value);
					loadimg(eleyear.value);
					onoffconsole&&console.log(mcontainer);
					mcontainer.innerHTML = obj.str.monthlist;
					tabcontainer.innerHTML = obj.str.examineTab;
					urlcontainer.innerHTML = obj.str.examineImg;
					getele(mcontainer,tabcontainer,urlcontainer);
				});
				mcontainer && (mcontainer.onchange = function () {//根据月渲染相关的日期，img数据
					onoffconsole&&console.log(mcontainer.value);
					loadimg(mcontainer.value);
					tabcontainer.innerHTML = obj.str.examineTab;
					urlcontainer.innerHTML = obj.str.examineImg;
					getele(mcontainer,tabcontainer,urlcontainer);
				});
				examineTab = tabcontainer && tabcontainer.children;//根据日期渲染相关的img数据
				if (examineTab) {
					for (var i=0;i<examineTab.length;i++) {
						examineTab[i].onclick = function () {
							onoffconsole&&console.log(this.dataset.value);
							loadimg(this.dataset.value);
							urlcontainer.innerHTML = obj.str.examineImg;
							getele(mcontainer,tabcontainer,urlcontainer);
						}
					}
				}
				examineImg = urlcontainer && urlcontainer.children;
				if (examineImg) {
					for (var i=0;i<examineImg.length;i++) {
						examineImg[i].onclick = function () {//给相关的img添加点击事件
							//onoffconsole&&console.log(examineImgload);
							//examineImgload.src = this.children[0].src;
							loadImg(examinecanvas,this.children[0].src);//调用public.js的canvas函数渲染到canvas中
							onoffconsole&&console.log(this.children[0]);
						}
					}
					//examineImgload.src=obj.str.examineImgload;
					
					var li = $('.tab_menu > li'),
						index = $('.'+htmlmd).index();
					li.eq(index).click(function (){
						loadImg(examinecanvas,obj.str.examineImgload);//调用public.js的canvas函数渲染到canvas中
					});
				}
				$(".tabExam").Tabs({
					event: 'click'
				});
			}
		}
	});
    /*=========================================================================================*/
    /*==========================================成员医院==========================================*/
	/*=========================================================================================*/
	/*==========================================基础信息==========================================*/
	Loaddata.fn.base = function (callback) {
		var that = this;
		jsonp({
			url: $.ip + '/HospitalInfo/info',
			item: {
				hospitalId:Loaddata.objSearch.hospitalId
			},
			success: function(data) {
				onoffconsole && console.log(data);
				var itemlist = data,
					table = $('.base'),
					htmlList = '',
					htmlTemp = that.modelarr.children('#base').val();
				itemlist.manage = '会诊医院';
				itemlist.categoryHospital = '';
				htmlList = htmlTemp.temp(itemlist);
				table.html(htmlList);
				typeof callback == 'function' && callback.call(that,itemlist);
			}
		})
	}
	/*=========================================================================================*/
	/*==========================================申请信息==========================================*/
	Loaddata.fn.appy = function (callback) {
		var that = this;
		jsonp({
			url: $.ip + '/member/applys',
			item: {
				hospitalId:Loaddata.objSearch.hospitalId
			},
			success: function(data) {
				onoffconsole && console.log(data);
				var itemlist = data;
				typeof callback == 'function' && callback.call(that,itemlist);
			}
		})
	}
    /*=========================================================================================*/
    /*=======================================患者信息列表模块=======================================*/
    Loaddata.fn.tableList = function (pages) {
        var that = this;
        if (Loaddata.htmlDoc=='consultationlist.html'||Loaddata.htmlDoc=='chairlist.html'||Loaddata.htmlDoc=='screenshotList.html'||Loaddata.htmlDoc=='consapplylist.html') {
            jsonp({
                url: $.ip + '/consu/borderQuery',
                item: {
                    'page': pages || 1
                },
                success: function(data) {
					onoffconsole && console.log(data);
                    var itemlist = data.listMap,
                        table =$('.tableList'),
                        th = `<tr>
                            <th>序号</th>
                            <th>会诊编号</th>
                            <th>患者姓名</th>
                            <th>会诊类型</th>
                            <th>会诊日期</th>
                            <th>会诊时间</th>
                            <th>会诊医院</th>
                            <th>当前状态</th>
                            <th>操作</th>
                        </tr>`,
                        htmlList = '',
                        htmlTemp = that.modelarr.children('#list').val();
                    itemlist&&itemlist.forEach(function(data, i) {
                        if(data.statu == 1) {
                            data.statu = '待分配专家';
                        } else if(data.statu == 2) {
                            data.statu = '已分配专家';
                        }
                        if(Loaddata.htmlDoc == 'consultationlist.html') {
                            data.aText = '查看';
							data.aHref = 'userinfo.html?id='+data.conId;
                        } else if(Loaddata.htmlDoc == 'chairlist.html') {
                            data.aText = '开始椅旁';
							data.aHref = 'chair.html?id='+data.conId;
                        } else if(Loaddata.htmlDoc == 'screenshotList.html') {
                            data.aText = '查看存档';
							data.aHref = 'screenshot.html?id='+data.conId;
                        } else if(Loaddata.htmlDoc == 'consapplylist.html') {
                            data.aText = '信息修改';
							data.aHref = 'consdetail.html?id='+data.conId;
                        }
                        data.index = i + 1;
                        htmlList += htmlTemp.temp(data);
                    });
                    table.html(th + htmlList);
                    page.call(that.modelarr,data.pages, '.page');
                }
            })
        } else if (Loaddata.htmlDoc=='referral.html') {
            /*转诊申请详情*/
            jsonp({
                url: $.ip + '/Transfer/transferInfor',
                item: {
                    'page': pages || 1
                },
                success: function(data) {
					onoffconsole && console.log(data);
                    var itemlist = data.listMap,
                        table = $('.tableList'),
                        th = `<tr>
                            <th>转诊编号</th>
                            <th>患者姓名</th>
                            <th>急病/慢病</th>
                            <th>申请医生</th>
                            <th>拟转诊专科</th>
                            <th>申请日期</th>
                            <th>拟转诊日期</th>
                            <th>拟转诊医院</th>
                            <th>当前状态</th>
                            <th>操作</th>
                        </tr>`,
                        htmlList = '',
                        htmlTemp = that.modelarr.children('#referral').val();
                    itemlist&&itemlist.forEach(function(data) {
                        data.aText = '查看';
                        data.aHref = 'referralform.html?id='+data.id;
                        htmlList += htmlTemp.temp(data);
                    });
                    table.html(th + htmlList);
                    page.call(that.modelarr,data.pages, '.page');
                }
            })
        }
    }
    /*=========================================================================================*/
    /*========================================转诊申请详情=========================================*/
    Loaddata.fn.referralform = function (callback) {
        var that = this;
        jsonp({
            url: $.ip + '/Transfer/referralInfo',
            item: {
                id:Loaddata.objSearch.id
            },
            success: function(data) {
				onoffconsole && console.log(data);
                var itemlist = data.map,
                    table = $('.referralForm'),
                    htmlList = '',
                    htmlTemp = that.modelarr.children('#referralForm').val();
                itemlist.textarea = 'textarea';
                htmlList += htmlTemp.temp(itemlist);
                table.html(htmlList);
                typeof callback == 'function' && callback.call(that,itemlist);
            }
        })
    }
	/*=========================================================================================*/
	/*=====================================会诊申请信息修改详情=======================================*/
	Loaddata.fn.consdetail = function (callback) {
		var that = this;
		jsonp({
			url: $.ip + '/consu/borderDetail',
			item: {
				conId:Loaddata.objSearch.id
			},
			success: function(data) {
				onoffconsole && console.log(data);
				var itemlist = data,
					table = $('.consdetail'),
					htmlList = '',
					htmlTemp = that.modelarr.children('#consdetail').val();
				itemlist.groupDate = itemlist.groupDate.split(' ').join('T');
				itemlist.textarea = 'textarea';
				htmlList += htmlTemp.temp(itemlist);
				table.html(htmlList);
				typeof callback == 'function' && callback.call(that,itemlist);
			}
		})
	}
	/*=========================================================================================*/
	/*=======================================远程阅片信息详情========================================*/
	Loaddata.fn.userinfohtml = function (callback) {
		var argument=arguments;
		var that = this;
		jsonp({
			url: $.ip + '/consu/borderGB',
			item: {
				conId:Loaddata.objSearch.id
			},
			success: function(data) {
				onoffconsole && console.log(data);
				var itemlist = data,
					table = $('.userinfohtml'),
					htmlList = '',
					htmlTemp = that.modelarr.children('#consdetail').val();
				itemlist.textarea = 'textarea';
				itemlist.groupDate = itemlist.groupDate+'T'+itemlist.gTime;
				htmlList += htmlTemp.temp(itemlist);
				itemlist.groupDate = itemlist.groupDate.split('T').join(' ');
				table.html(htmlList);
				Loaddata.imgloadmd.call(that,itemlist.imageHistory,'historyurl');
				onoffconsole && console.log(itemlist.imageHistory);
				Loaddata.imgloadmd.call(that,itemlist.imageExamine,'examineurl');
				onoffconsole && console.log(itemlist.imageExamine);
				table = $('.bmodeurl');
				htmlList = '';
				htmlTemp = that.modelarr.children('#bmode').val();
				htmlList += htmlTemp.tempself(itemlist);
				htmlTemp = {bmodeurl:''};
				itemlist.imageBmode.length ? itemlist.imageBmode.forEach(function (data) {
					data.Bmodeurl = $.imgurl + data.Bmodeurl;
					htmlTemp.bmodeurl += `<dd class="input-pub"><img class="popupBtn" src="$Bmodeurl$"/></dd>`.temp(data);
				}) : htmlTemp.bmodeurl = `<dd class="input-pub"><img class="popupBtn" src="../images/caseHistory.png"/></dd>`;
				onoffconsole && console.log(htmlTemp);
				htmlList = htmlList.temp(htmlTemp);
				htmlList&&table.html(htmlList);
				table = $('.xrayurl');
				htmlList = '';
				htmlTemp = that.modelarr.children('#xray').val();
				htmlList += htmlTemp.tempself(itemlist);
				htmlTemp = {xrayurl:''};
				onoffconsole && console.log(itemlist.imageXray);
				itemlist.imageXray.length ? itemlist.imageXray.forEach(function (data) {
					data.Xrayurl = $.imgurl + data.Xrayurl;
					htmlTemp.xrayurl += `<dd class="input-pub"><img class="popupBtn" src="$Xrayurl$"/></dd>`.temp(data);
				}) : htmlTemp.xrayurl = `<dd class="input-pub"><img class="popupBtn" src="../images/caseHistory.png"/></dd>`;
				onoffconsole && console.log(htmlTemp);
				htmlList = htmlList.temp(htmlTemp);
				htmlList&&table.html(htmlList);
				table = $('.telepathology');
				htmlList = '';
				htmlTemp = that.modelarr.children('#telepathology').val();
				htmlList += htmlTemp.temp(itemlist);
				htmlList&&table.html(htmlList);
				typeof callback == 'function' && callback.call(that,itemlist);
			}
		})
	}
	/*=========================================================================================*/
	/*=========================================椅旁会诊===========================================*/
	Loaddata.fn.chair = function (callback) {
		var that = this;
		jsonp({
			url: $.ip + '/consu/memVideo',
			item: {
				conId:Loaddata.objSearch.id
			},
			success: function(data) {
				onoffconsole && console.log('data',data);
				var itemlist = data,
					table = $('.chair'),
					htmlList = '',
					htmlTemp = that.modelarr.children('#videoInfo').val();
				itemlist.manage = '会诊医院';
				itemlist.categoryHospital = '';
				htmlList = htmlTemp.temp(itemlist);
				table.html(htmlList);
				typeof callback == 'function' && callback.call(that,itemlist);
			}
		})
	}
	/*=========================================================================================*/
	/*==========================================视频会诊==========================================*/
	Loaddata.fn.videohtml = function (callback) {
		var that = this;
		jsonp({
			url: $.ip + '/consu/memVideo',
			item: {
				conId:Loaddata.objSearch.id
			},
			success: function(data) {
				onoffconsole && console.log(data);
				var itemlist = data,
					table = $('.videohtml'),
					htmlList = '',
					htmlTemp = that.modelarr.children('#videoInfo').val();
				itemlist.manage = '会诊医院';
				itemlist.categoryHospital = '';
				htmlList = htmlTemp.temp(itemlist);
				table.html(htmlList);
				typeof callback == 'function' && callback.call(that,itemlist);
			}
		})
	}
    /*=========================================================================================*/
    /*==========================================管理医院==========================================*/
	/*=========================================================================================*/
	/*==========================================基础信息==========================================*/
	Loaddata.fn.baseMesage = function (callback,pages) {
		var that = this;
		jsonp({
			url: $.ip + '/manApply/baseMesage',
			item: {
				superiorHospital:Loaddata.objSearch.hospitalId,
				'page':pages||1
			},
			success: function(data) {
				onoffconsole && console.log(data);
				var itemlist = data.listMap,
					table = $('.baseMesage'),
					th = `<tr>
							<td colspan="8" style="font-size: 18px;font-weight: bold;color:#028eed;">已申请加入医联体医院览表</td>
						</tr>
						<tr>
							<th>编号</th>
							<th>申请人名称</th>
							<th>所在地</th>
							<th>医院性质</th>
							<th>医院等级</th>
							<th>医院形式</th>
							<th>申请专科</th>
							<th>备注</th>
						</tr>`,
					htmlList = '',
					htmlTemp = that.modelarr.children('#messagelist').val();
                itemlist&&itemlist.forEach(function(data, i) {
                    data.aText = '详情';
                    data.aHref = 'baseReferral.html?mbhospitalId='+data.hospitalId;
					htmlList = htmlTemp.temp(data);
				})
				table.html(th+htmlList);
				typeof callback == 'function' && callback.call(that,itemlist);
			}
		})
	}
	/*=========================================================================================*/
	/*==========================================基础信息==========================================*/
	Loaddata.fn.baseReferral = function (callback) {
		var that = this;
		jsonp({
			url: $.ip + '/manApply/baseReferral',
			item: {
				hospitalId1:Loaddata.objSearch.mbhospitalId
			},
			success: function(data) {
				onoffconsole && console.log(data);
				var itemlist = data,
					table = $('.baseReferral'),
					htmlList = '',
					htmlTemp = that.modelarr.children('#baseReferral').val();
				htmlList = htmlTemp.temp(itemlist);
				table.html(htmlList);
				typeof callback == 'function' && callback.call(that,itemlist);
			}
		})
	}
	/*=========================================================================================*/
	/*==========================================申请信息==========================================*/
	Loaddata.fn.applyMessage = function (callback,pages) {
		var that = this;
		jsonp({
			url: $.ip + '/manage/applymessage',
			item: {
				hospitalId:Loaddata.objSearch.hospitalId,
				'page':pages||1
			},
			success: function(data) {
				onoffconsole && console.log(data);
                var itemlist = data.listMap,
                table =$('.applyMessage'),
                th = `<tr>
	                    <td colspan="8" style="font-size: 18px;font-weight: bold;color: #028eed;">已提交医联体建设申请医院览表</td>
	                </tr>
	                <tr>
	                    <th>编号</th>
	                    <th>申请人名称</th>
	                    <th>所在地</th>
	                    <th>医院性质</th>
	                    <th>医院等级</th>
	                    <th>医院形式</th>
	                    <th>申请专科</th>
	                    <th>操作</th>
	                </tr>`,
	                htmlList = '',
	                htmlTemp = that.modelarr.children('#messagelist').val();
                itemlist&&itemlist.forEach(function(data) {
                	data.mbhospitalId = data.hospitalId;
                	data.hospitalId = '';
                    data.aText = '详情';
                    data.aHref = 'applyReferral.html?id='+data.applyId+'&mbhospitalId='+data.mbhospitalId;
                    htmlList += htmlTemp.temp(data);
                });
                table.html(th + htmlList);
                page.call(that.modelarr,data.pages, '.page');
				typeof callback == 'function' && callback.call(that,itemlist);
			}
		})
	}
	/*=========================================================================================*/
	/*==========================================申请审核==========================================*/
	Loaddata.fn.applyReferral = function (callback) {
		var that = this;
		jsonp({
			url: $.ip + '/manage/applyReferral',
			item: {
				hospitalId:Loaddata.objSearch.mbhospitalId
			},
			success: function(data) {
				onoffconsole && console.log(data);
				var itemlist = data,
					table = $('.applyReferral'),
					htmlList = '',
					htmlTemp = that.modelarr.children('#applyReferral').val();
				htmlList = htmlTemp.tempself(itemlist);
				htmlList = htmlList.temp(itemlist.listMap[0]);
				table.html(htmlList);
				table = $('.applyReferralIdea'),
				htmlList = '',
				htmlTemp = that.modelarr.children('#applyReferralIdea').val();
				ld.objSearch.textarea = 'textarea';
				htmlList = htmlTemp.temp(ld.objSearch);
				table.html(htmlList);
				typeof callback == 'function' && callback.call(that,itemlist);
			}
		})
	}
    /*=========================================================================================*/
    /*=======================================患者信息列表模块=======================================*/
    Loaddata.fn.mgtableList = function (pages) {
        var that = this;
        if (Loaddata.htmlDoc=='consultationlist.html'||Loaddata.htmlDoc=='chairlist.html') {
            jsonp({
                url: $.ip + '/manCons/manConsInfor',
                item: {
                    'page': pages||1
                },
                success: function(data) {
					onoffconsole && console.log(data);
                    var itemlist = data.listMap,
                        table =$('.mgtableList'),
                        th = `<tr>
                            <th>序号</th>
                            <th>会诊编号</th>
                            <th>患者姓名</th>
                            <th>会诊类型</th>
                            <th>会诊日期</th>
                            <th>会诊时间</th>
                            <th>所属医院</th>
                            <th>当前状态</th>
                            <th>操作</th>
                        </tr>`,
                        htmlList = '',
                        htmlTemp = that.modelarr.children('#list').val();
                    itemlist&&itemlist.forEach(function(data, i) {
                        if(data.statu == 1) {
                            data.statu = '待分配专家';
                        } else if(data.statu == 2) {
                            data.statu = '已分配专家';
                        }
                        if(Loaddata.htmlDoc == 'consultationlist.html') {
                            data.aText = '查看';
							data.aHref = 'telepathology.html?id='+data.conId;
                        } else if(Loaddata.htmlDoc == 'chairlist.html') {
                            data.aText = '开始椅旁';
							data.aHref = 'chair.html?id='+data.conId;
                        }
                        data.index = i + 1;
                        htmlList += htmlTemp.temp(data);
                    });
                    table.html(th + htmlList);
                    page.call(that.modelarr,data.pages, '.page');
                }
            })
        } else if (Loaddata.htmlDoc=='screenshotList.html') {
            /*存档阅片列表*/
            jsonp({
                url: $.ip + '/manCons/screenshotQuery',
                item: {
                    'page': pages||1
                },
                success: function(data) {
					onoffconsole && console.log(data);
                    var itemlist = data.listMap,
                        table = $('.tableList'),
                        th = `<tr>
                            <th>序号</th>
                            <th>会诊编号</th>
                            <th>患者姓名</th>
                            <th>会诊类型</th>
                            <th>会诊日期</th>
                            <th>会诊时间</th>
                            <th>所属医院</th>
                            <th>当前状态</th>
                            <th>操作</th>
                        </tr>`,
                        htmlList = '',
                        htmlTemp = that.modelarr.children('#list').val();
                    itemlist&&itemlist.forEach(function(data,i) {
                    	if(data.statu == 1) {
                            data.statu = '待分配专家';
                        } else if(data.statu == 2) {
                            data.statu = '已分配专家';
                        }
                        data.aText = '查看存档';
                        data.aHref = 'screenshot.html?id='+data.conId;
                        data.index = i + 1;
                        htmlList += htmlTemp.temp(data);
                    });
                    table.html(th + htmlList);
                    page.call(that.modelarr,data.pages, '.page');
                }
            })
        } else if (Loaddata.htmlDoc=='referral.html') {
            /*转诊申请列表*/
            jsonp({
                url: $.ip + '/manTransfer/transferInfor',
                item: {
                    'page': pages||1
                },
                success: function(data) {
					onoffconsole && console.log(data);
                    var itemlist = data.listMap,
                        table = $('.tableList'),
                        th = `<tr>
                            <th>转诊编号</th>
                            <th>患者姓名</th>
                            <th>急病/慢病</th>
                            <th>申请医生</th>
                            <th>拟受理科室</th>
                            <th>申请日期</th>
                            <th>拟转诊日期</th>
                            <th>申请医院</th>
                            <th>当前状态</th>
                            <th>操作</th>
                        </tr>`,
                        htmlList = '',
                        htmlTemp = that.modelarr.children('#referral').val();
                    itemlist&&itemlist.forEach(function(data) {
                        data.aText = '查看';
                        data.aHref = 'referralform.html?id='+data.id;
                        htmlList += htmlTemp.temp(data);
                    });
                    table.html(th + htmlList);
                    page.call(that.modelarr,data.pages, '.page');
                }
            })
        } else if (Loaddata.htmlDoc=='doctor.html') {
            /*医生列表*/
            jsonp({
                url: $.ip + '/docList/manageList',
                item: {
                    'page': pages||1
                },
                success: function(data) {
					onoffconsole && console.log(data);
                    var itemlist = data.listMap,
                        table = $('.tableList'),
                        th = `<tr>
							<th>医生编号</th>
							<th>医生姓名</th>
							<th>专科</th>
							<th>联系电话</th>
							<th>登录次数</th>
							<th>最后登录时间</th>
							<th>账号状态</th>
							<th>操作</th>
						</tr>`,
                        htmlList = '',
                        htmlTemp = that.modelarr.children('#doctor').val();
                    itemlist&&itemlist.forEach(function(data) {
                    	if (data.status=='正常') {
	                        data.aHref = '<a href="doccheck.html?id='+data.docNum+'">查看</a>/<a class="cancel" href="javascript:;">注销</a>';
                       } else {
                    		data.aHref = '已注销';
                       }
                        htmlList += htmlTemp.temp(data);
                    });
                    table.html(th + htmlList);
                    page.call(that.modelarr,data.pages, '.page');
                    itemlist&&itemlist.forEach(function(data2,i) {
                    	$('.cancel').eq(i).click(function () {
                    		onoffconsole && console.log(data2);
	                    	var img = new Image();
	                    	img.src=$.ip+'/delete/dedoc?docNum='+data2.docNum+'&page='+data.pages.currPage;
	                    	location.reload();
	                    });
                    });
                }
            })
        }
    }
    /*=========================================================================================*/
    /*========================================转诊申请审核详情=========================================*/
    Loaddata.fn.mgreferralform = function (callback) {
        var that = this;
        jsonp({
            url: $.ip + '/manTransfer/manreferralInfo',
            item: {
                id:Loaddata.objSearch.id
            },
            success: function(data) {
				onoffconsole && console.log(data);
                var itemlist = data.map,
                    table = $('.referralform'),
                    htmlList = '',
                    htmlTemp = that.modelarr.children('#referralCheck').val();
                itemlist.textarea = 'textarea';
                htmlList += htmlTemp.temp(itemlist);
                table.html(htmlList);
                typeof callback == 'function' && callback.call(that,itemlist);
            }
        })
    }
	/*=========================================================================================*/
	/*=====================================会诊管理信息详情=======================================*/
	Loaddata.fn.mgtelepathology = function (callback) {
		var that = this;
		jsonp({
			url: $.ip + '/manCons/manConsVertical',
			item: {
				conId:Loaddata.objSearch.id
			},
			success: function(data) {
				onoffconsole && console.log(data);
				var itemlist = data,
					table = $('.telepathology'),
					htmlList = '',
					htmlTemp = that.modelarr.children('#info').val();
				htmlList += htmlTemp.temp(itemlist);
				table.html(htmlList);
				Loaddata.imgloadmd.call(that,itemlist.imageHistory,'historyurl');
				onoffconsole && console.log(itemlist.imageHistory);
				Loaddata.imgloadmd.call(that,itemlist.imageExamine,'examineurl');
				onoffconsole && console.log(itemlist.imageExamine);
				table = $('.bmodeurl');
				htmlList = '';
				htmlTemp = that.modelarr.children('#bmode').val();
				htmlList += htmlTemp.tempself(itemlist);
				htmlTemp = {bmodeurl:''};
				itemlist.imageBmode.length ? itemlist.imageBmode.forEach(function (data) {
					data.Bmodeurl = $.imgurl + data.Bmodeurl;
					htmlTemp.bmodeurl += `<dd class="input-pub"><img class="popupBtn" src="$Bmodeurl$"/></dd>`.temp(data);
				}) : htmlTemp.bmodeurl = `<dd class="input-pub"><img class="popupBtn" src="../images/caseHistory.png"/></dd>`;
				onoffconsole && console.log(htmlTemp);
				htmlList = htmlList.temp(htmlTemp);
				htmlList&&table.html(htmlList);
				table = $('.xrayurl');
				htmlList = '';
				htmlTemp = that.modelarr.children('#xray').val();
				htmlList += htmlTemp.tempself(itemlist);
				htmlTemp = {xrayurl:''};
				onoffconsole && console.log(itemlist.imageXray);
				itemlist.imageXray.length ? itemlist.imageXray.forEach(function (data) {
					data.Xrayurl = $.imgurl + data.Xrayurl;
					htmlTemp.xrayurl += `<dd class="input-pub"><img class="popupBtn" src="$Xrayurl$"/></dd>`.temp(data);
				}) : htmlTemp.xrayurl = `<dd class="input-pub"><img class="popupBtn" src="../images/caseHistory.png"/></dd>`;
				onoffconsole && console.log(htmlTemp);
				htmlList = htmlList.temp(htmlTemp);
				htmlList&&table.html(htmlList);
				table = $('.pathology');
				htmlList = '';
				htmlTemp = that.modelarr.children('#telepathology').val();
				htmlList += htmlTemp.temp(itemlist);
				htmlList&&table.html(htmlList);
				typeof callback == 'function' && callback.call(that,itemlist);
			}
		})
	}
	/*=========================================================================================*/
	/*=====================================医生信息修改详情=====================================*/
	Loaddata.fn.doccheck = function (callback) {
		var argument=arguments;
		var that = this;
		jsonp({
			url: $.ip + '/view/viewDoc',
			item: {
				docNum:Loaddata.objSearch.id
			},
			success: function(data) {
				onoffconsole && console.log(data);
				var itemlist = data,
					table = $('.doccheck'),
					htmlList = '',
					htmlTemp = that.modelarr.children('#doccheck').val();
				htmlList += htmlTemp.temp(itemlist);
				table.html(htmlList);
				typeof callback == 'function' && callback.call(that,itemlist);
			}
		})
	}
	/*=========================================================================================*/
	/*=========================================会诊专家=========================================*/
	/*=========================================================================================*/
	/*=======================================专家资料修改=======================================*/
	Loaddata.fn.account = function (callback) {
		var argument=arguments;
		var that = this;
		jsonp({
			url: $.ip + '/docInfo/info',
			item: {
				docNum:Loaddata.objSearch.docNum
			},
			success: function(data) {
				onoffconsole && console.log(data);
				var itemlist = data,
					table = $('.account'),
					htmlList = '',
					htmlTemp = that.modelarr.children('#account').val();
				htmlList += htmlTemp.temp(itemlist);
				table.html(htmlList);
				typeof callback == 'function' && callback.call(that,itemlist);
			}
		})
	}
	/*=========================================================================================*/
    /*=======================================患者信息列表模块=======================================*/
    Loaddata.fn.eptableList = function (pages) {
        var that = this;
        if (Loaddata.htmlDoc=='consultationlist.html'||Loaddata.htmlDoc=='chairlist.html') {
            jsonp({
                url: $.ip + '/docInfo/patientList',
                item: {
                    'page': pages||1
                },
                success: function(data) {
					onoffconsole && console.log(data);
                    var itemlist = data.listMap,
                        table =$('.eptableList'),
                        th = `<tr>
                            <th>序号</th>
                            <th>会诊编号</th>
                            <th>患者姓名</th>
                            <th>会诊类型</th>
                            <th>会诊日期</th>
                            <th>会诊时间</th>
                            <th>所属医院</th>
                            <th>当前状态</th>
                            <th>操作</th>
                        </tr>`,
                        htmlList = '',
                        htmlTemp = that.modelarr.children('#list').val();
                    itemlist&&itemlist.forEach(function(data, i) {
                        if(data.statu == 1) {
                            data.statu = '待分配专家';
                        } else if(data.statu == 2) {
                            data.statu = '已分配专家';
                        }
                        if(Loaddata.htmlDoc == 'consultationlist.html') {
                            data.aText = '查看';
							data.aHref = 'telepathology.html?id='+data.conId;
                        } else if(Loaddata.htmlDoc == 'chairlist.html') {
                            data.aText = '开始椅旁';
							data.aHref = 'chair.html?id='+data.conId;
                        }
                        data.index = i + 1;
                        htmlList += htmlTemp.temp(data);
                    });
                    table.html(th + htmlList);
                    page.call(that.modelarr,data.pages, '.page');
                }
            })
        } else if (Loaddata.htmlDoc=='screenshotList.html') {
            /*存档阅片列表*/
            jsonp({
                url: $.ip + '/docInfo/screenshotList',
                item: {
                    'page': pages||1
                },
                success: function(data) {
					onoffconsole && console.log(data);
                    var itemlist = data.listMap,
                        table = $('.eptableList'),
                        th = `<tr>
                            <th>序号</th>
                            <th>会诊编号</th>
                            <th>患者姓名</th>
                            <th>会诊类型</th>
                            <th>会诊日期</th>
                            <th>会诊时间</th>
                            <th>所属医院</th>
                            <th>当前状态</th>
                            <th>操作</th>
                        </tr>`,
                        htmlList = '',
                        htmlTemp = that.modelarr.children('#list').val();
                    itemlist&&itemlist.forEach(function(data,i) {
                    	if(data.statu == 1) {
                            data.statu = '待分配专家';
                        } else if(data.statu == 2) {
                            data.statu = '已分配专家';
                        }
                        data.aText = '查看存档';
                        data.aHref = 'screenshot.html?id='+data.conId;
                        data.index = i + 1;
                        htmlList += htmlTemp.temp(data);
                    });
                    table.html(th + htmlList);
                    page.call(that.modelarr,data.pages, '.page');
                }
            })
        }
    }
	/*=========================================================================================*/
	/*=====================================会诊清单信息详情=======================================*/
	Loaddata.fn.eptelepathology = function (callback) {
		var that = this;
		jsonp({
			url: $.ip + '/docInfo/patientInfo',
			item: {
				conId:Loaddata.objSearch.id
			},
			success: function(data) {
				onoffconsole && console.log(data);
				var itemlist = data,
					table = $('.telepathology'),
					htmlList = '',
					htmlTemp = that.modelarr.children('#info').val();
				htmlList += htmlTemp.temp(itemlist);
				table.html(htmlList);
				Loaddata.imgloadmd.call(that,itemlist.imageHistory,'historyurl');
				onoffconsole && console.log(itemlist.imageHistory);
				Loaddata.imgloadmd.call(that,itemlist.imageExamine,'examineurl');
				onoffconsole && console.log(itemlist.imageExamine);
				table = $('.bmodeurl');
				htmlList = '';
				htmlTemp = that.modelarr.children('#bmode').val();
				htmlList += htmlTemp.tempself(itemlist);
				htmlTemp = {bmodeurl:''};
				itemlist.imageBmode.length ? itemlist.imageBmode.forEach(function (data) {
					data.Bmodeurl = $.imgurl + data.Bmodeurl;
					htmlTemp.bmodeurl += `<dd class="input-pub"><img class="popupBtn" src="$Bmodeurl$"/></dd>`.temp(data);
				}) : htmlTemp.bmodeurl = `<dd class="input-pub"><img class="popupBtn" src="../images/caseHistory.png"/></dd>`;
				onoffconsole && console.log(htmlTemp);
				htmlList = htmlList.temp(htmlTemp);
				htmlList&&table.html(htmlList);
				table = $('.xrayurl');
				htmlList = '';
				htmlTemp = that.modelarr.children('#xray').val();
				htmlList += htmlTemp.tempself(itemlist);
				htmlTemp = {xrayurl:''};
				onoffconsole && console.log(itemlist.imageXray);
				itemlist.imageXray.length ? itemlist.imageXray.forEach(function (data) {
					data.Xrayurl = $.imgurl + data.Xrayurl;
					htmlTemp.xrayurl += `<dd class="input-pub"><img class="popupBtn" src="$Xrayurl$"/></dd>`.temp(data);
				}) : htmlTemp.xrayurl = `<dd class="input-pub"><img class="popupBtn" src="../images/caseHistory.png"/></dd>`;
				onoffconsole && console.log(htmlTemp);
				htmlList = htmlList.temp(htmlTemp);
				htmlList&&table.html(htmlList);
				table = $('.pathology');
				htmlList = '';
				htmlTemp = that.modelarr.children('#telepathology').val();
				htmlList += htmlTemp.temp(itemlist);
				htmlList&&table.html(htmlList);
				typeof callback == 'function' && callback.call(that,itemlist);
			}
		})
	}
	/*=========================================================================================*/
	/*=========================================椅旁会诊===========================================*/
	Loaddata.fn.epchair = function (callback) {
		var that = this;
		jsonp({
			url: $.ip + '/docInfo/docVideo',
			item: {
				conId:Loaddata.objSearch.id
			},
			success: function(data) {
				onoffconsole && console.log(data);
				var itemlist = data,
					table = $('.epchair'),
					htmlList = '',
					htmlTemp = that.modelarr.children('#videoInfo').val();
				itemlist.manage = '所属医院';
				itemlist.groupHospital = '';
				htmlList = htmlTemp.temp(itemlist);
				table.html(htmlList);
				typeof callback == 'function' && callback.call(that,itemlist);
			}
		})
	}
	/*=========================================================================================*/
	/*==========================================视频会诊==========================================*/
	Loaddata.fn.epvideohtml = function (callback) {
		var that = this;
		jsonp({
			url: $.ip + '/docInfo/docVideo',
			item: {
				conId:Loaddata.objSearch.id
			},
			success: function(data) {
				onoffconsole && console.log(data);
				var itemlist = data,
					table = $('.epvideohtml'),
					htmlList = '',
					htmlTemp = that.modelarr.children('#videoInfo').val();
				itemlist.manage = '所属医院';
				itemlist.groupHospital = '';
				htmlList = htmlTemp.temp(itemlist);
				table.html(htmlList);
				typeof callback == 'function' && callback.call(that,itemlist);
			}
		})
	}



	function fnnowDate() {
		var nDate='',
			year = new Date().getFullYear(),
			month = new Date().getMonth()+1,
			daten = new Date().getDate();
		onoffconsole&&console.log('year:',year);
		onoffconsole&&console.log('month:',month);
		onoffconsole&&console.log('daten:',daten);
		nDate = year + '-' + add0(month) + '-' + add0(daten);
		return nDate;
	}
	function add0(num) {
		if (num<10) {
			num = '0'+num;
		}
		return num;
	}
    function page(data, elestr) {
        var data = data || {};
        	pages = $(elestr),
            htmlPage = '',
            htmlTemp = $(this).children('#page').val();
        data.pageup = data.currPage == 1 ? 1 : data.currPage - 1;
        data.pagedown = data.currPage == data.totalPage ? data.totalPage : data.currPage + 1;
        htmlPage = htmlTemp.temp(data);
        pages.html(htmlPage);
    }
    function jsonp(obj) {
        obj.callback = obj.callback || 'callback';
        obj.fnName = obj.fnName || "jQuery" + ('' + Math.random()).replace(/0\./, '');
        var opation = obj.item || {};
        opation[obj.callback] = obj.fnName;
        var arr = [];
        for(var attr in opation) {
            arr.push(attr + '=' + opation[attr])
        }
        var oS = document.createElement('script');
        oS.src = obj.url + '?' + arr.join('&');
        document.body.appendChild(oS);

        window[obj.fnName] = function(data) {
            obj.success(data);
            oS.remove();
        }
    }
    function getRequest(url) {
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
            }
        } else if (url.indexOf("#") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
            }
        }
       return theRequest;
    }
    window.loadData = window.ld = Loaddata;
    onoffconsole && console.log(loadData());
})(window)
