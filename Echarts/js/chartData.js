$(document).ready(function() {
	var minWidth = 772;
	var onoff = true;
	function style() {
		var getwidth = $('html').width();
		var getpadding = parseFloat($('#data_wrap').css('padding'));
		var contWidth = getwidth - getpadding * 2;
		$('#echarts').children().each(function(i) {
			if(i % 2 == 1) {
				$('#echarts').children().eq(i).css("float", " right");
			}
		});
		if(getwidth >= minWidth) {  
			
			$('#data_wrap').css('width', contWidth);
		} else {
			$('#data_wrap').css('width', minWidth);
		};
		var oneWidth = getwidth >= minWidth ? parseFloat(($('#echarts').width() - getpadding) / 2) : (minWidth-getpadding)/2;
		$('#echarts').children().css({
			"width": oneWidth,
			'background': '#fff'
		});
		if($('html').width() != getwidth) {
			return style();
		};
		setTimeout(createEchart, 30);
	};
	style();
	window.onresize = function() {
		onoff = localStorage.getItem('onoff');
		if($('html').width() < minWidth) {
			localStorage.setItem('onoff','1');
		}else{
			localStorage.setItem('onoff','');
		}
		if (!onoff) {
			location.reload();
		}
	};
	//初始化切换
	$(".animsition").animsition({
		inClass: 'fade-in-right',
		outClass: 'fade-out',
		inDuration: 1500, //动画时间
		outDuration: 800,
		linkElement: '.animsition-link',
		loading: true,
		loadingParentElement: 'body', //animsition wrapper element
		loadingClass: 'animsition-loading',
		unSupportCss: ['animation-duration',
			'-webkit-animation-duration',
			'-o-animation-duration'
		],
		overlay: false,
		overlayClass: 'animsition-overlay-slide',
		overlayParentElement: 'body'
	});
	// 基于准备好的dom，初始化echarts实例
	var myChart = echarts.init(document.getElementById('main'), 'macarons');
	var myChart2 = echarts.init(document.getElementById('main2'), 'macarons');
	var myChart3 = echarts.init(document.getElementById('main3'), 'macarons');
	var myChart4 = echarts.init(document.getElementById('main4'), 'macarons');
	var myChart5 = echarts.init(document.getElementById('main5'), 'macarons');
	var myChart6 = echarts.init(document.getElementById('main6'), 'macarons');
	var myChart7 = echarts.init(document.getElementById('main7'), 'macarons');
	var myChart8 = echarts.init(document.getElementById('main8'), 'macarons');
	var myChart9 = echarts.init(document.getElementById('main9'), 'macarons');
	var myChart10 = echarts.init(document.getElementById('main10'), 'macarons');
	//数据函数
	var option = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
				shadowStyle: {
					color: "rgba(150,150,150,0.3)",
					width: "auto",
					type: "default",
					size: "auto"
				}
			}
		},
		//标题
		title: {
			text: '医院医生资源统计',
			x: 10,
			y: 10
		},
		//工具栏设置
		toolbox: {
			show: true,
			x: 'right',
			y: 10,
			padding: [5, 30, 5, 5],
			feature: {
				mark: {
					show: true
				},
				dataView: {
					show: true,
					readOnly: true,
					lang: ['医院医生资源统计', '关闭'],
					optionToContent: function(opt) {
						var axisData = opt.xAxis[0].data;
						var series = opt.series;
						var table = '<table style="width:100%;text-align:center"><thead><tr>' +
							'<th>时间</th>' +
							'<th>' + series[0].name + '</th>' +
							'<th>' + series[1].name + '</th>' +
							'</tr></thead><tbody>';
						for(var i = 0, l = axisData.length; i < l; i++) {
							table += '<tr>' +
								'<td>' + axisData[i] + '</td>' +
								'<td>' + series[0].data[i] + '</td>' +
								'<td>' + series[1].data[i] + '</td>' +
								'</tr>';
						}
						table += '</tbody></table>';
						return table;
					}
				},
				magicType: {
					show: true,
					type: ['line', 'bar', 'stack', 'tiled']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: true,
		legend: {
			orient: 'horizontal',
			x: 'center',
			y: 'bottom',
			padding: 10,
			itemGap: 4,
			selectedMode: true,
			data: ['中级职称', '高级职称']
		},
		grid: {
			x: '12%',
			y: '20%',
			x2: '8%',
			y2: '20%'
		},
		xAxis: {
			type: 'category',
			boundaryGap: true,
			axisLabel: {
				show: true,
				interval: 'auto',
					formatter: function (params) {
//						var str = params+'';
						var length = Math.ceil(params.length/2);
						return params.substr(0,length) + '\n' + params.substr(length);
					},
			},
			data: ['广东江门第一人民医院', '广州增城口腔医院', '广州从化口腔医院']
		},
		yAxis: {
			type: 'value',
			boundaryGap: [0, '10%']
		},
		series: [{
				name: '中级职称',
				type: 'bar',
				smooth: true,
				barMaxWidth: 30,
				data: [100, 80, 50]
			},
			{
				name: '高级职称',
				type: 'bar',
				smooth: true,
				barMaxWidth: 30,
				data: [60, 40, 30]
			}
		],
	};
	var option2 = {
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow',
				shadowStyle: {
					color: "rgba(150,150,150,0.3)",
					width: "auto",
					type: "default",
					size: "auto"
				}
			}
		},
		title: {
			text: '医院月门诊量统计',
			x: 10,
			y: 10
		},
		toolbox: {
			show: true,
			x: 'right',
			y: 10,
			padding: [5, 30, 5, 5],
			feature: {
				mark: {
					show: true
				},
				dataView: {
					show: true,
					readOnly: true,
					lang: ['医院月门诊量统计', '关闭'],
					optionToContent: function(opt) {
						var axisData = opt.xAxis[0].data;
						var series = opt.series;
						var table = '<table style="width:100%;text-align:center"><thead><tr>' +
							'<th>时间</th>' +
							'<th>' + series[0].name + '</th>' +
							'<th>' + series[1].name + '</th>' +
							'<th>' + series[2].name + '</th>' +
							'</tr></thead><tbody>';
						for(var i = 0, l = axisData.length; i < l; i++) {
							table += '<tr>' +
								'<td>' + axisData[i] + '</td>' +
								'<td>' + series[0].data[i] + '</td>' +
								'<td>' + series[1].data[i] + '</td>' +
								'<td>' + series[2].data[i] + '</td>' +
								'</tr>';
						}
						table += '</tbody></table>';
						return table;
					}
				},
				magicType: {
					show: true,
					type: ['line', 'bar', 'stack', 'tiled']
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		legend: {
			orient: 'horizontal',
			x: 'center',
			y: 'bottom',
			itemGap: 4,
			padding: 10,
			selectedMode: 'multiple',
			data: ['广东江门第一人民医院', '广州增城口腔医院', '广州从化口腔医院']
		},
		calculable: true,
		grid: {
			x: '14%',
			y: '20%',
			x2: '8%',
			y2: '20%'
		},
		xAxis: {
			type: 'category',
			boundaryGap: true,
			data: ['2017/05', '2017/06', '2017/07']
		},
		yAxis: {
			type: 'value',
			boundaryGap: [0, '10%']
		},
		series: [{
				name: '广东江门第一人民医院',
				type: 'bar',
				smooth: true,
				barMaxWidth: 30,
				data: [5000, 4000, 6000]
			},
			{
				name: '广州增城口腔医院',
				type: 'bar',
				smooth: true,
				barMaxWidth: 30,
				data: [3000, 5000, 2000]
			},
			{
				name: '广州从化口腔医院',
				type: 'bar',
				smooth: true,
				barMaxWidth: 30,
				data: [2000, 7000, 8000]
			}
		]
	};
	var option3 = {
		title: {
			text: '医院开放床位统计',
			x: 10,
			y: 10
		},
		tooltip: {
			trigger: 'itme',
			formatter: function(data) {
				return data.name + '</br>' + '床位：' + data.value + '</br>占比：' + data.percent + '%' + '</br>';
			}
		},
		toolbox: {
			show: true,
			x: 'right',
			y: 10,
			padding: [5, 30, 5, 5],
			feature: {
				dataView: {
					show: true,
					readOnly: true,
					lang: ['医院开放床位统计', '关闭'],
					optionToContent: function(opt) {
						console.log(opt)
						var legendData = opt.legend[0].data;
						console.log(legendData)
						var series = opt.series;
						var table = '<table style="width:100%;text-align:center"><thead><tr>' +
							'<th>医院</th>' +
							'<th>' + series[0].name + '</th>' +
							'</tr></thead><tbody>';
						for(var i = 0, l = legendData.length; i < l; i++) {
							table += '<tr>' +
								'<td>' + legendData[i] + '</td>' +
								'<td>' + series[0].data[i].value + '</td>' +
								'</tr>';
						}
						table += '</tbody></table>';
						return table;
					}
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		legend: {
			orient: 'horizontal',
			x: 'center',
			y: 'bottom',
			padding: 10,
			itemGap: 4,
			selectedMode: true,
			data: ['广东江门第一人民医院', '广州增城口腔医院', '广州从化口腔医院']
		},
		series: [{
			name: '医院开放床位统计',
			type: 'pie',
			center: ['50%', '50%'],
			radius: ['0%', '50%'],
			avoidLabelOverlap: false,
			label: {
				normal: {
					show: true,
					formatter: function (params) {
						var str = params.name;
						var length = Math.ceil(str.length/2);
						return str.substr(0,length) + '\n' + params.name.substr(length);
					},
					position: 'outer',
				},
				emphasis: {
					show: true,
				}
			},
			labelLine: {
				normal: {
					show: false,
					length: 10
				}
			},
			data: [{
					value: 800,
					name: '广东江门第一人民医院'
				},
				{
					value: 650,
					name: '广州增城口腔医院'
				},
				{
					value: 400,
					name: '广州从化口腔医院'
				}
			]
		}]
	};
	var option4 = {
		title: {
			text: '床位利用率统计(%)',
			x: 10,
			y: 10
		},
		tooltip: {
			trigger: 'axis',
			formatter: function(data) {
				return data[0].name + '<br />' + data[0].seriesName + '：' + data[0].value + '%';
			}
		},
		toolbox: {
			show: true,
			x: 'right',
			y: 10,
			padding: [5, 30, 5, 5],
			feature: {
				mark: {
					show: true
				},
				dataView: {
					show: true,
					readOnly: true,
					lang: ['床位利用率统计(%)', '关闭'],
					optionToContent: function(opt) {
						console.log(opt)
						var legendData = opt.legend[0].data;
						console.log(legendData)
						var series = opt.series;
						var table = '<table style="width:100%;text-align:center"><thead><tr>' +
							'<th>医院</th>' +
							'<th>' + series[0].name + '</th>' +
							'</tr></thead><tbody>';
						for(var i = 0, l = legendData.length; i < l; i++) {
							table += '<tr>' +
								'<td>' + legendData[i] + '</td>' +
								'<td>' + series[0].data[i] + '%</td>' +
								'</tr>';
						}
						table += '</tbody></table>';
						return table;
					}
				},
				restore: {
					show: true
				},
				saveAsImage: {
					show: true
				}
			}
		},
		calculable: true,
		xAxis: {
			type: 'category',
			boundaryGap: true,
			axisLabel: {
				show: true,
				interval: 'auto',
					formatter: function (params) {
//						var str = params+'';
						var length = Math.ceil(params.length/2);
						return params.substr(0,length) + '\n' + params.substr(length);
					},
			},
			data: ['广东江门第一人民医院', '广州增城口腔医院', '广州从化口腔医院']
		},
		yAxis: {
			type: 'value',
			boundaryGap: [0, '100%']
		},
		legend: {
			orient: 'horizontal',
			x: 'center',
			y: 'bottom',
			padding: 10,
			itemGap: 4,
			selectedMode: true,
			data: ['广东江门第一人民医院', '广州增城口腔医院', '广州从化口腔医院']
		},
		series: [{
			name: '床位利用率统计',
			type: 'line',
			smooth: true,
			data: [89, 71, 60]
		}]
	};

	function pieEcharts(titles, itmes, datas) {
		return {
			title: {
				text: titles,
				x: 10,
				y: 10
			},
			tooltip: {
				trigger: 'itme',
				formatter: function(data) {
					return data.name + '</br>' + itmes + '：' + data.value + '</br>占比：' + data.percent + '%' + '</br>';
				}
			},
			toolbox: {
				show: true,
				x: 'right',
				y: 10,
				padding: [5, 30, 5, 5],
				feature: {
					dataView: {
						show: true,
						readOnly: true,
						lang: [titles, '关闭'],
						optionToContent: function(opt) {
							console.log(opt)
							var legendData = opt.legend[0].data;
							console.log(legendData)
							var series = opt.series;
							var table = '<table style="width:100%;text-align:center"><thead><tr>' +
								'<th>医院</th>' +
								'<th>' + series[0].name + '</th>' +
								'</tr></thead><tbody>';
							for(var i = 0, l = legendData.length; i < l; i++) {
								table += '<tr>' +
									'<td>' + legendData[i] + '</td>' +
									'<td>' + series[0].data[i].value + '</td>' +
									'</tr>';
							}
							table += '</tbody></table>';
							return table;
						}
					},
					restore: {
						show: true
					},
					saveAsImage: {
						show: true
					}
				}
			},
			legend: {
				orient: 'horizontal',
				x: 'center',
				y: 'bottom',
				padding: 10,
				itemGap: 4,
				selectedMode: true,
				data: (function() {
					var arr = [];
					for(var i = 0; i < datas.length; i++) {
						arr.push(datas[i].name)
					};
					return arr;
				})()
			},
			series: [{
				name: titles,
				type: 'pie',
				center: ['50%', '50%'],
				radius: ['0%', '50%'],
				avoidLabelOverlap: false,
				label: {
					normal: {
						show: true,
						formatter: function (params) {
							var str = params.name;
							var length = Math.ceil(str.length/2);
							return str.substr(0,length) + '\n' + params.name.substr(length);
						},
						position: 'outer',
					},
					emphasis: {
						show: true,
					}
				},
				labelLine: {
					normal: {
						show: false,
						length: 10
					}
				},
				data: datas
			}]
		};
	};
	var option5 = pieEcharts('医院总资产统计', '总资产(万)', [{
			value: 45000,
			name: '广东江门第一人民医院'
		},
		{
			value: 37000,
			name: '广州增城口腔医院'
		},
		{
			value: 29000,
			name: '广州从化口腔医院'
		}
	]);
	var option6 = pieEcharts('医院总负债统计', '总负债(万)', [{
			value: 45000,
			name: '广东江门第一人民医院'
		},
		{
			value: 37000,
			name: '广州增城口腔医院'
		},
		{
			value: 29000,
			name: '广州从化口腔医院'
		}
	]);
	var option7 = pieEcharts('医院总收入统计', '总收入(万)', [{
			value: 3800,
			name: '广东江门第一人民医院'
		},
		{
			value: 2200,
			name: '广州增城口腔医院'
		},
		{
			value: 3500,
			name: '广州从化口腔医院'
		}
	]);
	var option8 = pieEcharts('财政补贴收入', '补贴收入(万)', [{
			value: 2600,
			name: '广东江门第一人民医院'
		},
		{
			value: 3000,
			name: '广州增城口腔医院'
		},
		{
			value: 1500,
			name: '广州从化口腔医院'
		}
	]);
	var option9 = pieEcharts('应收账款', '应收账款(万)', [{
			value: 5000,
			name: '广东江门第一人民医院'
		},
		{
			value: 6000,
			name: '广州增城口腔医院'
		},
		{
			value: 4000,
			name: '广州从化口腔医院'
		}
	]);
	var option10 = pieEcharts('贷款统计', '贷款(万)', [{
			value: 15000,
			name: '广东江门第一人民医院'
		},
		{
			value: 9000,
			name: '广州增城口腔医院'
		},
		{
			value: 6000,
			name: '广州从化口腔医院'
		}
	]);

	function createEchart() {
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
		myChart2.setOption(option2);
		myChart3.setOption(option3);
		myChart4.setOption(option4);
		myChart5.setOption(option5);
		myChart6.setOption(option6);
		myChart7.setOption(option7);
		myChart8.setOption(option8);
		myChart9.setOption(option9);
		myChart10.setOption(option10);
	};
});