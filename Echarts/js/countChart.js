$(document).ready(function() {
	var mydata;
	var item = $('#echarts').children('div');
	var eWarp = $('#data_wrap');
	var search = location.search.split('=')[1];
	var hash = location.hash.split('=')[1];
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
	setTimeout(function() {
		var height = document.documentElement.clientHeight || document.body.clientHeight;
//		var height = window.parent.h;
		console.log(height);
		wpadd = parseFloat(eWarp.css('padding-left')) * 2;
//		eWarp.css('height', height - wpadd);
		var myChart = echarts.init(document.getElementById('main' + (+search + 1)), 'macarons');
		json = JSON.parse(localStorage.getItem('countjson' + (+search + 1)));
		createChart(hash, myChart, json)
		item.eq(search).siblings().css('display', 'none');
	}, 30);

	window.onresize = function() {
		location.reload();
	};

	function createChart(type, obj, json) {
		//数据函数
		var echart = {
			pie: function() {
				return {
					title: {
						text: json.title,
						x: 10,
						y: 10
					},
					tooltip: {
						trigger: 'itme',
						formatter: function(data) {
							return data.name + '：' + data.value + '</br>占比：' + data.percent + '%' + '</br>';
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
								lang: [json.title, '返回'],
								optionToContent: function(opt) {
									var legendData = opt.legend[0].data;
									var series = opt.series;
									var table = '<table style="width:100%;text-align:center"><tbody>';
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
							for(var i = 0; i < json.data.length; i++) {
								arr.push(json.data[i].name)
							}
							return arr;
						})()
					},
					series: [{
						name: json.title,
						type: 'pie',
						center: ['50%', '42%'],
						radius: ['40%', '60%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								formatter: function(params) {
									var str = params.name;
									var length = Math.ceil(str.length / 2);
									return str.substr(0, length) + '\n' + params.name.substr(length);
								},
								position: 'center',
								textStyle: {
									fontSize: '20',
									fontWeight: 'bold'
								}
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
						data: json.data
					}]
				};
			},
			bar: function() {
				return {
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
						text: json.title,
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
								lang: [json.title, '返回'],
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
						data: json.itemName
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
							formatter: function(params) {
								//						var str = params+'';
								var length = Math.ceil(params.length / 2);
								return params.substr(0, length) + '\n' + params.substr(length);
							},
						},
						data: json.xAxis
					},
					yAxis: {
						type: 'value',
						boundaryGap: [0, '10%']
					},
					series: [{
							name: json.itemName[0],
							type: 'bar',
							smooth: true,
							barMaxWidth: 30,
							data: [json.itemData[0][0],json.itemData[1][0]]
						},
						{
							name: json.itemName[1],
							type: 'bar',
							smooth: true,
							barMaxWidth: 30,
							data: [json.itemData[0][1],json.itemData[1][1 ]]
						}
					],
				};
			}
		}
		// 使用刚指定的配置项和数据显示图表。
		obj.setOption(echart[type]());
	}
});