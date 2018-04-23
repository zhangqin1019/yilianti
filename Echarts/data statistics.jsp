<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
      <%@include file="/tag.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>
		<link rel="stylesheet" type="text/css" href="${ ctx}/Echarts/css/font-awesome.min.css">
		<link rel="stylesheet" href="${ ctx}/Echarts/css/animsition.min.css" />
		<link rel="stylesheet" href="${ ctx}/Echarts/css/drop-down.css" />
		<link rel="stylesheet" href="${ ctx}/Echarts/css/common.css" />
		<link rel="stylesheet" href="${ ctx}/Echarts/css/system.css" />
		<link rel="stylesheet" type="text/css" href="${ ctx}/Echarts/css/chartData.css">
	</head>

	<body>
		<div class="data_wrap" id="data_wrap" style="background: #efeff5; width: auto; padding: 10px; overflow: hidden;">
			<div class="animsition">
				<div id="echarts" style="width: 100%; overflow: hidden;">
					<div id="main" style="height:350px; width: 49.67%; float: left;"></div>
					<div id="main2" style="height:350px; width: 49.67%; float: left;"></div>
					<div id="main3" style="height:350px; width: 49.67%; float: left; border-top: 10px solid #efeff5;"></div>
					<div id="main4" style="height:350px; width: 49.67%; float: left; border-top: 10px solid #efeff5;"></div>
					<div id="main5" style="height:350px; width: 49.67%; float: left; border-top: 10px solid #efeff5;"></div>
					<div id="main6" style="height:350px; width: 49.67%; float: left; border-top: 10px solid #efeff5;"></div>
					<div id="main7" style="height:350px; width: 49.67%; float: left; border-top: 10px solid #efeff5;"></div>
					<div id="main8" style="height:350px; width: 49.67%; float: left; border-top: 10px solid #efeff5;"></div>
					<div id="main9" style="height:350px; width: 49.67%; float: left; border-top: 10px solid #efeff5;"></div>
					<div id="main10" style="height:350px; width: 49.67%; float: left; border-top: 10px solid #efeff5;"></div>
				</div>
			</div>
		</div>

		<script src="${ ctx}/Echarts/js/jquery-1.10.2.js"></script>
		<script src="${ ctx}/Echarts/js/jquery1.11.0-ui.min.js"></script>
		<script src="${ ctx}/Echarts/js/select-widget-min.js"></script>
		<script src="${ ctx}/Echarts/js/jquery.animsition.min.js"></script>
		<script src="${ ctx}/Echarts/js/echarts.min.js"></script>
		<script src="${ ctx}/Echarts/js/macarons.js"></script>
		<script src="${ ctx}/Echarts/js/common.js"></script>
		<script type="text/javascript" src="${ ctx}/Echarts/js/chartData.js"></script>
	</body>
</html>