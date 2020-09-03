// Get user data
var allData;
$.get("/data", function (response) {
	allData = JSON.parse(response);
	buildDropdown();
});

// Get html snippets, store in snippetsObj
var snippetsObj;
$.get("/static/snippets/snippets.html", function (response) {
	var snippetsText = response;
	
	var makeSnippetsObj = function () {
		var snippetsArray = snippetsText.split('@');

		return {
			pledgeSummary : snippetsArray[0],
			masechtaSummary : snippetsArray[1],
			masechtaCard : snippetsArray[2]
		}
	};

	snippetsObj = makeSnippetsObj();
});
