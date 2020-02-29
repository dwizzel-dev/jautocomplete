/*

Author: DwiZZel
Date: 04-09-2015
Version: 3.1.0 BUILD X.X

*/

//----------------------------------------------------------------------------------------------------------------------

window.JComm =
	window.JComm ||
	function() {
		//extend abstract methods
		$.extend(this, new ADebug(arguments[0].debug));

		this.className = arguments.callee.name;
		this.args = arguments[0];

		//---------------------------------------------------------------------
		this.init = function() {
			//
			this.jlang = this.args.jlang;
			this.jserver = this.args.jserver;
			this.service = this.args.serverService;
			this.sessionId = this.args.sessionId;
			this.localeLang = this.args.localeLang;
		};

		//----------------------------------------------------------
		this.buildExtraParams = function() {
			var str = "";
			//on rajoute le branding
			if (typeof gBrand == "string") {
				if (gBrand != "") {
					str += "&brand=" + gBrand;
				}
			}
			//on rajoute le branding
			if (typeof gVersioning == "string") {
				if (gVersioning != "") {
					str += "&versioning=" + gVersioning;
				}
			}
			return str;
		};

		//----------------------------------------------------------
		this.process = function(section, service, data, resolve, reject) {
			//pid
			var timestamp = Date.now();
			//en locale uniquement on va le triater avec un serveur locale a la place
			if (this.jserver) {
				resolve(
					new Promise(
						this.jserver.process.bind(this.jserver, {
							section: section,
							service: service,
							data: data
						})
					)
				);
				//on load la db
				return;
			}
			//
			var strUrl = this.service + "/?";
			//pour le file debug du cote php et laoder autre fichier que le standard
			strUrl += this.buildExtraParams();
			//seulement si un sessid valide sinon affiche aucun
			if (this.sessionId.length >= 26) {
				strUrl += "&PHPSESSID=" + this.sessionId;
			}
			//timestamp for cache
			strUrl += "&time=" + timestamp;
			//lang
			strUrl += "&lang=" + this.localeLang;
			//on send
			$.ajax({
				parentclass: this,
				timestamp: timestamp,
				type: "GET",
				headers: { "cache-control": "no-cache" },
				cache: false,
				async: true,
				dataType: "text",
				url: strUrl,
				service: service,
				section: section,
				data: {
					section: section,
					service: service,
					data: JSON.stringify(data)
				},
				success: function(dataRtn) {
					//try catch on it because of php errors , notice, warnings or scrumbled data
					var error = "";
					var obj;
					try {
						var obj = JSON.parse(dataRtn);
					} catch (e) {
						error = e;
					}
					//check if the object was made ok format
					if (typeof obj != "object") {
						//set state
						obj = {
							usermsg: this.parentclass.jlang.t("server_error_on_service_call"),
							msgerrors:
								this.parentclass.jlang.t("server_error_on_service_call") +
								"\n" +
								this.section + "." + this.service +
								"\n" +
								this.parentclass.jlang.t("service_error") +
								"\n" +
								error
						};
						//call the caller
						reject(obj);
					}else{
						//call the caller
						resolve(obj);
					}
				},
				error: function(dataRtn, ajaxOptions, thrownError) {
					//set state
					obj = {
						usermsg: this.parentclass.jlang.t("server_error_on_service_call"),
						msgerrors: 
							this.parentclass.jlang.t("server_error_on_service_call") +
							"\n" +
							this.parentclass.formatErrorMessage(
								dataRtn,
								thrownError,
								this.timestamp
							)
					};
					//call the caller
					reject(obj);
				}
			});
			//
			return;
		};

		//----------------------------------------------------------
		this.formatErrorMessage = function(xhr, exception, timestamp) {
			//
			var str = "";
			//
			if (xhr.status === 0) {
				str = this.jlang.t(
					"Not connected.\nPlease verify your network connection."
				);
			} else if (xhr.status == 404) {
				str = this.jlang.t("The requested page not found. [404]");
			} else if (xhr.status == 500) {
				str = this.jlang.t("Internal Server Error [500].");
			} else if (exception === "parsererror") {
				str = this.jlang.t("Requested JSON parse failed.");
			} else if (exception === "timeout") {
				str = this.jlang.t("Time out error.");
			} else if (exception === "abort") {
				str = this.jlang.t("Ajax request aborted.");
			} else {
				str = this.jlang.t("Uncaught Error" + xhr.responseText);
			}
			return "[" + timestamp + "] " + str;
		};

		//----------------------------------------------------------
		//inject code in them for debugging
		this.setClassHook();
	};

//EOF
