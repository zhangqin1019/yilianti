var onoffconsole = $.onoffconsole, //console开关
	ossfilestatu = new Object(),
	listurl = new Object();

function upload(selectfiles, container, ossfile) {
	ossfilestatu[ossfile + 'statu'] = 0;
	listurl[ossfile] = new Array();
	var accessid = 'LTAIFSHcWupSdU9C';
	var accesskey = 'HefnQDo4RGM9NXpWMACA62K9UAs1MR';
	var host = 'https://imuts.oss-cn-shenzhen.aliyuncs.com';

	var g_dirname = ''
	var g_object_name = ''
	var g_object_name_type = ''
	var now = timestamp = Date.parse(new Date()) / 1000;
	var policyText = {
		"expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
		"conditions": [
			["content-length-range", 0, 2048000000] // 设置上传文件的大小限制
		]
	};

	var policyBase64 = Base64.encode(JSON.stringify(policyText));
	var message = policyBase64;
	var bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, {
		asBytes: true
	});
	var signature = Crypto.util.bytesToBase64(bytes);

	var stopfiles = document.getElementById("stopfiles") || {};
	stopfiles.addEventListener && stopfiles.addEventListener('click', function() { //暂停上传队列文件
		uploader.stop();
	})

	var selectall = document.getElementById(container).getElementsByClassName("selectall")[0] || {};
	selectall.addEventListener && selectall.addEventListener('click', function() { //全选上传队列文件
		var ipts = document.getElementById(ossfile).getElementsByTagName('input');
		plupload.each(ipts, function(ipt) {
			ipt.checked = true;
		})
	})

	var inverse = document.getElementById(container).getElementsByClassName("inverse")[0] || {};
	inverse.addEventListener && inverse.addEventListener('click', function() { //反选上传队列文件
		var ipts = document.getElementById(ossfile).getElementsByTagName('input');
		plupload.each(ipts, function(ipt) {
			if(ipt.checked) {
				ipt.checked = false;
			} else {
				ipt.checked = true;
			}
		})
	})

	var uncheck = document.getElementById(container).getElementsByClassName("uncheck")[0] || {};
	uncheck.addEventListener && uncheck.addEventListener('click', function() { //不选上传队列文件
		var ipts = document.getElementById(ossfile).getElementsByTagName('input');
		plupload.each(ipts, function(ipt) {
			ipt.checked = false;
		})
	})

	var del = document.getElementById(container).getElementsByClassName("delete")[0] || {};
	del.addEventListener && del.addEventListener('click', function() { //删除上传队列文件
		var ipts = document.getElementById(ossfile).getElementsByTagName('input'),
			arrIpt = [];
		plupload.each(ipts, function(ipt) {
			arrIpt.push(ipt);
		})
		plupload.each(arrIpt, function(ipt) {
			var files = uploader.files;
			for(var i = 0; i < files.length; i++) {
				if(ipt.checked && files[i].id == ipt.value) {
					uploader.removeFile(files[i]);
					uploader.oldFiles.splice(i, 1);
					break;
				}
			}
		})
	})

	function check_object_radio() { //选择本地名上传还是随机名上传
		//local_name 本地文件名		random_name 随机文件名
		var filename = 'local_name';
		g_object_name_type = filename;
	}

	function get_dirname() { //选择文件夹
		var doctorNo = document.getElementById("doctorNo1").value || '';
		var patientNo = document.getElementById("patientNo1").value || '';
		dir = doctorNo && patientNo ? 'img/upload/' + doctorNo + '_' + patientNo : '';
		if(dir != '' && dir.indexOf('/') != dir.length - 1) {
			dir = dir + '/'
		}
		//alert(dir)
		g_dirname = dir
	}

	function random_string(len) {　　
		len = len || 32;　　
		var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';　　
		var maxPos = chars.length;
		var pwd = '';　　
		for(i = 0; i < len; i++) {　　
			pwd += chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd;
	}

	function get_suffix(filename) {
		pos = filename.lastIndexOf('.')
		suffix = ''
		if(pos != -1) {
			suffix = filename.substring(pos)
		}
		return suffix;
	}

	function calculate_object_name(filename) {
		if(g_object_name_type == 'local_name') {
			g_object_name += "${filename}"
		} else if(g_object_name_type == 'random_name') {
			suffix = get_suffix(filename)
			g_object_name = g_dirname + random_string(10) + suffix
		}
		return ''
	}

	function get_uploaded_object_name(filename) {
		if(g_object_name_type == 'local_name') {
			tmp_name = g_object_name
			tmp_name = tmp_name.replace("${filename}", filename);
			return tmp_name
		} else if(g_object_name_type == 'random_name') {
			return g_object_name
		}
	}

	function set_upload_param(up, filename, ret) {
		g_object_name = g_dirname;
		if(filename != '') {
			suffix = get_suffix(filename)
			calculate_object_name(filename)
		}
		new_multipart_params = {
			'key': g_object_name,
			'policy': policyBase64,
			'OSSAccessKeyId': accessid,
			'success_action_status': '200', //让服务端返回200,不然，默认会返回204
			'signature': signature,
		};

		up.setOption({
			'url': host,
			'multipart_params': new_multipart_params
		});

		up.start();
	}

	function hasFile(files, file) {
		for(var i = 0; i < files.length; i++) {
			if(files[i].name == file.name && files[i].size == file.size && files[i].type == file.type && files[i].origSize == file.origSize) {
				return true;
			}
		}
		return false;
	}
	var maxfilesize = '2048mb';
	var uploader = new plupload.Uploader({ //实例化对象
		runtimes: 'html5,flash,silverlight,html4',
		browse_button: selectfiles,
		//multi_selection: false,
		container: document.getElementById(container),
		flash_swf_url: 'Moxie.swf',
		silverlight_xap_url: 'Moxie.xap',
		url: 'http://imuts.oss-cn-shenzhen.aliyuncs.com',
		'filters': {
			max_file_size: maxfilesize
		},

		init: {
			PostInit: function(up) { //初始化页面
				up.oldFiles = [];
				document.getElementById(ossfile).innerHTML = '';
				document.getElementById('postfiles').addEventListener('click', function() {
					var patientNo = document.getElementById("patientNo1").value;
					var doctorNo = document.getElementById("doctorNo1").value;
					if(patientNo != "" && doctorNo != "" && patientNo != null && doctorNo != null) {
						$.ajax({
							url: $.ip + "/member/judgeNo",
							type: 'post',
							dataType: 'json',
							data: {
								"patientNo": patientNo,
								"doctorNo": doctorNo
							},
							success: function(data) {
								if(data.msg) {
									$("#spanss").html("");
									listurl.patientId = patientNo;
									listurl.conId = data.conId;
									set_upload_param(uploader, '', false);
									//										document.getElementById("formupload").submit();
									setTimeout(function() { //防止与正则冲突延迟
									}, 0)
								} else {
									$("#spanss").html("查看编号是否正确！");
								}
							}
						});
					} else {
						//alert("请先填写基本信息,若已有请输入医生编号以及患者编号！");
						$("#spanss").html("请先填写基本信息,若已有请输入医生编号以及患者编号！");
					}
					return false;
				});
				document.getElementById(selectfiles).addEventListener('click', function() {
					if(up.errfilename) {
						up.errfilename.splice(0, up.errfilename.length);
					};
				});
			},

			FilesAdded: function(up, files) { //添加上传文件
				var strName = '',
					arrfiles = [];
				plupload.each(files, function(file) {
					var upfiles = up.oldFiles;
					if(!hasFile(upfiles, file)) {
						if(file.name.length <= 20) {
							up.oldFiles.push(file);
							ossfileele = document.getElementById(ossfile);
							ossfileele.innerHTML += '<div id="' + file.id + '">' +
								'<input type="checkbox" name="checkbox" value=' + file.id + ' />' +
								'<p title="' + file.name + ' (' + plupload.formatSize(file.size) + ')">' +
								file.name + ' (' + plupload.formatSize(file.size) + ')' +
								'</p>' +
								'<b></b>' +
								'<div class="progress">' +
								'<div class="progress-bar" style="width: 0%"></div>' +
								'</div>' +
								'</div>';
						} else {
							arrfiles.push(file);
							strName += file.name + '、<br/>';
						}
					} else {
						up.removeFile(file);
					}
				});
				var ossfileeles = document.getElementById(ossfile).children;
				if(ossfileeles) {
					plupload.each(ossfileeles, function(ele) {
						ele.addEventListener('click', function(e) {
							var ipt = this.getElementsByTagName('input')[0];
							checked(ipt);
						});
						var ipt = ele.getElementsByTagName('input')[0];
						ipt.addEventListener('click', function(e) {
							checked(ipt);
						})
					})

					function checked(ipt) {
						if(ipt.checked) {
							ipt.checked = false;
						} else {
							ipt.checked = true;
						}
					}
				}
				if(strName) {
					plupload.each(arrfiles, function(file) {
						up.removeFile(file);
					});
					Showbo.Msg.alert('以下文件名字超过20个字符:<br/>' + strName.replace(/(、<br\/>)$/, ''));
				}
			},

			FilesRemoved: function(up, files) {
				plupload.each(files, function(file) {
					var delEle = document.getElementById(file.id);
					delEle && delEle.parentNode.removeChild(delEle);
				})
			},

			BeforeUpload: function(up, file) { //上传之前获取文件信息
				check_object_radio();
				get_dirname();
				set_upload_param(up, file.name, false);
			},

			UploadProgress: function(up, file) { //上传进度
				var d = document.getElementById(file.id);
				if(d) {
					d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
					var prog = d.getElementsByTagName('div')[0];
					var progBar = prog.getElementsByTagName('div')[0];
					progBar.style.width = 2 * file.percent + 'px';
					progBar.setAttribute('aria-valuenow', file.percent);
				}
			},

			FileUploaded: function(up, file, info) { //返回成功和失败的信息
				if(info.status == 200) {
					listurl[ossfile].push(g_dirname + file.name);
					//						var oldFiles = up.oldFiles;
					//						for(var i = 0; i < oldFiles.length; i++) {
					//							if(oldFiles[i].id == file.id) {
					//								up.removeFile(oldFiles[i]);
					//								up.oldFiles.splice(i, 1);
					//								break;
					//							}
					//						}
				} else {
					document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
				}
			},

			UploadComplete: function(up, files) { //所有文件上传完成触发
				ossfilestatu[ossfile + 'statu'] = 200;
				window[ossfile + 'statu'] = 200;
				upjson(up, files);
			},

			Error: function(up, err) { //返回错误信息
				if(err.code == -600) {
					up.errfilename = up.errfilename ? up.errfilename : new Array();
					up.errfilename.push(err.file.name);
					Showbo.Msg.alert('以下文件超过上传大小(' + maxfilesize + '):<br/>' + up.errfilename.join('、<br/>').replace(/(、<br\/>)$/, ''));
				}
			}
		}
	});

	uploader.init();
}

