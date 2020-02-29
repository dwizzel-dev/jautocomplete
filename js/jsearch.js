/*

Author: DwiZZel
Date: 15-07-2016
Version: V.1.0 BUILD 001

*/

//----------------------------------------------------------------------------------------------------------------------
    
function JSearch(){

	//extend abstract methods
	$.extend(this, new ADebug(arguments[0].debug));
	
	this.className = arguments.callee.name;
	this.args = arguments[0];
	
	
	//----------------------------------------------------------------------------------------------------------------------*
	this.init = function(){
		//
		this.jlang = this.args.jlang;
		this.jcomm = this.args.jcomm;
		this.jautocomplete = this.args.jautocomplete;
		
		//le pid de la derniere recherche car si clique vite 
		//les resultats n'arrivent pas dans le bon ordre
		this.lastSearchPid = 0;
		this.lastPid = -1;
		};

	//----------------------------------------------------------------------------------------------------------------------*
	this.registerAutoComplete = function(obj){	
		this.jautocomplete = obj;
	}
	
	//----------------------------------------------------------------------------------------------------------------------*
	this.fetchAutoCompleteData = function(str, params, strKwType){
		//
		var objServer = {
			word: str,
			kwtype: strKwType,
			};
		//
		var objLocal = {
			word: str,
			params : params,
			kwtype: strKwType,	
			};
		//
		this.lastPid = this.jcomm.process(this, 'search', 'fetch-autocomplete', objServer, objLocal);		
		//
		return this.lastPid;
		};

		
	//----------------------------------------------------------------------------------------------------------------------*
	this.getExerciceListingByWords = function(str){
		
		//rien a chercher on s'en va
		if(str == ''){
			return false;
			}
		//
		var objServer = {
			word: str,
			};
		//
		var objLocal = {
			word: str,
			};
		//
		this.lastPid = this.jcomm.process(this, 'search', 'get-exercice-listing-by-words', objServer, objLocal);		
		//
		this.lastSearchPid = this.lastPid;
		//
		return true;
		};	
		
	//----------------------------------------------------------------------------------------------------------------------*
	this.getExerciceListingByKeywordIds = function(strIds, str){
		
		//rien a chercher on s'en va
		if(strIds == ''){
			return false;
			}
		//
		var objServer = {
			ids: strIds,
			word: str,
			};
		//
		var objLocal = {
			ids: strIds,
			word: str,
			};
		//
		this.lastPid = this.jcomm.process(this, 'search', 'get-exercice-listing-by-keyword-ids', objServer, objLocal);		
		//
		this.lastSearchPid = this.lastPid;
		//
		return true;
		};


		
	//----------------------------------------------------------------------------------------------------------------------*	
	this.commCallBackFunc = function(pid, obj, extraObj){
		//	
		if(typeof(obj.msgerrors) == 'string' && obj.msgerrors != ''){
			this.debug(obj.msgerrors);
		}else{
			if(obj.section == 'search'){
				if(obj.service == 'fetch-autocomplete'){
					//retour du auto complete
					this.jautocomplete.fetchAutoCompleteDataRFS(obj.data.result, extraObj.params, extraObj.word, extraObj.kwtype, obj.data.cword, pid);
				}else if(obj.service == 'get-exercice-listing-by-keyword-ids'){
					//check si le pid de la recherche est le meme que le dernier pid de la recherche lance, 
					//car une vielle recherche pourrait ecraser une plus recente
					if(pid == this.lastSearchPid){
						//copy et autres
						}
				}else if(obj.service == 'get-exercice-listing-by-words'){
					//check si le pid de la recherche est le meme que le dernier pid de la recherche lance, 
					//car une vielle recherche pourrait ecraser une plus recente
					if(pid == this.lastSearchPid){
						//copy et autres
						}		
				}else{
					//
					}
				}
			}
		};	

	
	//----------------------------------------------------------
	//inject code in them for debugging
	this.setClassHook();	

}


//EOF


