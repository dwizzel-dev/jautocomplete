/*

Author: DwiZZel
Date: 15-07-2016
Version: V.1.0 BUILD 001

*/

//----------------------------------------------------------------------------------------------------------------------

window.JSearch =
	window.JSearch ||
	function() {
		//extend abstract methods
		$.extend(this, new ADebug(arguments[0].debug));

		this.className = arguments.callee.name;
		this.args = arguments[0];

		//----------------------------------------------------------
		this.init = function() {
			//
			this.jcomm = this.args.jcomm;
		};

		//----------------------------------------------------------
		this.fetchAutoCompleteData = function(str, strKwType) {
			return new Promise(
				this.jcomm.process.bind(
					this.jcomm, 
					"search", 
					"fetch-autocomplete", 
					{
						word: str,
						kwtype: strKwType
					}
				)
			);
		};

		//----------------------------------------------------------
		this.getExerciceListingByWords = function(str) {
			return new Promise(
				this.jcomm.process.bind(
					this.jcomm,
					"search",
					"get-exercice-listing-by-words",
					{
						word: str
					}
				)
			);
		};

		//----------------------------------------------------------
		this.getExerciceListingByKeywordIds = function(strIds, str) {
			return new Promise(
				this.jcomm.process.bind(
					this.jcomm,
					"search",
					"get-exercice-listing-by-keyword-ids",
					{
						ids: strIds,
						word: str
					}
				)
			);
		};

		//----------------------------------------------------------
		//inject code in them for debugging
		this.setClassHook();
	};

//EOF
