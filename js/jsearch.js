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
		this.mainAppz = this.args.mainappz;
		
		//garde les derniers resultat de recherche
		this.arrLastResult = [];
		this.countLastResult = 0;
		//le pid de la derniere recherche car si clique vite 
		//les resultats n'arrivent pas dans le bon ordre
		this.lastSearchPid = 0;
		this.lastPid = -1;
		
		return this;
		};
	
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
	this.getExerciceListingByKeywordIdsForPreview = function(params, strIds, strLiId){
		
		//rien a chercher on s'en va
		if(strIds == ''){
			return false;
			}
		//
		var objServer = {
			ids: strIds,
			};
		//
		var objLocal = {
			ids: strIds,
			params: params,
			strliid: strLiId,
			};
		//
		this.lastPid = this.jcomm.process(this, 'search', 'get-exercice-listing-by-keyword-ids-for-preview', objServer, objLocal);		
		//
		return this.lastPid;
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
					this.mainAppz.jautocomplete.fetchAutoCompleteDataRFS(obj.data.result, extraObj.params, extraObj.word, extraObj.kwtype, obj.data.cword, pid);
				}else if(obj.service == 'get-exercice-listing-by-keyword-ids'){
					//check si le pid de la recherche est le meme que le dernier pid de la recherche lance, 
					//car une vielle recherche pourrait ecraser une plus recente
					if(pid == this.lastSearchPid){
						//copy et autres
						this.routineOnListingResult(obj.data);
						//show result
						this.mainAppz.fillSearch(obj.data, extraObj.word);
						}
				}else if(obj.service == 'get-exercice-listing-by-words'){
					//check si le pid de la recherche est le meme que le dernier pid de la recherche lance, 
					//car une vielle recherche pourrait ecraser une plus recente
					if(pid == this.lastSearchPid){
						//copy et autres
						this.routineOnListingResult(obj.data);
						//show result
						this.mainAppz.fillSearch(obj.data, extraObj.word);
						}		
				}else if(obj.service == 'get-exercice-listing-by-keyword-ids-for-preview'){
					//retour des previews
					this.mainAppz.jautocomplete.fetchExercisePreviewRFS(obj.data, extraObj.params, extraObj.strliid, pid);
				}else{
					//
					}
				}
			}
		};	

	//----------------------------------------------------------------------------------------------------------------------*
	this.routineOnListingResult = function(data){
		//
		this.clear();
		//real data
		this.arrLastResult = data;
		//last count
		this.countLastResult = this.arrLastResult.length;
		};

	//----------------------------------------------------------------------------------------------------------------------*
	this.clear = function(){
		//clear array	
		this.arrLastResult = [];
		//clear counter
		this.countLastResult = 0;
		};
	
	//----------------------------------------------------------------------------------------------------------------------*
	this.contains = function(id){
		//
		if(typeof(this.arrExercices[o]) == 'object'){
			return true;
			}
		//
		return false;	
		};
	

	//----------------------------------------------------------
	//inject code in them for debugging
	this.setClassHook();	

}


//EOF


