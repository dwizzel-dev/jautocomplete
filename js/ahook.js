/*

Author: DwiZZel
Date: 00-00-0000
Version: V.1.0 BUILD 001
Desc: abstract hook method		
*/

//--------------------------------------------------------------------------------------------------
    
window.AHook = window.AHook || function (){

    this._rejectedMethods = [];
    this._hookFunction;

    //inject code in all methods of the main class
    this.setClassHook = function(){
        var that = this;
        var methods = Object.getOwnPropertyNames(this).filter(function(item){
            if(typeof that[item] === 'function' && that._rejectedMethods.indexOf(item) === -1){
                var f = that[item];
                that[item] = function(){
                    //the hook
                    if(typeof that._hookFunction === 'function'){
                        //non blocking debug plzzz
                        //setTimeout(that._hookFunction.bind(that, [...arguments], new Error().stack));
                        that._hookFunction([...arguments], new Error().stack);
                    }
                    //the real call
                    return f.apply(that, arguments);
                };
                return true;
            }
            return false;
        });
    };

    //set a function for the hook
    this.setHookFunction = function(f){
        if(typeof f === 'function'){
            this._hookFunction = f;
        }
    };

    //reject the clas method methods
    this.rejectClassMethod = function(){
        var that = this;
        this._rejectedMethods = Object.getOwnPropertyNames(this).filter(function(item){
           return (typeof that[item] === 'function');
        }); 
    };

    //will reject its own methods
    //the parent can reject them too 
    //by placing the call before other methods have been set
    this.rejectClassMethod();

};


//EOF