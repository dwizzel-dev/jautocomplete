/*

Author: DwiZZel
Date: 00-00-0000
Version: V.1.0 BUILD 001 
	
*/

//----------------------------------------------------------

function JLang(){

	//extend abstract methods
	$.extend(this, new ADebug(arguments[0].debug));

	this.className = arguments.callee.name;
	this.args = arguments[0];
	
	//----------------------------------------------------------
	this.init = function(){
		this.loaded = false;
		this.urlDB = this.args.path + 'lang.' + this.args.lang + '.data';
		this.db = false;
		this.getDB();	
		return this;
	};		
		
	//----------------------------------------------------------
	this.setDB = function(obj){
		this.db = obj;	
	};	
		
	//----------------------------------------------------------
	this.isLoaded = function(){
		return this.loaded;
	};
		
	//----------------------------------------------------------
	this.isReady = function(bReady){
		this.loaded = bReady;
		//on call un event pour le event listener de la appz
		$(document).trigger('jlang.Ready', this.loaded);
	};

	//----------------------------------------------------------
	//load the db lang file
	this.getDB = function(){
		$.ajax({
			timestamp: Date.now(),
			parentclass: this,
			type: 'POST',
			headers:{'cache-control':'no-cache'},
			cache: false,
			async: true,
			dataType: 'text',
			url: this.urlDB,
			success: function(dataRtn){
				//parse data
				this.parentclass.debug('process().success()', {
					'dataRtn': dataRtn,
					'time': ((Date.now() - this.timestamp)/1000) + 'seconds', 
					'weight': ((dataRtn.length/1024)/1000) + ' Mo'
				});
				//
				var obj = false;
				try{
					eval('obj = {' + dataRtn + '};');
				}catch(e){
					obj = false;	
				}
				//
				this.parentclass.debug(this.url + ' loaded');
				this.parentclass.setDB(obj);
				this.parentclass.isReady(true);
					
			},
			error: function(dataRtn, ajaxOptions, thrownError){
				//
				this.parentclass.isReady(false);
			}	
		});	

	};

	//----------------------------------------------------------
	//get the text by key or return the key with tilde
	this.t = function(key){
		if(typeof(this.db[key]) == 'string'){
			return this.db[key];
		}
		return '~' + key + '~';
	}


	//----------------------------------------------------------
	//inject code in them for debugging
	this.setClassHook();
	
}


//EOF