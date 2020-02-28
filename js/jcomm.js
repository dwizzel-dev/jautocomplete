/*

Author: DwiZZel
Date: 04-09-2015
Version: 3.1.0 BUILD X.X

*/

//----------------------------------------------------------------------------------------------------------------------

function JComm(){

	//extend abstract methods
	$.extend(this, new ADebug(arguments[0].debug));
	
	this.className = arguments.callee.name;
	this.args = arguments[0];
		
	
	//---------------------------------------------------------------------
	this.init = function(){
		//
		this.jlang = this.args.jlang;
		this.mainAppz = this.args.mainappz;	
		this.pid = 100;
		this.service = this.args.serverService;	
		this.sessionId = this.args.sessionId;
		this.localeLang = this.args.localeLang;
		return this;
	};
	
	//----------------------------------------------------------------------------------------------------------------------*
	this.getTicket = function(){
		this.pid++;
		return this.pid;
	};

	//----------------------------------------------------------------------------------------------------------------------*
	this.buildExtraParams = function(){
		var str = '';
		//on rajoute le branding
		if(typeof(gBrand) == 'string'){
			if(gBrand != ''){
				str += '&brand=' + gBrand;
			}
		}
		//on rajoute le branding
		if(typeof(gVersioning) == 'string'){
			if(gVersioning != ''){
				str += '&versioning=' + gVersioning;
			}
		}
		return str;
	};
	
	//----------------------------------------------------------------------------------------------------------------------*
	this.process = function(callerClass, section, service, data, extraObj){
		//pid
		var timestamp = Date.now();
		var pid = this.getTicket();
		//en locale uniquement on va le triater avec un serveur locale a la place
		if(typeof(this.mainAppz.jserver) != 'undefined'){
			//settimeout pour avoir un delai car doit ramenr un pid avant e le traiter
			setTimeout(this.mainAppz.jserver.process.bind(this.mainAppz.jserver, {
				section: section,
				service: service,
				data: data,
				extraobj: extraObj,
				pid: pid,
				callerclass:callerClass,
			}), 0);
			//on load la db
			return pid;
		}
		//
		var strUrl = this.service + '/?';
		//pour le file debug du cote php et laoder autre fichier que le standard
		strUrl += this.buildExtraParams();
		//seulement si un sessid valide sinon affiche aucun
		if(this.sessionId.length >= 26){	
			strUrl += '&PHPSESSID=' + this.sessionId;
		}
		//timestamp for cache
		strUrl += '&time=' + timestamp;
		//lang
		strUrl += '&lang=' + this.localeLang;
		//on send
		$.ajax({
			parentclass: this,
			timestamp: timestamp,
			pid: pid,
			extraobj: extraObj,
			callerclass: callerClass,
			type: 'GET',
			headers:{'cache-control':'no-cache'},
			cache: false,
			async: true,
			dataType: 'text',
			url: strUrl,
			service: service,
			section: section,
			data: {
				section:section, 
				service:service, 
				data:JSON.stringify(data), 
				pid:pid
			},
			success: function(dataRtn){
				//parse data
				//debug
				this.parentclass.debug('process().success(' + this.pid + ')', {
					'dataRtn': dataRtn,
					'time': ((Date.now() - this.timestamp)/1000) + 'seconds', 
					'weight': ((dataRtn.length/1024)/1000) + ' Mo'
				});
				//try catch on it because of php errors , notice, warnings or scrumbled data
				var error = '';
				var obj;
				try{
					eval('var obj = ' + dataRtn + ';');
				}catch(e){
					error = e;
				}
				//check if the object was made ok format
				if(typeof(obj) != 'object'){
					//set state
					obj = {
						msgerrors: '<b>' + this.parentclass.jlang.t('server error on service call:') + '</b><br /><br />' + this.section + '.' + this.service + '<br /><br /><b>' + this.parentclass.jlang.t('service error:') + '</b><br /><br />' + error,
					};
				}
				//debug
				this.parentclass.debug('process().return(' + this.pid + '):', obj, this.extraobj);
				//call the caller
				this.callerclass.commCallBackFunc(this.pid, obj, this.extraobj);
				//
			},
			error: function(dataRtn, ajaxOptions, thrownError){
				this.parentclass.debug('process().error(' + this.pid + ')', this.data, dataRtn, ajaxOptions, thrownError);
				//set state
				obj = {
					msgerrors: '<b>' + this.parentclass.jlang.t('server error on service call:') + '</b><br /><br />' + this.parentclass.formatErrorMessage(dataRtn, thrownError, this.timestamp),
				};
				//call the caller
				this.callerclass.commCallBackFunc(this.pid, obj, this.extraobj);
				//
			}	
		});
		//retun the ticket number	
		return pid;
	};

	//----------------------------------------------------------------------------------------------------------------------*
	this.formatErrorMessage = function(xhr, exception, timestamp){
		//
		var str = '';
		//
		if(xhr.status === 0) {
			str = this.jlang.t('Not connected.\nPlease verify your network connection.');
		}else if(xhr.status == 404) {
			str = this.jlang.t('The requested page not found. [404]');
		}else if(xhr.status == 500) {
			str = this.jlang.t('Internal Server Error [500].');
		}else if(exception === 'parsererror') {
			str = this.jlang.t('Requested JSON parse failed.');
		}else if(exception === 'timeout') {
			str = this.jlang.t('Time out error.');
		}else if(exception === 'abort') {
			str = this.jlang.t('Ajax request aborted.');
		}else{
			str = this.jlang.t('Uncaught Error' + xhr.responseText);
		}
		return '[' + timestamp + '] ' + str;
	};

	
	//----------------------------------------------------------
	//inject code in them for debugging
	this.setClassHook();

}	

//EOF