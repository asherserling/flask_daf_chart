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
