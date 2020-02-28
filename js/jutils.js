/*

Author: DwiZZel
Date: 00-00-0000
Version: V.1.0 BUILD 001
Notes:	

	crash line: /"olivier" +++ \(|\)|\[|\]|\^|\$|\{|\}|\?|\||\.|\=|\+|\/|\-|\* === '' <>/
		
*/

    
function JUtils(){
	
	this.className = arguments.callee.name;
	this.args = arguments[0];
	this.jdebug = this.args.jdebug;
	
	//---------------------------------------------------------------------
	this.init = function(){
		this.debug('init()', this.args);
		//
		this.jlang = this.args.jlang;
		//
		return this;
		};	
	
	//----------------------------------------------------------------------------------------------	
	this.contains = function(b, arr){
		this.debug('contains()', b, arr);		
		var i = arr.length;
		while(i--){
			if(b === arr[i]){
				return true;		
				}
			}
		return false;
		}
	
	//----------------------------------------------------------------------------------------------	
	this.countArray = function(arr){
		this.debug('countArray()', arr);	
		var i = 0;
		for(var o in arr){
			i++;
			}
		return i;	
		}	
	
	//----------------------------------------------------------------------------------------------	
	this.toUpper = function(str){
		this.debug('toUpper()', str);			
		return str.toUpperCase();
		}

	//----------------------------------------------------------------------------------------------	
	this.toLower = function(str){
		this.debug('toLower()', str);		
		return str.toLowerCase();
		}

	//----------------------------------------------------------------------------------------------	
	this.isElementVisible = function(el, part){
		this.debug('isElementVisible()', el, part);	
		var t = $(el);
		var w = $(window);
	    var viewTop = w.scrollTop();
	    var viewBottom = viewTop + w.height();
	    var top = t.offset().top;
	    var bottom = top + t.height();
	    var compareTop = part === true ? bottom : top;
	    var compareBottom = part === true ? top : bottom;
		
		return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
		}

	//----------------------------------------------------------------------------------------------	
	this.pregQuote = function(str, delimiter){
		this.debug('pregQuote()', str, delimiter);
		str = String(str).replace(/\(|\)|\[|\]|\^|\$|\{|\}|\?|\||\.|\=|\+|\-|\*/gi, function modifyRegExSpecChar(x){return "\\" + x;});
		str = String(str).replace(/\//gi, "\\/");
		return str;
		}

	//----------------------------------------------------------------------------------------------	
	this.javascriptFormat = function(str){
		this.debug('javascriptFormat()', str);
		return String(str).replace(/"/g, '&quot;');
		}

	//----------------------------------------------------------------------------------------------	
	this.quoteReplace = function(str){
		this.debug('quoteReplace()', str);	
		return String(str).replace(/"/g, '\"');
		}

	//----------------------------------------------------------------------------------------------	
	this.htmlspecialchars_decode = function(string, quote_style){
		this.debug('htmlspecialchars_decode()', string, quote_style);	
		var optTemp = 0, i = 0,  noquotes = false;
		if(typeof quote_style === 'undefined'){
			quote_style = 2;
			}
		string = string.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>');
		var OPTS = {
			'ENT_NOQUOTES': 0,
			'ENT_HTML_QUOTE_SINGLE': 1,
			'ENT_HTML_QUOTE_DOUBLE': 2,
			'ENT_COMPAT': 2,
			'ENT_QUOTES': 3,
			'ENT_IGNORE': 4
			};
		if(quote_style === 0){
			noquotes = true;
			}
		if(typeof quote_style !== 'number'){ 
			quote_style = [].concat(quote_style);
			for(i=0; i<quote_style.length; i++) {
				if(OPTS[quote_style[i]] === 0){
					noquotes = true;
				}else if(OPTS[quote_style[i]]) {
					optTemp = optTemp | OPTS[quote_style[i]];
					}
				}
			quote_style = optTemp;
			}
		if(quote_style & OPTS.ENT_HTML_QUOTE_SINGLE){
			string = string.replace(/&#0*39;/g, "'"); 
			}
		if(!noquotes){
			string = string.replace(/&quot;/g, '"');
			}
		string = string.replace(/&amp;/g, '&');
		return string;
		}

	//----------------------------------------------------------------------------------------------	
	this.ucfirst = function(str){
		this.debug('ucfirst()', str);	
		return str.charAt(0).toUpperCase() + str.slice(1);
		}

	//----------------------------------------------------------------------------------------------------------------------*
	this.debug = function(){
		if(typeof(this.jdebug) == 'object'){
			if(arguments.length == 1){	
				this.jdebug.show(this.className + '::' + arguments[0]);
			}else{
				this.jdebug.showObject(this.className + '::' + arguments[0], arguments);
				}
			}
		};	
		
	}