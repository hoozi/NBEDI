
;(function(win, undefined){
	"use strict";

	var $ = win.$,
		componentName = "ediSelect",
		defaults = {
			debug: true,
			autoSelector:".ui_select",
			header: ">.ui_select_text",
			content: ">.ui_select_options",
			headerActive: "active",
			canChange: true,
			icon: false,
			afterEvent: $.noop
		}

	function log() {
		if (window.console && console.log){
	        console.log('[ediSelect] ' + Array.prototype.join.call(arguments, ' ') );
		}
	}
	var Select = (function(){
		return function(element, options) {
			var _this = this;
			this.log = log;
			this.element = element;
			this.canShow = true;
			this._setOptions(options);
			this.header = $(this.opts.header,this.element);
			this.content = $(this.opts.content,this.element);
			this.item = this.content.children();
			this._init();
			this.header.on("click", function(e){
				_this._eventHandler(_this);
				e.stopPropagation();
			});
			$(document).on("click", function(e){
				_this.canShow = false;
				_this._eventHandler(_this);
			});
			this.item.on("click", function(e) {
				_this._itemHandler(_this,this);
			})
		}	
	})();
	Select.prototype = {
		constructor: Select,
		_init: function(){
			var $element = $(this.element),
				icon = this.opts.icon,
				$header = this.header,
				$content = this.content;
			this._position();
			$content.attr("tabindex",0)
			if(icon && $(".i10",$header).length<=0) {
				$header.append("<i class='i10'></i>");
			}
		},
		_setOptions: function(opts) {
			this.opts = $.extend(true, defaults, this._getOpts(), opts || {});
		},
		_getOpts: function() {
			var $element = $(this.element),
				val,optionsName,
				data = $element.data();
			if(this.opts && !this.opts.debug || data.selectDebug===false) {
				this.log = $.noop;
			}
			this.log("---edi select init---","element:["+this.element.className+" ("+this.element.tagName.toLowerCase()+")]");
			if(data) {
				for(var k in data) {
					if(data.hasOwnProperty(k) && /^select[A-Z]+/.test(k)) {
						val = data[k];
						optionsName = k.match(/^select(.*)/)[1].replace(/^[A-Z]/, function(s){
							return (s||'').toLowerCase();
						});
						this.log(optionsName+':', val);
						data[optionsName] = val;
					}
				}	
			}
			return data;
		},
		_position: function(){
			var $element = $(this.element),
				$content = this.content,
				contentHeight = $content.height(),
				htmlHeight = Math.max($("html").height(),$(window).height()),
				pos = 0,
				top = $content.offset().top;

			if(top+contentHeight>htmlHeight) {
				pos = 30;
			} else {
				pos = -contentHeight;
			}

			$content.css("bottom",pos);

			
		},
		_eventHandler: function(_this) {
			if(_this.canShow) {
				_this.content.css("visibility","visible");
				_this.log("----show");
			} else {
				_this.content.css("visibility","hidden");
				_this.log("----hide");
			}
			_this.canShow = !_this.canShow;
		},
		_itemHandler: function(_this,el){
			var $this = $(el);
			if(_this.opts.canChange) {
				_this.header.find(".ui_select_default").text($this.find("a").text());
				_this.log("----select ",$this.find("a").text())
			}
		}
	}
	$.fn[componentName]	= function(options) {
		return this.each(function(){
			if(!$.data(this,componentName)) {
				return $.data(this,componentName,new Select(this,options))
			}
		})
	}
	$(function(){
		$(defaults.autoSelector).ediSelect();
	});	
})(this);