 // Create dropdown bar. First load up the data object, then loop over the masechtos, creating a dropdown link with each one's name

//

var allData;
$ajaxUtils.sendGetRequest("http://127.0.0.1:5000/data", function (response) {
	allData = response;
	buildDropdown();
});

var summaryTemplate;
$ajaxUtils.sendGetRequest("snippets/summary.html", function (response) {
	summaryTemplate = response;
}, false);

var masechtaCardTemplate;
 $ajaxUtils.sendGetRequest("snippets/masechta-card.html",
	function (response) {
		masechtaCardTemplate = response;
	}, false);

 var masechtaSummaryTemplate;
 $ajaxUtils.sendGetRequest("snippets/masechta-summary.html",
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
	var masechtos = allData.masechtos;
	var buildMasechtaFrame = "buildMasechtaFrame('{{name}}');"
	var dropDownLink = '<a class="dropdown-item" onclick=' + buildMasechtaFrame + '  href="#">{{name}}</a>'
	var seperator = '<div class="dropdown-divider"></div>'

	var dropDownMenu = '';
	var numOfMasechtos = Object.keys(masechtos).length;
	var counter = 1;
	
	for (var masechta in masechtos) {
		var template = dropDownLink;
		dropDownMenu += populateTemplate(template, "name", masechta);
		if (counter < numOfMasechtos) {
			dropDownMenu += seperator;
		}
		counter += 1;
	}

	insertHtml(".dropdown-menu", dropDownMenu);
}

function showSummary () {
	var summary = summaryTemplate;
	summary = populateTemplate(summary, "completed", allData.summary.completed);
	summary = populateTemplate(summary, "remaining", allData.summary.remaining);
	insertHtml("#main-content", summary);
}
document.querySelector(".navbar-brand").addEventListener("click", showSummary);

function buildMasechtaFrame (masechta) {
	currentMasechta = allData.masechtos[masechta];
	var masechtaFrameHtml = buildMasechtaSummary(masechta);
	masechtaFrameHtml += buildMasechtaCards();
	insertHtml("#main-content", masechtaFrameHtml);
}

function buildMasechtaSummary (masechta) {
	var masechtaSummary = masechtaSummaryTemplate;
	masechtaSummary =  populateTemplate(masechtaSummary, "name", masechta);
	masechtaSummary = populateTemplate(masechtaSummary, "completed", currentMasechta.completed);
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
	cardHtml = populateTemplate(cardHtml, "nth", nthify(i));
	cardHtml = populateTemplate(cardHtml, "daf", convertToAmud(currentMasechta.repetitions[i.toString()]));
	cardHtml = populateTemplate(cardHtml, "number", i);
	return cardHtml;
}

function completedAmud(i) {
	currentMasechta.repetitions[i.toString()] += 1;
	currentMasechta.completed += .5;
	allData.summary.completed += .5;
	allData.summary.remaining -= .5;
	insertText(".masechta-progress__total", "Total Daffim Learnt: " + currentMasechta.completed);
	insertText(".round" + i, convertToAmud(currentMasechta.repetitions[i.toString()]));
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
		1: "First", 2: "Second", 3: "Third", 4: "Fourth", 5: "Fifth", 6: "Sixth", 7: "Seventh", 8: "Eigth"
	};
	console.log(i);
	return nths[i];
}