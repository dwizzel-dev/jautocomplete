/*

Author: DwiZZel
Date: 00-00-0000
Version: V.1.0 BUILD 001 
	
*/

//----------------------------------------------------------

window.JLang =
	window.JLang ||
	function() {
		//extend abstract methods
		$.extend(this, new ADebug(arguments[0].debug));

		this.className = arguments.callee.name;
		this.args = arguments[0];

		//----------------------------------------------------------
		this.init = function() {
			this.urlDB = this.args.path + "lang." + this.args.lang + ".data";
			this.db = false;
			return new Promise(this.getDB.bind(this));
		};

		//----------------------------------------------------------
		this.setDB = function(obj) {
			this.db = obj;
		};

		//----------------------------------------------------------
		//load the db lang file
		this.getDB = function(resolve, reject) {
			$.ajax({
				timestamp: Date.now(),
				parentclass: this,
				type: "POST",
				headers: { "cache-control": "no-cache" },
				cache: false,
				async: true,
				dataType: "text",
				url: this.urlDB,
				success: function(dataRtn) {
					//parse data
					this.parentclass.debug("process().success()", {
						dataRtn: dataRtn,
						time: (Date.now() - this.timestamp) / 1000 + "seconds",
						weight: dataRtn.length / 1024 / 1000 + " Mo"
					});
					//
					var obj = false;
					try {
						eval("obj = {" + dataRtn + "};");
					} catch (e) {
						obj = false;
					}
					//
					this.parentclass.debug(this.url + " loaded");
					this.parentclass.setDB(obj);
					resolve();
				},
				error: function(dataRtn, ajaxOptions, thrownError) {
					//
					reject();
				}
			});
		};

		//----------------------------------------------------------
		//get the text by key or return the key with tilde
		this.t = function(key) {
			if (typeof this.db[key] == "string") {
				return this.db[key];
			}
			return "~" + key + "~";
		};

		//----------------------------------------------------------
		//inject code in them for debugging
		this.setClassHook();
	};

//EOF
