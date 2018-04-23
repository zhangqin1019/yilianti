(function($) {
	$.fn.extend({
		popup: function(options) {
			options = $.extend({
				event:'click',
				header:true,
				btn: false
			}, options);
			var html, confirmBtn, closeBtn, popupBtn, popupbox, confirm, close, self = $(this);
			header = options.header.cont || (function() {
				if(options.header && (typeof options.header === 'boolean')) {
					return '<h2>' + options.title + '</h2>';
				};
				return '';
			})();
			btns = (function() {
				if(options.btn && (typeof options.btn === 'boolean')) {
					return `<div class="popbtn">
								<button class="popbtn-info popbtn-pub popup-confirm" >确定</button>
								<button class="popbtn-info popbtn-pub popup-close" >关闭</button>
							</div>`;
				};
				return '';
			})();
			popupbox = $(`<div class="popupbox">
							<div class="popwrap">
								<div class="popheader">` +
									header +
									`<span class="popup-close"></span>
								</div>
								<div class="popcont">
									<div class="popcontent">` + (options.content || '') + `</div>` +
									btns +
								`</div>
							</div>
						</div>`);
			self.append(popupbox);
			confirmBtn = self.find('.popup-confirm');
			closeBtn = self.find('.popup-close');
			popupBtn = self.find('.popupBtn');
			popupBtn.bind(options.event,function(e) { //打开弹出层界面
				e.stopPropagation();
				$(this).closest(self).find('.popupbox').css('display', 'block');
				typeof options.popupBtn == 'function' && options.popupBtn(this);
				return false;
			})
			confirmBtn.click(function(e) { //确认提交
				e.stopPropagation();
				var returnval = null;
				typeof options.confirmBtn == 'function' && (returnval = options.confirmBtn(this));
				if (returnval != undefined && !returnval) {
					return false;
				}
				$(this).closest('.popupbox').css('display', 'none');
				return false;
			})
			closeBtn.click(function(e) { //取消关闭
				e.stopPropagation();
				var returnval = null;
				typeof options.closeBtn == 'function' && (returnval = options.closeBtn(this));
				if (returnval != undefined && !returnval) {
					return false;
				}
				$(this).closest('.popupbox').css('display', 'none');
				return false;
			})
			typeof options.callback == 'function' && options.callback(this);
			return this;
		}
	});
})(jQuery)