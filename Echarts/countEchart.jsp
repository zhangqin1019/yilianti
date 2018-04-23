<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
      <%@include file="/tag.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html style="width:100%;height:100%;">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>
		<link rel="stylesheet" href="${ ctx}/Echarts/css/animsition.min.css" />
		<link rel="stylesheet" href="${ ctx}/Echarts/css/drop-down.css" />
		<link rel="stylesheet" href="${ ctx}/Echarts/css/common.css" />
		<link rel="stylesheet" href="${ ctx}/Echarts/css/system.css" />
		<script src="${ ctx}/Echarts/js/jquery-1.10.2.js"></script>
		<script src="${ ctx}/Echarts/js/jquery1.11.0-ui.min.js"></script>
		<script src="${ ctx}/Echarts/js/select-widget-min.js"></script>
		<script src="${ ctx}/Echarts/js/jquery.animsition.min.js"></script>
		<script src="${ ctx}/Echarts/js/echarts.min.js"></script>
		<script src="${ ctx}/Echarts/js/macarons.js"></script>
		<script src="${ ctx}/Echarts/js/common.js"></script>
		<script src="${ ctx}/Echarts/js/countChart.js" type="text/javascript" charset="utf-8"></script>
		<style>
			#data_wrap{ width: auto !important; height:100% !important;}
		</style>
	</head>
	<body style="width:100%;height:100%;">
		<div class="data_wrap" id="data_wrap" style="background: #efeff5; padding: 10px; overflow: hidden;box-sizing:border-box;">
			<div class="animsition" style="height: 100%; overflow: hidden;">
				<div id="echarts" style="width: 100%; height:100%; background: #fff; overflow: hidden;">
					<div id="main1" style="height:100%; "></div>
					<div id="main2" style="height:100%; "></div>
					<div id="main3" style="height:100%; "></div>
					<div id="main4" style="height:100%; "></div>
					<div id="main5" style="height:100%; "></div>
					<div id="main6" style="height:100%; "></div>
					<div id="main7" style="height:100%; "></div>
					<div id="main8" style="height:100%; "></div>
					<div id="main9" style="height:100%; "></div>
					<div id="main10" style="height:100%; "></div>
					<div id="main11" style="height:100%; "></div>
				</div>
			</div>
		</div>
	</body>
</html>