/*

Author: DwiZZel
Date: 00-00-0000
Version: V.1.0 BUILD 001
		
*/

//----------------------------------------------------------------------------------------------------------------------
    
function JDebug(){
	
	this.className = arguments.callee.name;
	this.args = arguments[0];
	
	//---------------------------------------------------------------------
	this.init = function(){
		this.arr = [];
		this.eol = '<br>';	
		this.bAppz = this.args.bAppz;	
		this.bDebug = this.args.bDebug;
		
		return this;
		};

	//---------------------------------------------------------------------	
	this.show = function(str){
		//this.add(str);
		if(this.bDebug){
			if(!this.bAppz){
				console.log(str);
			}else{
				gCallWindow({
					method: 'debug',
					args: str
					});
				}
			}
		};

	//---------------------------------------------------------------------	
	this.showObject = function(str, obj){
		//this.add(str);
		if(this.bDebug){
			if(!this.bAppz){	
				console.log(str + '{');
				console.log(obj);
				console.log('}');
				}
			}
		};

	//---------------------------------------------------------------------	
	this.add = function(str){
		this.arr.unshift(str);
		};

	//---------------------------------------------------------------------	
	this.get = function(str){
		var str = '<pre>';
		for(var o in this.arr){
			//strip html tags pre
			str = str.replace('<pre>', '');
			str = str.replace('</pre>', '');
			str += this.arr[o] + this.eol;
			}
		str += '</pre>';
		return str;
		};
	
	}