function upjson(up, files) {
	var str = 1;
	for(statu in ossfilestatu) {
		str *= ossfilestatu[statu];
	}
	onoffconsole && console.log(ossfilestatu);
	onoffconsole && console.log(str);
	onoffconsole && console.log(Number(str));
	onoffconsole && console.log(Boolean(Number(str)));
	if(str) {
		var json = JSON.stringify(listurl);
		for(statu in ossfilestatu) {
			ossfilestatu[statu] = 0;
		}
		$.ajax({
			url: $.ip + "/consu/borderUpload",
			type: 'post',
			data: json,
			dataType: 'json',
			contentType: 'application/json',
			success: function(data) {
				onoffconsole && console.log(data);
				if(data.boo) {
					onoffconsole && console.log(!up.total.failed && !up.total.queued && up.total.uploaded);
					if(!up.total.failed && !up.total.queued && up.total.uploaded) {
						Showbo.Msg.alert("文件上传成功!");
						if(data.pacsurl && data.pacsurl.length) {
							$.ajax({
								url: $.ip + "/consu/analysisDicom",
								type: 'post',
								dataType: 'json',
								data: {
									"conId": listurl.conId
								},
								xhrFields: {
									withCredentials: true
								},
								crossDomain: true,
								success: function(data) {

								}
							});
						}
					}
					onoffconsole && console.log(listurl);
					for(attr in listurl) {
						onoffconsole && console.log(listurl[attr]);
						(typeof listurl[attr]) === 'object' && listurl[attr].splice(0, listurl[attr].length);
					}
					onoffconsole && console.log(listurl);
				}
			}
		});
	}
}