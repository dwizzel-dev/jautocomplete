/*

Author: DwiZZel
Date: 15-07-2016
Version: V.1.0 BUILD 001
Notes: Desole pour la pauvre qualite du francais des commentaires
	
	
*/
//---------------------------------------------------

window.JAutoComplete =
	window.JAutoComplete ||
	function() {
		//extend abstract methods
		$.extend(this, new ADebug(arguments[0].debug));

		this.className = arguments.callee.name;
		this.args = arguments[0];

		//---------------------------------------------------*
		this.init = function() {
			//base UID
			this.jlang = this.args.jlang;
			//the search class
			this.jsearch = this.args.jsearch;
			//unique ID
			this.uid = this.args.uid;
			//base div
			this.baseDivId = "kw-content-result-" + this.uid;
			//base input name for kwtype
			this.bFocusOnInput = this.args.focusoninput;
			//array of input box name and ref to jquery selector object
			this.inputBox = {
				layer: "main-input-" + this.uid,
				input: "search-input-" + this.uid
			};
			//les dernier resultat du autocomplete pour reproposer lors dun press <ENTER>
			this.arrLastHintResult = [];
			//have auto complete returned from server
			this.bHaveAutoCompleteResult = false;
			//si on a au moins un match dans le autocomplete result
			//cest a dire un debut de phrase car pour les permutation
			//on essaye de le corriger alors on a un resultat de autocomplete
			//mais si il ne selectionne rien dedans pas besoin de lancer la recherche
			//qu ne ramenera rien de toute facon
			this.bFoundAutoCompleteMatch = false;
			//le dernier mot avant le focus sur les li qui changeront le contenu du input box
			this.lastTypedWord = "";
			//last typed string qui a retourne un resultat
			this.lastSearchString = "";
			//le contenue word du permier LI
			this.firstLiWord = "";
			//la derniere string
			this.currentSearchWord = "";
			//le contenue values du LI sur lequel il clique ou press enter
			this.focusedKwIds = "";
			//min-max
			this.minStrLen = 1;
			//le temps entre chaque call du fetchAutoCompleteDataWithDelay en millisecond google est a 130ms
			this.timeDelay = 0;
			//le timer du setTimeout poura ller fetcher le autocomplete data
			this.timerFetchAutoComplete = 0;
			//event.which we refused
			//les event poru lesquelles on ne fera rien genre : <SHIFT + LEFT_ARROW> etc...
			//http://docstore.mik.ua/orelly/webprog/DHTML_javascript/0596004672_jvdhtmlckbk-app-b.html
			this.arrRefusedEvent = [
				9,
				16,
				17,
				18,
				19,
				20,
				33,
				34,
				35,
				36,
				37,
				39,
				44,
				45,
				112,
				113,
				114,
				115,
				116,
				117,
				118,
				119,
				120,
				121,
				122,
				123,
				144,
				145
			];
		};

		//---------------------------------------------------*
		this.create = function() {
			this.addInputBox();
			this.addLiSingleResultOnClick();
			//vu que rien n'est cherche car il se remplit auto il faut setter les params de base
			//pour que le press <ENTER> fonctionne
			if (typeof this.args.word !== "undefined" && this.args.word !== "") {
				//going to go with a fake search
				this.setInputBoxText(this.args.word, true);
				this.currentSearchWord = this.args.word;
				this.lastSearchString = this.args.word;
				this.bFoundAutoCompleteMatch = true;
				this.bHaveAutoCompleteResult = true;
				//set the carret to the end of the string
				this.setInputBoxText(this.args.word, true);
			}			
		};

		//---------------------------------------------------*
		this.setCarretRange = function(start, end) {
			//on place le cursor
			this.inputBox.refinput.prop("selectionStart", start);
			this.inputBox.refinput.prop("selectionEnd", end);
			//
		};
		
		//---------------------------------------------------*
		this.setInputBoxText = function(str, bUpdateBg) {
			//on reset le -bg
			if (bUpdateBg) {
				this.setInputBgBoxText("");
			}
			//le front
			this.inputBox.refinput.val(str);
		};

		//---------------------------------------------------*
		this.setInputBgBoxText = function(str) {
			//we are going to use the placeholder
			if (str === "" && this.inputBox.refinput.val() === "") {
				//so put at least a space if we have something in the main input box
				//or it will show the place holder
				this.inputBox.refinputbg.attr("placeholder", this.jlang.t("recherche"));
			} else {
				//show the hint
				this.inputBox.refinputbg.attr("placeholder", str);
			}
		};
		
		//---------------------------------------------------*
		this.trimStringBeginning = function(str) {
			//
			return str.replace(/^\s+/gm, "");
		};

		//---------------------------------------------------*
		this.trimStringEnding = function(str) {
			//
			return str.replace(/\s+$/gm, "");
		};

		//---------------------------------------------------*
		this.setFocusedKwIds = function(strKwIds, strWord) {
			//on va setter le kwIDS equivalent au contenu du LI
			this.focusedKwIds = strKwIds;
			//on va setter la strig aussi de recherche pour affichage du retour
			this.currentSearchWord = strWord;
		};
		
		//---------------------------------------------------*
		/*
		1. sur le focus du LI 
			a) changer le style et le focus
			b) garder le mot qui a ete ecrit avant d'overwriter
			c) remplacer le input par le contenu du LI qui a le focus et placer le cursor a la fin
			
		2. quand descend si atteint le bas alors retourne a la case INPUT

		3. quand monte si atteint le haut alors retourne a la case INPUT	
		
		*/
		this.changeLiFocus = function(strDirection) {
			//
			//base ref du autocomplete
			var strUlListingRef = "#" + this.baseDivId + " > UL.listing";
			//le id present qui a le focus
			var iFocusId = parseInt($(strUlListingRef).attr("focus-id"));
			//garde le last id qui a ete modifie pour changer le style et le focus
			var iLastFocusId = iFocusId;
			//le max de id row
			var iMaxFocusId = parseInt($(strUlListingRef).attr("focus-id-max"));
			//on incremente le focus-id
			if (strDirection == "up") {
				iFocusId--;
				//si jamais est le dernier on le remet au premier
				if (iFocusId <= 0) {
					iFocusId = 0;
				}
			} else {
				//down
				iFocusId++;
				//si jamais est le dernier on le remet au premier
				if (iFocusId > iMaxFocusId) {
					iFocusId = 0;
				}
			}
			//on enleve le focus et surlignage
			//$('#lisr' + iLastFocusId).removeClass('focus');
			$("#" + this.baseDivId + " " + "#lisr" + iLastFocusId).removeClass(
				"focus"
			);
			//si le lastInputId est a zero alors on doit garder ce qui etait ecrit
			if (iLastFocusId === 0) {
				this.lastTypedWord = $("#" + this.inputBox.input).val();
			} else {
				if (iFocusId === 0) {
					//on doit remettre ce que l'on a garde en memoire
					//car revient sur le input box apres etre passe d'un LI a l'autre
					this.setInputBoxText(this.lastTypedWord, true);
					//on remet le bg au permier choix du LI
					this.setInputBgBoxText(this.firstLiWord);
				}
			}
			//si le focus est 0
			if (iFocusId === 0) {
				//si le focus est a 0 et le direction est up donc on doit aller au dernier choix des LI
				if (strDirection == "up") {
					//si est le premier de la liste et reviens au input box
					if (iLastFocusId === 1) {
						//on set l'attribut
						$(strUlListingRef).attr("focus-id", 0);
						//on met plus rien car peut vouloir faire une recherche
						//juste avec les input box
						this.setFocusedKwIds("", "");
					} else {
						//on set sur le dernier LI
						$("#lisr" + iMaxFocusId).addClass("focus");
						var el = $("#" + this.baseDivId + " " + "#lisr" + iMaxFocusId);
						//on change le input box avec le contenu du LI
						this.setInputBoxText(el.attr("keyword-word"), true);
						//on set les KWids focused
						this.setFocusedKwIds(
							el.attr("keyword-ids"),
							el.attr("keyword-word")
						);
						//on set l'attribut
						$(strUlListingRef).attr("focus-id", iMaxFocusId);
					}
				} else {
					//alors on descnd et on est rendu au dernier choix
					//on set l'attribut
					$(strUlListingRef).attr("focus-id", 0);
					//on met plus rien car peut vouloir faire une recherche
					//juste avec les input box
					this.setFocusedKwIds("", "");
				}
			} else {
				var el = $("#" + this.baseDivId + " " + "#lisr" + iFocusId);
				//on set le focus au LI
				el.addClass("focus");
				//
				var kIds = el.attr("keyword-ids");
				var kWord = el.attr("keyword-word");
				//on change le input box avec le contenu du LI
				this.setInputBoxText(kWord, true);
				//on set les KWids focused
				this.setFocusedKwIds(kIds, kWord);
				//on set l'attribut
				$(strUlListingRef).attr("focus-id", iFocusId);
			}
			//
		};

		//---------------------------------------------------*
		this.fetchAutoCompleteDataWithDelay = function(str) {
			//on va aller chercher les case de kwtype qu'il a coche qui se limit a trois
			//la string des case coche
			var strKwType = "";
			//on flag comme quoi on n'a pas de resultat encore du autocomplete
			this.bHaveAutoCompleteResult = false;
			//on flag comme quoi on na pas de match encore
			this.bFoundAutoCompleteMatch = false;
			//on reset le array des dernier resultat du autocomplete pour les hint
			this.arrLastHintResult = [];
			//pour le meme resultat
			this.lastSearchString = str;
			//on envoi la requete au serveur
			this.jsearch.fetchAutoCompleteData(str, strKwType)
				.then(
					function(res) {
						this.fetchAutoCompleteDataRFS(
							res.data.result,
							str,
							strKwType,
							res.data.cword
						);
					}.bind(this)
				).catch(
					function(res) {
						this.error(res.msgerrors);
						this.showResultMsg(res.usermsg);
					}.bind(this)
				);
		};

		//---------------------------------------------------*
		this.fetchAutoCompleteData = function(evnt, str) {
			//on arrete le timer si il y en avait un car la requete est nouvelle et l,autre n'est plus valide
			clearTimeout(this.timerFetchAutoComplete);
			//les event poru lesquelle on ne fera rien genre : <SHIFT + LEFT_ARROW> etc...
			if (this.arrRefusedEvent.indexOf(evnt.which) !== -1) {
				//on sort
				return;
			}
			//si c'est le <esc> on ferme le autocomplete
			if (evnt.which == "27") {
				this.hideAutoComplete();
				return;
			}
			//si le premier chars est un space alors on recule le input de 1
			if (str.charAt(0) === " ") {
				//on recule et no change le input box
				this.setInputBoxText(this.trimStringBeginning(str), false);
				//on place le cursor au debut
				this.setCarretRange(0, 0);
				//on sort pas vraiment besoin car doit faire la recherche avec ce qui reste
				//return;
			}
			//on trim les avant et apres spaces
			str = str.trim();
			//si c'est un <SPACE> avant une lettre alors ne sera pas bon car le input-bg va etre deplace
			//alors on remet le cursor au debut et on efface le input et input-bg
			if (evnt.which == "32") {
				//check si vide alors on retourne au debut de la string
				if (str == "") {
					this.setInputBoxText("", true);
					return;
				}
			}

			//les autres chars
			if (evnt.which != "13") {
				//dans le cas un c'est un debut avec char mais pas autre char apres ex: "ab " et que l,on a deja chercher pour "ab" alors on annule le search ou si c,est la meme recherche avec un backspace sur des espace <space>
				if (
					str == this.lastSearchString &&
					evnt.which != "38" &&
					evnt.which != "40"
				) {
					return;
				}
				//on reset le -bg
				//@DWIZZEL
				this.setInputBgBoxText("");
				//on check pour les <ARROW> et autres touche
				if (evnt.which == "38") {
					//GO UP
					this.changeLiFocus("up");
				} else if (evnt.which == "40") {
					//GO DOWN
					this.changeLiFocus("down");
				} else {
					//a chaque chars qu'il tape on va mettre le premier choix dans le input du BG
					//si pas vide faire la recherche
					if (str != "" && str.length >= this.minStrLen) {
						//mettre en minuscule
						str = str.toLowerCase();
						//on va fetcher le data
						//mais on va laisser un delai car peu taper tres vite (comme yves haha!) et
						//ca ne sert a rien d'aller chercher tout si il rajoute d'autre truc apres
						//on start un autre timer avec la nouvelle requete
						this.timerFetchAutoComplete = setTimeout(
							this.fetchAutoCompleteDataWithDelay.bind(this, str),
							this.timeDelay
						);
					} else {
						//on enle le result vu que lon a plus rien a chercher
						this.resetSingleAutoComplete();
						//on reset le last search car le autocomplete est disparue et si retappe la meme recherche
						//il n'ira pas la fetcher
						this.lastSearchString = '';
					}
				}
			} else {
				//press <ENTER>
				//pas etre vide
				if (str != "" && str.length >= this.minStrLen) {
					//le bloolean du fetch, //check si vide
					var bFetch = (this.focusedKwIds !== "");
					//est-ce que l'on fait une recherche texte
					//fetch le listing d'exercice en rapport avec les keyword ids
					//si il y en avait
					if (bFetch) {
						//on change le input box avec le contenu de recherche word
						//car peut-etre que les KwId sont setter mais pas le current word
						this.setInputBoxText(this.currentSearchWord, true);
						//
						this.lastSearchString = this.currentSearchWord;
						//lance la recherche et fo vers la page
						this.jsearch
							.getExerciceListingByKeywordIds(
								this.focusedKwIds,
								this.currentSearchWord
							)
							.then(
								function(res) {
									//will go away on window.location.href
								}.bind(this)
							);
						//on eneleve le autocomplete car on a quelque chose a chercher
						this.resetSingleAutoComplete();
							
					} else {
						//il ne veut rien savoir des mots du autocomplete
						//alors on lance une recherche text au serveur
						//au lieu de lui balancer des kwids
						if (this.bHaveAutoCompleteResult) {
							//si on a trouve aucun match dans le autcomplete
							//cest que on lui a proposer des  choix permuter
							//pour corriger ses fautes de frappe
							//si il envoit la recherche elle ne trouvera rien
							//vu que lon cherche deja dans les title et keywords
							//alors on lui lance le msg de submit
							if (this.bFoundAutoCompleteMatch) {
								this.jsearch
									.getExerciceListingByWords(this.lastSearchString)
									.then(
										function(res) {
											//it will go window.location.href
										}.bind(this)
									);
							} else {
								//on lui dit que son mot est soumis a notre equipe
								this.showResultMsg();
							}
						} else {
							//si on navait aucun retour dans le autocomplete alors
							//on lui dit que son mot est soumis a notre equipe
							this.showResultMsg();
						}
					}
				}
			}
		};

		//---------------------------------------------------*
		this.fetchAutoCompleteDataRFS = function(
			obj,
			word,
			kwtype,
			cleanword
		) {
			// obj = le array de retour avec les mots
			// word = le last typed word
			
			//
			var bContinue = true;
			//check pour les erreurs si il y a, mais on ne faitr rien avec pour l'instant
			if (typeof obj == "object") {
				if (typeof obj.error != "undefined") {
					bContinue = false;
				}
			}
			//continue or not
			if (bContinue && this.inputBox.refinput.is(":focus")) {
				//on va voir si on a plus que un kwtype sinon on affiche normal
				//sans de titre en plus
				var iNumRows = 0;
				//alors on deoit trouver le premier kw unique
				//car pourrait etre envoye 1,2,3
				//mais uniquement 2 pourrait avoir des retours
				for (var o in obj) {
					obj = obj[o];
					break;
				}
				iNumRows = Object.keys(obj).length;
				//si a un resultat
				if (iNumRows > 0) {
					this.bHaveAutoCompleteResult = true;
					//si on doit reset le bg hint, etc...
					var bResetHint = false;
					//on garde le premier choix que l,on va proposer dans le input-bg en gris
					if (typeof obj[0].name == "string") {
						// si le debut du mot correspond
						if (obj[0].name.toLowerCase().indexOf(word) === 0) {
							//le premier LI
							//si on le garde cest ce qui sera lance
							this.firstLiWord = obj[0].name;
							//set le input-bg
							this.setInputBgBoxText(this.firstLiWord);
							//on efface les kwids l'usager ne l' pas choisi de lui meme
							this.setFocusedKwIds("", "");
						} else {
							bResetHint = true;
						}
					} else {
						bResetHint = true;
					}
					var arrWords = cleanword.split(" ");
					if (typeof arrWords != "object") {
						arrWords = [];
					}
					//get la position du serach box
					var iCmpt = 1;
					var data =
						'<UL class="listing" focus-id="0" focus-id-max="' + iNumRows + '">';
					var bFoundMatch = false;
					//loop data
					for (var o in obj) {
						if (
							typeof obj[o].name == "string" &&
							(typeof obj[o].id == "string" || typeof obj[o].id == "number")
						) {
							//on garde des resultat pour des hint dans la
							//proposition a lusager lors de aucun result
							this.arrLastHintResult.push(obj[o]);
							//change to blue hint if word substr is found in the text
							var strLiText = obj[o].name;
							var strMatch = "";
							for (var p in arrWords) {
								strMatch += "^" + arrWords[p] + "|[ ]{1}" + arrWords[p] + "|";
							}
							//strip last pipe
							if (strMatch != "") {
								strMatch = strMatch.substr(0, strMatch.length - 1);
								strLiText = strLiText.replace(
									new RegExp(strMatch, "gi"),
									function(m) {
										bFoundMatch = true;
										return '<span class="hint">' + m + "</span>";
									}
								);
							}
							//Le <LI>
							data += this.buildLI('single-result', obj[o], strLiText, iCmpt++, kwtype);
						}
					}
					data += "</UL>";
					//si ion ne trouve pas de hint
					if (bResetHint) {
						//set le input-bg
						this.setInputBgBoxText("");
						//le premier LI
						this.firstLiWord = '';
						//on set les KWids focused
						this.setFocusedKwIds("", "");
					}
					//flasg de match pour quand il appui enter quand meme
					//car peut etre un permutation de lettre
					if (bFoundMatch) {
						this.bFoundAutoCompleteMatch = true;
					}
					//on ajoute le data
					$("#" + this.baseDivId)
						.html(data)
						//on show
						.css({ display: "block" });
					//on quitte
					return;
				} else {
					//pas de resultat alors on enleve le li et les focused kw ids
					this.firstLiWord = '';
					this.setFocusedKwIds("", "");
					//on nettoie le input box bg
					this.setInputBgBoxText("");
					//on dit que lon a rien
					var data =
						'<UL class="listing" focus-id="0" focus-id-max="0"><LI class="single-result-title">' +
						this.jlang.t("no_result") +
						"</LI></UL>";
					//on ajoute le data
					$("#" + this.baseDivId)
						.html(data)
						//on show
						.css({ display: "block" });
					//on sen va byebye!
					return;
				}
			}
			//si on est la alors pas besoin on remove
			this.resetSingleAutoComplete();
		};

		//---------------------------------------------------*
		this.triggerInputEvent = function(strInputName) {
			var ev = $.Event("keyup");
			ev.which = 13; // <ENTER>
			$("#" + strInputName).trigger(ev);
		};

		//---------------------------------------------------*
		this.addInputBox = function() {
			var strContainerInput = this.inputBox.layer + "-div";
			//str html
			//le container des inputs
			var str = '<div id="' + strContainerInput + '">';
			//div container box for positionning
			//le input en bg aura toujours le meme nom avec "-bg" en plus
			str +=
				'<div class="input"><input name="' +
				this.inputBox.input +
				'-bg" id="' +
				this.inputBox.input +
				'-bg" type="text" disabled autocomplete="off" maxlength="256" spellcheck="false" value="' +
				this.currentSearchWord +
				'" class="input-bg" placeholder="' +
				this.jlang.t("recherche") +
				'"></div>';
			//le input principal
			str +=
				'<div class="input"><input name="' +
				this.inputBox.input +
				'" id="' +
				this.inputBox.input +
				'" class="translucide" type="text" autocomplete="off" maxlength="256" spellcheck="false" value="' +
				this.currentSearchWord +
				'"></div>';
			//le auto complete
			str +=
				'<div id="' + this.baseDivId + '" class="kw-content-result"></div>';
			//ferme le div container
			str += "</div>";
			//on va creer le input box dans le laqyer desire
			$("#" + this.inputBox.layer).html(str);
			//on va setter le focus dessus
			if (this.bFocusOnInput) {
				$("#" + this.inputBox.input).focus();
			}
			//le ref du onject jqeury selector pour eviter de reparcourrir a chaque fois
			//ajoute au array
			this.inputBox = Object.assign(this.inputBox, {
				refresult: $("#" + strContainerInput),
				refinput: $("#" + this.inputBox.input),
				refinputbg: $("#" + this.inputBox.input + "-bg")
			});
			//all inputs keyup
			//selon le type serach
			this.inputBox.refinput.keyup(
				$.proxy(function(e) {
					this.fetchAutoCompleteData(
						e,
						$(e.target).val()
					);
				}, this)
			);
		};

		//---------------------------------------------------*
		this.resetMainAutoComplete = function() {
			//le auto complete
			$("#" + this.baseDivId)
				.css({ display: "none" })
				.text("");
		};

		//---------------------------------------------------*
		this.resetSingleAutoComplete = function() {
			//le auto complete
			$("#" + this.baseDivId)
				.css({ display: "none" })
				.text("");
			//
			this.setFocusedKwIds("", "");
		};

		//---------------------------------------------------*
		this.hideAutoComplete = function() {
			//le auto complete
			$("#" + this.baseDivId).css({ display: "none" });
		};

		//---------------------------------------------------*
		this.resetSearchInputBox = function() {
			//all inputs
			this.setInputBgBoxText("");
			//
			this.setFocusedKwIds("", "");
			//
			this.setInputBoxText("", true);
			//le auto complete
			this.resetMainAutoComplete();
		};

		//---------------------------------------------------*
		this.showResultMsg = function() {
			//if we had another message to show, like on service failed
			var msg = (typeof arguments[0] !== 'undefined') ? arguments[0] : this.jlang.t("no_result_for_word");
			//si on avait des resultat de hint dans le autocomplete
			//on pourrait lui proposer ceux-la
			if (this.bHaveAutoCompleteResult) {
				msg += ".&nbsp;" + this.jlang.t("you_can_try_the_hints_bellow");
				//les hints propose avant si clique dessus
				//va le rajouter dans la case texte et
				//relancer le fetch autocomplete
				var iCmpt = 1;
				for (var o in this.arrLastHintResult) {
					msg += this.buildLI('single-hint', this.arrLastHintResult[o], this.arrLastHintResult[o].name, iCmpt++, '');
				}
			}
			//on met le conenu du msg dans le LI avaec un tag title
			var data =
				'<UL class="listing" focus-id="0" focus-id-max="0"><LI class="single-result-msg">' +
				msg.replace('{{WORD}}', '<b>"' +  this.lastSearchString + '"</b>') +
				"</LI></UL>";
			//on ajoute le data
			$("#" + this.baseDivId).html(data);
			//on show
			$("#" + this.baseDivId).css({ display: "block" });
			//on met l'action sur les single-hints si on en avait evidement
			if (this.bHaveAutoCompleteResult && this.arrLastHintResult.length > 0) {
				$("#" + this.baseDivId + " .single-hint").click(
					$.proxy(function(e) {
						e.preventDefault();
						this.setInputFromHint($(e.target).attr("keyword-word"));
					}, this)
				);
			}
			//
		};

		//---------------------------------------------------*
		this.setInputFromHint = function(word) {
			//on va setter le input box comme si on avait fait
			//une recherche en tapant du texte
			this.setInputBoxText(word, true);
			//set le focus sur input
			this.inputBox.refinput.focus();
			//on creer un fake event sur le input box
			var evnt = $.Event("keyup", {
				which: 0, //un rien
				/*
				keyCode: 13,
				which: 13, //un rien
				key: "Enter",
				type: "keyup"
				*/
			});
			//on enleve le autoaocmplgte
			this.hideAutoComplete();
			//et on fait comme si on avait tape
			this.fetchAutoCompleteData(evnt, word);
		};

		//---------------------------------------------------*
		this.buildLI = function(clss, obj, text, iCmpt, kwtype) {
			return '<LI class="' + 
			clss + 
			'" keyword-ids="' +
			obj.id +
			'" keyword-word="' +
			obj.name +
			'" keyword-type ="' +
			kwtype +
			'" li-pos="' +
			iCmpt +
			'" id="lisr' +
			iCmpt +
			'">' +
			text +
			"</LI>";

		};

		//---------------------------------------------------*
		//add general click event on LI single-result
		this.addLiSingleResultOnClick = function() {
			$('#' + this.baseDivId).on('click', '.single-result', 
				$.proxy(function(e) {
					e.preventDefault();
					var keywordIds = $(e.target).attr("keyword-ids");
					var keywordWord = $(e.target).attr("keyword-word");
					//set le input  et nput-bg
					this.setInputBoxText(keywordWord, true);
					//set le focus sur input
					this.inputBox.refinput.focus();
					//set les keywords ids focused
					this.setFocusedKwIds(keywordIds, keywordWord);
					//fetch le listing d'exercice en rapport avec les keyword ids
					if (this.focusedKwIds !== "") {
						//
						this.lastSearchString = this.currentSearchWord;
						//fetch
						this.jsearch
							.getExerciceListingByKeywordIds(
								this.focusedKwIds,
								this.currentSearchWord
							)
							.then(
								function(res) {
									//will go away on window.location.href
								}.bind(this)
							);
						//on eneleve le autocomplete
						this.resetSingleAutoComplete();	
					}
				}, this)
			);
		};

		//----------------------------------------------------------
		//inject code in them for debugging
		this.setClassHook();
	};

//EOF