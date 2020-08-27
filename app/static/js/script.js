var allData;
$ajaxUtils.sendGetRequest("/data", function (response) {
	allData = response;
	buildDropdown();
});

var snippets = "/static/snippets/"

var summaryTemplate;
$ajaxUtils.sendGetRequest(snippets + "summary.html", function (response) {
	summaryTemplate = response;
}, false);

var masechtaCardTemplate;
 $ajaxUtils.sendGetRequest(snippets + "masechta-card.html",
	function (response) {
		masechtaCardTemplate = response;
	}, false);

 var masechtaSummaryTemplate;
 $ajaxUtils.sendGetRequest(snippets + "masechta-summary.html",
	function (response) {
		masechtaSummaryTemplate = response;
	}, false);

var currentMasechta;

function insertHtml (selector, html) {
	var targetElem = document.querySelector(selector);
	targetElem.innerHTML = html;
}

function insertText (selector, text) {
	var targetElem = document.querySelector(selector);
	targetElem.innerText = text;
}

function populateTemplate (template, variable, value) {
	variable = "{{" + variable + "}}";
	return template.replace(new RegExp(variable, "g"), value);
}

function buildDropdown() {
	var masechtas = allData.masechtas;
	var buildMasechtaFrame = "buildMasechtaFrame('{{masechta_index}}');"
	var dropDownLink = '<a class="dropdown-item" onclick=' + buildMasechtaFrame + '  href="#">{{name}}</a>'
	var seperator = '<div class="dropdown-divider"></div>'

	var dropDownMenu = '';
	var numOfMasechtos = Object.keys(masechtas).length;
	var counter = 1;
	
	for (var i in masechtas) {
		var masechta = masechtas[i].name
		var template = dropDownLink;
		template = populateTemplate(template, "masechta_index", i)
		dropDownMenu += populateTemplate(template, "name", masechta);

		if (counter < numOfMasechtos) {
			dropDownMenu += seperator;
		}
		counter += 1;
	}

	insertHtml(".dropdown-menu", dropDownMenu);
}

function buildSummary () {
	var summary = summaryTemplate;
	summary = populateTemplate(summary, "pledge", allData.summary.pledge);
	summary = populateTemplate(summary, "completed", allData.summary.completed);
	summary = populateTemplate(summary, "remaining", allData.summary.remaining);
	summary = populateTemplate(summary, "average", allData.summary.average);
	insertHtml(".main-content", summary);
}
document.querySelector(".navbar-brand").addEventListener("click", buildSummary);

function buildMasechtaFrame (masechta_index) {
	currentMasechta = allData.masechtas[masechta_index];
	var masechtaFrameHtml = buildMasechtaSummary();
	masechtaFrameHtml += buildMasechtaCards();
	insertHtml(".main-content", masechtaFrameHtml);
}

function buildMasechtaSummary () {
	var masechtaSummary = masechtaSummaryTemplate;
	masechtaSummary =  populateTemplate(masechtaSummary, "name", currentMasechta.name);
	masechtaSummary = populateTemplate(masechtaSummary, "length", currentMasechta.length);
	return masechtaSummary;
}


 
function buildMasechtaCards () {
	amountOfReps = currentMasechta.repetitions.amount;
	cardsHtml = '';
	for (var i = 1; i < amountOfReps + 1; i++) {
		cardsHtml += buildCard(i);
	}
	return cardsHtml;
}

function buildCard(i) {
	var cardHtml = masechtaCardTemplate;
	var field_name = convertToRepetitionField(i);
	var pageNo = currentMasechta.repetitions[field_name];
	amud = convertToAmud(pageNo);

	if (tooFarAhead(pageNo, i)) {
		amud = amud.strike();
	}

	if (pageNo > currentMasechta.length) {
		amud = 'Complete';
	}

	cardHtml = populateTemplate(cardHtml, "nth", nthify(i));
	cardHtml = populateTemplate(cardHtml, "daf", amud);
	cardHtml = populateTemplate(cardHtml, "number", i);
	return cardHtml;
}

function tooFarAhead(pageNo, fieldNo) {
	if (fieldNo !== 1) {

		fieldName = convertToRepetitionField(fieldNo);
		previousFieldName = convertToRepetitionField(fieldNo-1);
		reps = currentMasechta.repetitions;

		if (reps[fieldName] >= reps[previousFieldName]) {
			return true;
		}

	}
	return false;
}

function completeAmud(fieldNo) {
	fieldNo = parseInt(fieldNo);
	var fieldName = convertToRepetitionField(fieldNo);
	var reps = currentMasechta.repetitions;
	var summary = allData.summary;

	if (blockImpossibleLearning()) {
		return;
	}
	updateInternalData();
	updateExternalData();
	postAmudData(fieldName);


	function blockImpossibleLearning () {
			if (fieldNo !== 1) {
			previousFieldName = convertToRepetitionField(fieldNo-1);

			if (reps[fieldName] >= reps[previousFieldName]) {
				return true;
			}
		}
		if (reps[fieldName] > currentMasechta.length) {
			return true;
		}
		return false;
	}

	function updateInternalData () {
		reps[fieldName] += 1;
		currentMasechta.completed += .5;
		summary.completed += .5;
		summary.remaining -= .5;
		setAverage();

		function setAverage() {
			var startDate = new Date(summary.start_date);
			var today = new Date();
			var diff = today - startDate;
			var elapsedDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
			average = summary.completed / elapsedDays;
			summary.average = round(average, 1);
		}
	}
	
	function updateExternalData() {
		var pageNo = reps[fieldName];
		updateCurrentField();
		updateNextField();

		function updateCurrentField () {
			if (pageNo > currentMasechta.length) {
				insertHtml(".round" + fieldNo.toString(), 'Complete');
			}

			else {
				var amud = convertToAmud(pageNo);
				if (tooFarAhead(pageNo, fieldNo)) {
					amud = amud.strike();
				}

				insertHtml(".round" + fieldNo.toString(), amud);																		
			}
		}
		
		function updateNextField() {
				if (fieldNo !== reps.amount) {
				var nextFieldName = convertToRepetitionField(fieldNo+1);
				
				if (reps[fieldName] - reps[nextFieldName] === 1) {
					var nextFieldPageNo = reps[nextFieldName];
					insertText(".round" + (fieldNo+1), convertToAmud(nextFieldPageNo));
				}
			}
		}
	}	
}

function postAmudData(repetitions_field_name) {
	var amudData = {
		'row_id': currentMasechta.row_id,
		'field': repetitions_field_name,
		'value': currentMasechta.repetitions[repetitions_field_name],
		'amount': currentMasechta.repetitions.amount
	}
	amudData = JSON.stringify(amudData);
	$.post('/data', {"amud_data": amudData});
}

function convertToAmud (page) {
	if (page % 2 == 0) {
		return page / 2 + "b";
	}
	else {
		return Math.floor(page / 2) + 1 + "a";
	}
}

function nthify (i) {
	var nths = {
		1: "First", 2: "Second", 3: "Third", 4: "Fourth", 5: "Fifth", 6: "Sixth", 7: "Seventh"
	};
	return nths[i];
}

function convertToRepetitionField (i) {
	var fields = {
		1: 'first_time', 2: 'second_time', 3: 'third_time', 4: 'fourth_time', 5: 'fifth_time', 6: 'sixth_time', 7: 'seventh_time'
	}
	return fields[i];
}

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}