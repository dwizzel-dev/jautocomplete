/*

Author: DwiZZel
Date: 00-00-0000
Version: V.1.0 BUILD 001

*/

//----------------------------------------------------------

window.JAppz =
	window.JAppz ||
	function() {
		//extend abstract methods
		$.extend(this, new ADebug(arguments[0].debug));

		this.className = this.constructor.name;
		this.args = arguments[0];

		//UID
		this.uid = new Date().getTime();

		//----------------------------------------------------------
		this.init = function() {
			//paths
			this.serverImagePath = this.args.serverImagePath;
			this.serverFormProcess = this.args.serverFormProcess;
			//lang
			(this.jlang = new JLang({
				debug: this.args.debug,
				path: this.args.serverCashPath,
				lang: this.args.localeLang
			}))
				.init()
				.then(
					function(res) {
						this.createSearchInterface();
					}.bind(this)
				)
				.catch(
					function(err) {
						this.error("No lang file, just quiting!");
					}.bind(this)
				);
			//server
			if (this.args.isLocaleDb) {
				//otherwise the jcomm will get it from the server
				(this.jserver = new JServer({
					debug: this.args.debug,
					jlang: this.jlang,
					path: this.args.serverCashPath,
					lang: this.args.localeLang,
					serverFormProcess: this.serverFormProcess
				}))
					.init()
					.catch(
						function(err) {
							this.error("No DB File file, just quiting!");
						}.bind(this)
					);
			}
			//comm obj
			(this.jcomm = new JComm({
				debug: this.args.debug,
				jlang: this.jlang,
				jserver: typeof this.jserver !== "undefined" ? this.jserver : false,
				serverService: this.args.serverService,
				sessionId: this.args.sessionId,
				localeLang: this.args.localeLang
			})).init();
			//le search
			(this.jsearch = new JSearch({
				debug: this.args.debug,
				jcomm: this.jcomm
			})).init();
			//le autocomplete
			(this.jautocomplete = new JAutoComplete({
				debug: this.args.debug,
				jlang: this.jlang,
				jsearch: this.jsearch,
				uid: this.uid,
				word: this.args.currentSearchedWord,
				focusoninput: this.args.focusOnInput
			})).init();
			//container size
			this.containerSize = {
				h: 0,
				w: 0
			};
			//conteneur principal
			this.mainContainer = this.args.mainContainer;
			//search conteneur
			this.searchContainer = this.args.searchContainer;
			//container size
			this.containerSize = {
				w: $(this.mainContainer).innerWidth(),
				h: $(this.mainContainer).innerHeight()
			};
			//resize event
			$(window).resize(this.resizeAllElements.bind(this));
		};

		//----------------------------------------------------------
		this.resizeAllElements = function() {
			// moins la scrollbar quand pas en mode mobile
			this.containerSize = {
				w: $(this.mainContainer).innerWidth(),
				h: $(this.mainContainer).innerHeight()
			};
			$.each(
				$(".searchbox.resizable"),
				$.proxy(function(i, el) {
					//on va chercher le padding a soustraire
					var iPaddingRight = parseInt($(el).css("padding-right"));
					var iPaddingLeft = parseInt($(el).css("padding-left"));
					//on applique le w - le double padding
					$(el).css({
						width: this.containerSize.w - (iPaddingLeft + iPaddingRight) + "px"
					});
				}, this)
			);
		};

		//----------------------------------------------------------
		//init the autocomplete serach fields
		this.createSearchInterface = function() {
			//
			var str =
				'<div class="nobg-fix"><img src="' +
				this.serverImagePath +
				'blank.png"></div>' +
				'<div class="searchbox resizable">' +
				'<div id="main-input-' +
				this.uid +
				'" class="kw-searchbox"></div>' +
				"</div>";
			//write content
			$(this.searchContainer).html(str);
			//le autocomplete
			this.jautocomplete.create();
			//call le resize pour ajuster au screen
			this.resizeAllElements();
		};

		//----------------------------------------------------------
		//inject code in them for debugging
		this.setClassHook();
	};

//EOF
