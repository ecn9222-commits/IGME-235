window.onload = (e) => {
    // generate list of categories
    getCategories("https://opentdb.com/api_category.php");
    // add functionality to generate questions
    document.querySelector("#generate").onclick = generateButtonClicked
    // Add reveal to default button
    document.querySelector(".q_reveal").onclick = revealAnswer;
    
    // Add switch method to switch display button
    document.querySelector("#switchDisplay").onclick = switchDisplay;
    currentlyCarousel = true;
    console.log(currentlyCarousel);
    // Get references to the divs used to move/change display
    carouselInnerDiv = document.querySelector(".carousel-inner");
    showAllDiv = document.querySelector("#showAll");
    slideshowDiv = document.querySelector("slideshow");

};

let category = "";
let currentlyCarousel;
let carouselInnerDiv;
let showAllDiv;
let slideshowDiv;

function getCategories(url) {
    // create new XHR object
    let xhr = new XMLHttpRequest();

    // set the onload handler
    xhr.onload = categoriesLoaded;

    // set the onerror handler
    xhr.onerror = dataError;

    // open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

function categoriesLoaded(e) {
    // event.target is the xhr object
    let xhr = e.target;

    // xhr.responseText is the JSON file we just downloaded
    console.log(xhr.responseText);

    // turn the text into a parsable JavaScript object
    let obj = JSON.parse(xhr.responseText);

    // if there are no results, print a message to console and return
    if (!obj.trivia_categories || obj.trivia_categories.length == 0) {
        // document.querySelector("#status").innerHTML = "<b> No results found for '" + displayTerm + "'</b>";
        console.log("error loading categories");
        return; // Bail out
    }

    // Start building an HTML string we will display to the user
    let results = obj.trivia_categories;
    console.log("results.length = " + results.length);
    // let bigString = "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
    let bigString = "";

    // Add "select a category" and "any category", which both pull q's from any category
    bigString += '<option value="-1">Select A Category</option><option value="-1">Any Category</option>';

    // loop through the array of results
    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        // get the categories ID number
        let idNum = result.id;

        // get name of the category
        let name = result.name;

        // Build a select option for each
        let line = `<option value='${idNum}'>${name}</option>`;

        // add the <option> to 'bigString' and loop
        bigString += line;
    }

    // all done building the HTML = show it to the user
    document.querySelector("#category").innerHTML = bigString;

    // update the status
    // document.querySelector("#status").innerHTML = "<b>Success!</b>" + "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
}

function generateButtonClicked() {
    console.log("generateButtonClicked() called");

    const TB_URL = "https://opentdb.com/api.php?";

    let url = TB_URL;

    let amount = document.querySelector("#num_questions").value;
    url += "amount=" + amount;

    let category_term = document.querySelector("#category").value;
    category = category_term;
    // category_term = category_term.trim()
    // category_term = encodeURIComponent(category_term);
    if (category_term.length < 1) return;
    if (category_term != "-1") {
        url += "&category=" + category_term;
    }

    // Set to onlu true/false qs
    url += "&type=boolean";

    // update the UI
    // document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

    // see what the URL looks like
    console.log(url);

    // Request data
    getData(url);

}

function getData(url) {
    // create new XHR object
    let xhr = new XMLHttpRequest();

    // set the onload handler
    xhr.onload = dataLoaded;

    // set the onerror handler
    xhr.onerror = dataError;

    // open connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

// Callback functions
function dataLoaded(e) {
    // event.target is the xhr object
    let xhr = e.target;

    // xhr.responseText is the JSON file we just downloaded
    console.log(xhr.responseText);

    // turn the text into a parsable JavaScript object
    let obj = JSON.parse(xhr.responseText);

    // if there are no results, print a message and return
    if (!obj.results || obj.results.length == 0) {
        // document.querySelector("#status").innerHTML = "<b> No results found for '" + category + "'</b>";
        console.log("bail");
        return; // Bail out
    }

    document.querySelector("h2.q_question").innerHTML = "<h2>test question</h2>";

    // Start building an HTML string we will display to the user
    let results = obj.results;
    console.log("results.length = " + results.length);
    // let bigString = "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
    let bigString = "";

    // loop through the array of results
    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        // get the question
        let question = result.question;

        let answer = result.correct_answer;

        // build a div for the question
        let line = "<div class='carousel-item";
        if (i == 0) line += " active";
        line += "'><div class='q_content d-block w-100 rounded-5'>";
        line += `<h3 class="q_num">Question #${i + 1}</h3>`;
        line += `<h2 class="q_question">${question}</h2>`;
        line += `<p class="q_answer">${answer}</p>`;
        line += '<button type="button" class="q_reveal">Reveal Answer</button>';
        line += '</div></div>';

        // document.querySelector(".carousel-inner").appendChild(line);
        console.log("q added");
        console.log("line");

        // add the <div> to 'bigString' and loop
        bigString += line;
    }

    // all done building the HTML = show it to the user
    document.querySelector(".carousel-inner").innerHTML = bigString;

    // add revealAnswer to each button's onclick
    let revealButtons = document.getElementsByClassName("q_reveal");
    for (let button of revealButtons) {
        button.onclick = revealAnswer;
    }

    // update the status
    // document.querySelector("#status").innerHTML = "<b>Success!</b>" + "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
}

function dataError(e) {
    console.log("An error occurred");
}

function revealAnswer(e) {
    let revealButton = e.target;
    console.log(revealButton);

    let answerText = revealButton.previousElementSibling;

    answerText.style.visibility = "visible";
}

// Method to switch questions between displays
function switchDisplay() {
    if (currentlyCarousel) {
        
    }
    else {

    }
}