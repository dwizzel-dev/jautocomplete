/*

Author: DwiZZel
Date: 00-00-0000
Version: V.1.0 BUILD 001

*/

//----------------------------------------------------------------------------------------------------------------------

function JAppz(){
	
	this.className = arguments.callee.name;
	this.args = arguments[0];
	this.jdebug = this.args.jdebug;
	
	//UID	
	this.uid = new Date().getTime();

	//----------------------------------------------------------------------------------------------------------------------
	this.init = function(){
		this.debug('init()', this.args);
		//paths
		this.serverImagePath = this.args.serverImagePath;
		this.serverFormProcess = this.args.serverFormProcess;
		//lang
		this.jlang = new JLang({
			jdebug: this.jdebug,
			path: this.args.serverCashPath,
			lang: this.args.localeLang,
			}).init();
		//utils
		this.jutils = new JUtils({
			jdebug: this.jdebug,	
			jlang: this.jlang,
			}).init(); 
		//server
		if(this.args.isLocaleDb){
			//otherwise the jcomm will get it from the server
			this.jserver = new JServer({
				jdebug: this.jdebug,
				jlang: this.jlang,
				path: this.args.serverCashPath, 
				lang: this.args.localeLang, 
				serverFormProcess: this.serverFormProcess,
				}).init();
			}
		//comm obj	
		this.jcomm = new JComm({
			jdebug: this.jdebug,
			jlang: this.jlang,
			serverService: this.args.serverService,
			sessionId: this.args.sessionId,
			localeLang: this.args.localeLang,
			mainappz:this
			}).init();
		//le search	
		this.jsearch = new JSearch({
			jdebug: this.jdebug,
			jlang: this.jlang,
			mainappz:this, 
			jcomm:this.jcomm
			}).init(); 
		//le autocomplete
		this.jautocomplete = new JAutoComplete({
			jdebug: this.jdebug,
			jlang: this.jlang,
			mainappz:this, 
			uid:this.uid,	
			word:this.args.currentSearchedWord,
			focusoninput:this.args.focusOnInput,	
			}).init(); 
		//container size
		this.containerSize = {
			h:0, 
			w:0
			};	
		//conteneur principal
		this.mainContainer = this.args.mainContainer;
		//search conteneur
		this.searchContainer = this.args.searchContainer;
		//container size
		this.containerSize = {
			w: $(this.mainContainer).innerWidth(),
			h: $(this.mainContainer).innerHeight(),
			}		
		//resize event
		$(window).resize(this.resizeAllElements.bind(this));
		//le event
		$(document).bind('jlang.Ready', this.jlangReady.bind(this, this.uid));
		};
		
	//----------------------------------------------------------------------------------------------------------------------	
	this.jlangReady = function(){
		this.debug('jlangReady()', arguments);
		var uid = arguments[0];
		if(uid == this.uid){
			//creer le container du autocomplete
			this.createSearchInterface();
			}
		};
	

	//----------------------------------------------------------------------------------------------------------------------	
	
	this.resizeAllElements = function(){ 
		this.debug('resizeAllElements()');

		// moins la scrollbar quand pas en mode mobile	
		this.containerSize = {
			w: $(this.mainContainer).innerWidth(),
			h: $(this.mainContainer).innerHeight(),
			};		
		$.each($('.searchbox.resizable'), $.proxy(function(i, el) {
			//on va chercher le padding a soustraire
			var iPaddingRight = parseInt($(el).css('padding-right'));
			var iPaddingLeft = parseInt($(el).css('padding-left'));
			//on applique le w - le double padding	
			$(el).css({'width': (this.containerSize.w - (iPaddingLeft + iPaddingRight)) + 'px'});
		}, this));		
	};
		
		
	//----------------------------------------------------------------------------------------------------------------------*
	//init the autocomplete serach fields
	this.createSearchInterface = function(){
		this.debug('createSearchInterface()');
		//	
		var str = '<div class="nobg-fix"><img src="' + this.serverImagePath + 'blank.png"></div>';	
		str += '<div class="searchbox resizable">';
		str += '<div id="main-input-' + this.uid + '" class="kw-searchbox"></div>';
		str += '</div>';
		//write content
		$(this.searchContainer).html(str);
		//le autocomplete
		this.jautocomplete.create();
		//call le resize pour ajuster au screen
		this.resizeAllElements();	
		
		};	

	
	
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



//CLASS END