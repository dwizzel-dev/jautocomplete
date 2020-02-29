/*

Author: DwiZZel
Date: 00-00-0000
Version: V.1.0 BUILD 001
		
*/

//----------------------------------------------------------------------------------------------------------------------

window.JServer =
	window.JServer ||
	function() {
		//extend abstract methods
		$.extend(this, new ADebug(arguments[0].debug));

		//class name
		this.className = arguments.callee.name;
		this.args = arguments[0];

		//cache
		this.cacheData = {};

		//---------------------------------------------------------------------
		this.init = function() {
			//
			this.jlang = this.args.jlang;
			this.db = false;
			this.lang = this.args.lang;
			this.path = this.args.path;
			this.urlDB = this.path + "db-kw." + this.lang + ".data";
			this.maxRows = 20;
			this.serverFormProcess = this.args.serverFormProcess;
			//on va chercher la database
			return new Promise(this.getDB.bind(this));
		};

		//---------------------------------------------------------------------
		this.process = function(obj, resolve, reject) {
			//on check si on a une DB
			if (this.db === false) {
				//get out
				resolve({ msgerrors: 'Local DB "' + this.urlDB + '" not available' });
				return;
			}
			switch (obj.section) {
				case "search":
					resolve(this.processSearch(obj));
					break;
				default:
					//default error
					resolve({ msgerrors: 'Local DB "' + this.urlDB + '" not available' });
					break;
			}
			//
		};

		//---------------------------------------------------------------------
		this.processSearch = function(obj) {
			//
			switch (obj.service) {
				case "fetch-autocomplete":
					return this.fetchAutocomplete(obj);
				case "get-exercice-listing-by-keyword-ids":
					return this.gotoSearchPage(obj);
				case "get-exercice-listing-by-words":
					return this.gotoSearchPage(obj);
				default:
					return { msgerrors: "Service not available" };
			}
		};

		//---------------------------------------------------------------------
		this.gotoSearchPage = function(obj) {
			//
			//on redirige vars le url de recherche selon la langue
			//on check si a une page ou aller
			if (
				typeof this.serverFormProcess == "string" &&
				typeof obj.data.word == "string"
			) {
				if (obj.data.word != "") {
					//a bit of clean up
					var word = this.trimKeyword(obj.data.word);
					var ids = typeof obj.data.ids !== "undefined" ? obj.data.ids : "";
					if (word != "") {
						var path =
							"/" +
							this.lang.substring(0, 2) +
							"/?q=" +
							encodeURI(word) +
							"&ids=" +
							encodeURI(ids);
						this.debug("REDIRECTION: " + path);
						window.top.location.href = path;
					}
				}
			}
			return false;
		};

		//---------------------------------------------------------------------
		this.fetchAutocomplete = function(obj) {
			var arrResult = [];
			var arrWord = [];
			var arrSplitWords = [];
			var word = "";
			var key = btoa(obj.data.word);
			var oRtn;

			//check in the cahce before
			if (typeof this.cacheData[key] !== "undefined") {
				oRtn = this.cacheData[key];
				this.debug("using cache[" + key + "]", oRtn);
			} else {
				if (typeof obj.data.word == "string" && obj.data.word != "") {
					//check in the cahce before
					if (typeof this.cacheData[key] !== "undefined") {
						oRtn = this.cacheData[key];
						this.debug("using cache[" + key + "]", oRtn);
					} else {
						//on strip tout les caractere qui ppeuvent crasher le regex
						word = this.trimKeyword(obj.data.word);
						if (word != "") {
							//on garde juste les 4 premier mots
							arrSplitWords = word.split(" ").slice(0, 4);
							if (arrSplitWords.length) {
								//first try
								for (var o in arrSplitWords) {
									arrWord = this.db.match(
										new RegExp(this.regexWordPermutation(arrSplitWords), "gi")
									);
									if (typeof arrWord == "object" && arrWord) {
										break;
									} else if (arrSplitWords.length > 1) {
										//multiple try
										arrSplitWords = arrSplitWords.slice(
											0,
											arrSplitWords.length - 1
										);
									}
								}
								if (!arrWord) {
									//extra try
									if (arrSplitWords[0].length > 1) {
										arrWord = this.db.match(
											new RegExp(
												this.regexWordsWithSpace(arrSplitWords[0]),
												"gi"
											)
										);
									}
								}
								if (typeof arrWord == "object" && arrWord) {
									this.debug("arrWord", arrWord);
									arrWord = arrWord.slice(0, this.maxRows);
									for (var o in arrWord) {
										arrResult.push({
											id: o,
											name: arrWord[o].substring(1)
										});
									}
								}
							}
						}
					}
				}
				//sinon on conitnue
				oRtn = {
					section: obj.section,
					service: obj.service,
					data: {
						cword: word,
						result: {
							//les keywords
							"1": arrResult
						}
					}
				};
				//cache it
				this.cacheData[key] = oRtn;
			}

			return oRtn;
		};

		//---------------------------------------------------------------------
		this.trimKeyword = function(str) {
			//
			str = str.toLowerCase();
			str = str.replace(
				/[^a-zA-Z0-9'\sÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ-]/gi,
				" "
			);
			str = str.replace(/[\s]+/gi, " ");
			str = str.trim();
			//to array
			return str;
		};

		//---------------------------------------------------------------------
		/*
		example: "mon gros"
		
		|gros mon|mon gros|mon gros sale|massage|sale mon gros|ma grosse sale|ma grosse mondaine|
		
		\|[a-z0-9\s]{0,}[\s]{1,}mon[a-z0-9]{0,}[\s]{1,}gros[a-z0-9\s]{0,}|
		\|mon[a-z0-9]{0,}[\s]{1,}gros[a-z0-9\s]{0,}|\|
		
		[a-z0-9\s]{0,}[\s]{1,}gros[a-z0-9]{0,}[\s]{1,}mon[a-z0-9\s]{0,}|\|
		gros[a-z0-9]{0,}[\s]{1,}mon[a-z0-9\s]{0,}
		
		*/

		this.regexWordPermutation = function(arr) {
			//
			var arrRes = this.permutateArr(arr);
			var tmp = [""];
			arrRes.forEach(function(item, index) {
				var str1 = "";
				var str2 = "";
				for (var o in item) {
					if (item.length == 1) {
						//il est seul
						str1 =
							"\\|[a-z0-9-'\\s]{0,}[\\s]{1}" + item[o] + "[a-z0-9-'\\s]{0,}";
						str2 = "\\|" + item[o] + "[a-z0-9-'\\s]{0,}";
					} else if (o == 0) {
						//check si le premier et pas tut seul
						str1 =
							"\\|[a-z0-9-'\\s]{0,}[\\s]{1}" +
							item[o] +
							"[a-z0-9-'\\s]{0,}[\\s]{1}";
						str2 = "\\|" + item[o] + "[a-z0-9-\\s]{0,}[\\s]{1}";
					} else if (o == item.length - 1) {
						//check si le dernier et pas tut seul
						str1 += item[o] + "[a-z0-9-'\\s]{0,}";
						str2 += item[o] + "[a-z0-9-'\\s]{0,}";
					} else {
						//les autres dans le milieu et pas tut seul
						str1 += item[o] + "[a-z0-9-'\\s]{0,}[\\s]{1}";
						str2 += item[o] + "[a-z0-9-'\\s]{0,}[\\s]{1}";
					}
				}
				//
				this[0] += str2 + "|" + str1 + "|";
			}, tmp);
			//
			tmp = tmp[0].substring(0, tmp[0].length - 1);
			//
			this.debug("REGEX[1]: " + tmp);
			//
			return tmp;
		};

		//------------------------------------------------------------------------
		this.regexWordsWithSpace = function(word) {
			//arr des mots a retenir
			var str1 = "";
			var str2 = "";
			var strLeft = "";
			var strRight = "";
			var strRegex = "";
			//
			//le max de chars a 5
			word = word.substring(0, 5);
			//on creer un couple de mot de remplacement
			for (var i = 0; i < word.length - 1; i++) {
				strLeft = "";
				for (var j = 0; j < word.length - (word.length - (i + 1)); j++) {
					strLeft += word.charAt(j);
				}
				strRight = "";
				for (var j = i + 1; j < word.length; j++) {
					strRight += word.charAt(j);
				}
				str1 +=
					"\\|" + strLeft + "[a-z0-9-]{1,2}" + strRight + "[a-z0-9-\\s]{0,}|";
				str2 +=
					"\\|[a-z0-9-\\s]{0,}[\\s]{1}" +
					strLeft +
					"[a-z0-9-]{1,2}" +
					strRight +
					"[a-z0-9-\\s]{0,}|";
			}
			//strip
			if (str1 != "" && str2 != "") {
				str1 = str1.substring(0, str1.length - 1);
				str2 = str2.substring(0, str2.length - 1);
				strRegex = str1 + "|" + str2;
			}
			//
			this.debug("REGEX[2]: " + strRegex);
			//le retour
			return strRegex;
		};

		//---------------------------------------------------------------------
		this.permutateArr = function(arrWord) {
			var results = [];
			function permute(arr, memo) {
				var cur,
					memo = memo || [];
				for (var i = 0; i < arr.length; i++) {
					cur = arr.splice(i, 1);
					if (arr.length === 0) {
						results.push(memo.concat(cur));
					}
					permute(arr.slice(), memo.concat(cur));
					arr.splice(i, 0, cur[0]);
				}
				return results;
			}
			//
			return permute(arrWord);
		};

		//---------------------------------------------------------------------
		this.setDB = function(obj) {
			//
			this.db = obj;
		};

		//---------------------------------------------------------------------
		//load the db kw
		this.getDB = function(resolve, reject) {
			//on send
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
						eval('obj = "' + dataRtn + '";');
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
					this.parentclass.debug(this.url + " NOT loaded");
					reject();
				}
			});
		};

		//----------------------------------------------------------
		//inject code in them for debugging
		this.setClassHook();
	};

//EOF
