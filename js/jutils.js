/*

Author: DwiZZel
Date: 00-00-0000
Version: V.1.0 BUILD 001
Notes:	

	crash line: /"olivier" +++ \(|\)|\[|\]|\^|\$|\{|\}|\?|\||\.|\=|\+|\/|\-|\* === '' <>/
		
*/

window.JUtils =
	window.JUtils ||
	function() {
		//extend abstract methods
		$.extend(this, new ADebug(arguments[0].debug));

		this.className = arguments.callee.name;
		this.args = arguments[0];

		//---------------------------------------------------------------------
		this.init = function() {
			this.jlang = this.args.jlang;
		};

		//----------------------------------------------------------------------------------------------
		this.contains = function(b, arr) {
			var i = arr.length;
			while (i--) {
				if (b === arr[i]) {
					return true;
				}
			}
			return false;
		};

		//----------------------------------------------------------------------------------------------
		this.countArray = function(arr) {
			var i = 0;
			for (var o in arr) {
				i++;
			}
			return i;
		};

		//----------------------------------------------------------------------------------------------
		this.toUpper = function(str) {
			return str.toUpperCase();
		};

		//----------------------------------------------------------------------------------------------
		this.toLower = function(str) {
			return str.toLowerCase();
		};

		//----------------------------------------------------------------------------------------------
		this.isElementVisible = function(el, part) {
			var t = $(el);
			var w = $(window);
			var viewTop = w.scrollTop();
			var viewBottom = viewTop + w.height();
			var top = t.offset().top;
			var bottom = top + t.height();
			var compareTop = part === true ? bottom : top;
			var compareBottom = part === true ? top : bottom;

			return compareBottom <= viewBottom && compareTop >= viewTop;
		};

		//----------------------------------------------------------------------------------------------
		this.pregQuote = function(str, delimiter) {
			str = String(str).replace(
				/\(|\)|\[|\]|\^|\$|\{|\}|\?|\||\.|\=|\+|\-|\*/gi,
				function modifyRegExSpecChar(x) {
					return "\\" + x;
				}
			);
			str = String(str).replace(/\//gi, "\\/");
			return str;
		};

		//----------------------------------------------------------------------------------------------
		this.javascriptFormat = function(str) {
			return String(str).replace(/"/g, "&quot;");
		};

		//----------------------------------------------------------------------------------------------
		this.quoteReplace = function(str) {
			return String(str).replace(/"/g, '"');
		};

		//----------------------------------------------------------------------------------------------
		this.htmlspecialchars_decode = function(string, quote_style) {
			var optTemp = 0,
				i = 0,
				noquotes = false;
			if (typeof quote_style === "undefined") {
				quote_style = 2;
			}
			string = string
				.toString()
				.replace(/&lt;/g, "<")
				.replace(/&gt;/g, ">");
			var OPTS = {
				ENT_NOQUOTES: 0,
				ENT_HTML_QUOTE_SINGLE: 1,
				ENT_HTML_QUOTE_DOUBLE: 2,
				ENT_COMPAT: 2,
				ENT_QUOTES: 3,
				ENT_IGNORE: 4
			};
			if (quote_style === 0) {
				noquotes = true;
			}
			if (typeof quote_style !== "number") {
				quote_style = [].concat(quote_style);
				for (i = 0; i < quote_style.length; i++) {
					if (OPTS[quote_style[i]] === 0) {
						noquotes = true;
					} else if (OPTS[quote_style[i]]) {
						optTemp = optTemp | OPTS[quote_style[i]];
					}
				}
				quote_style = optTemp;
			}
			if (quote_style & OPTS.ENT_HTML_QUOTE_SINGLE) {
				string = string.replace(/&#0*39;/g, "'");
			}
			if (!noquotes) {
				string = string.replace(/&quot;/g, '"');
			}
			string = string.replace(/&amp;/g, "&");
			return string;
		};

		//----------------------------------------------------------------------------------------------
		this.ucfirst = function(str) {
			return str.charAt(0).toUpperCase() + str.slice(1);
		};

		//----------------------------------------------------------
		//inject code in them for debugging
		this.setClassHook();
	};

//EOF
