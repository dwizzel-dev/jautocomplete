/*

Author: DwiZZel
Date: 00-00-0000
Version: V.1.0 BUILD 001
Desc: abstract debug method		
*/

//----------------------------------------------------------------------------------------------------------------------
    
window.ADebug = window.ADebug || function (){

    if((typeof arguments[0] !== 'undefined' ? arguments[0] : false) === true){
        
        this.debug = function(){
            var err = new Error().stack.split("\n")[2].split('at ')[1].trim();
            console.log(err, [...arguments]);
        };
    
        this.error = function(){
            var err = new Error().stack.split("\n")[2].split('at ')[1].trim();
            console.error(err, [...arguments]);
        };
    
        this.warn = function(){
            var err = new Error().stack.split("\n")[2].split('at ')[1].trim();
            console.warn(err, [...arguments]);
        };
    
        //extend the hook
        $.extend(this, new AHook());
        //set the hook for the debugger
        this.setHookFunction(function(){
            var err = arguments[1]
                .split("\n")[1]
                .split('at ')[1]
                .replace('.that.<computed> [as ', '.')
                .replace(/\] \(.*\)/gi, '')
                .trim();
            console.log(err, arguments[0]);
        });
        //will reject the debug methods
        this.rejectClassMethod();

    }else{
        //just fake all methods
        this.setClassHook = this.warn = this.debug = this.error = function(){};
    }
    
};

//EOF