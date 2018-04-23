$(document).ready(function() {
	var mydata;
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
	setTimeout(function() {
		mydata = JSON.parse(localStorage.getItem('menudata'));
		console.log(mydata)
		//数据函数
		var option = {
			title: {
				text: '基础数据统计图',
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
						lang: ['基础数据统计图', '返回'],
						optionToContent: function(opt) {
							console.log(opt)
							var legendData = opt.legend[0].data;
							console.log(legendData)
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
					for(var i = 0; i < mydata.length; i++) {
						arr.push(mydata[i].name)
					}
					return arr;
				})()
			},
			series: [{
				name: '基础数据统计图',
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
				data: mydata
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}, 1000);
	window.onresize = function() {
		window.location.reload();
	};
});