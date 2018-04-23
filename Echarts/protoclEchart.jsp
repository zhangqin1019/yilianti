<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
     <%@include file="/tag.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
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
		<script src="${ ctx}/Echarts/js/protoclChart.js" type="text/javascript" charset="utf-8"></script>
	</head>
	<body>
		<div class="data_wrap" id="data_wrap" style="background: #efeff5; width: auto; padding: 10px; overflow: hidden; ">
			<div class="animsition">
				<div id="echarts" style="width: 100%; background: #fff; overflow: hidden;">
					<div id="main" style="height:330px; "></div>
				</div>
			</div>
		</div>
	</body>
</html>