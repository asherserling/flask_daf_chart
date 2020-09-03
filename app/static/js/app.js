var currentMasechta;

function buildDropdown() {
	var masechtas = allData.masechtas;

	if (typeof masechtas === 'undefined') {
		return;
	}
	
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
	var summary = snippetsObj.pledgeSummary;
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
	var masechtaSummary = snippetsObj.masechtaSummary;
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
	var cardHtml = snippetsObj.masechtaCard;
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
