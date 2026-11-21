window.onload = (e) => {
    // generate list of categories
    getCategories("https://opentdb.com/api_category.php");
    // Category is set equal to webdata within methods b/c of load orders

    // Set number questions equal to stored webdata
    numQ = localStorage.getItem(numQKey);
    // If a stored number questions was found, set select element to that number questions
    if (numQ) {
        document.querySelector("#num_questions").value = numQ;
    }

    // add functionality to generate questions
    document.querySelector("#generate").onclick = generateButtonClicked
    // style starting box
    document.querySelector(".q_question").style.gridArea = "question";

    // Add switch method to switch display button
    document.querySelector("#switchDisplay").onclick = switchDisplay;
    currentlyCarousel = true;
    // Get references to the divs used to move/change display
    carouselInnerDiv = document.querySelector(".carousel-inner");
    showAllDiv = document.querySelector("#showAll");
    questionsDiv = document.querySelector("#questions");
    carouselPeekDiv = document.querySelector("#carouselPeek");

};

let category = "";
let numQ;
let currentlyCarousel;
let carouselInnerDiv;
let showAllDiv;
let questionsDiv;
let carouselPeekDiv;

// For saving the selected category in webstorage
const prefix = "ecn9222-";
const categoryKey = prefix + "category";
const numQKey = prefix + "numQ";

// Opens/handles getting an xhr request for the categories,
// and then calling appropriate functions based on results
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

// Handles updating the html if the categories were successfully
// loaded from the API
function categoriesLoaded(e) {
    // event.target is the xhr object
    let xhr = e.target;

    // xhr.responseText is the JSON file we just downloaded
    // console.log(xhr.responseText);

    // turn the text into a parsable JavaScript object
    let obj = JSON.parse(xhr.responseText);

    // if there are no results, print a message to console and return
    if (!obj.trivia_categories || obj.trivia_categories.length == 0) {
        console.log("error loading categories");
        return; // Bail out
    }

    // Start building an HTML string we will display to the user
    let results = obj.trivia_categories;
    // console.log("results.length = " + results.length);
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

    // Set category equal to stored webdata
    category = localStorage.getItem(categoryKey);
    // If a stored category was found, set select element to that category
    if (category) {
        document.querySelector("#category").value = category;
    }
}

// Called when the generate button is clicked. Handles builing
// url that is then used to open an xhr request. Also updated the
// browser local storage
function generateButtonClicked() {
    document.querySelector(".carousel-inner").innerHTML = "<h2>Loading questions...</h2>";
    document.querySelector(".carousel-overlay-controls").style.visibility = "hidden";

    const TB_URL = "https://opentdb.com/api.php?";

    let url = TB_URL;

    let amount = document.querySelector("#num_questions").value;
    url += "amount=" + amount;

    let category_term = document.querySelector("#category").value;
    category = category_term;
    if (category_term.length < 1) return;
    // If "Choose a Category" or "Any Category" is selected, the value of catergory_term
    // will be -1 and the category attribute will not be added to the URL. This
    // means that questions returned by the API will be from any category 
    if (category_term != "-1") {
        url += "&category=" + category_term;
    }

    // see what the URL looks like
    // console.log(url);

    // Update web storage
    localStorage.setItem(categoryKey, category);
    localStorage.setItem(numQKey, amount);

    // Request data
    getData(url);

}

// Opens/handles getting an xhr request for the questions,
// and then calling appropriate functions based on results 
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

// Calls if the xhr request for the questions was successful.
// Updates the DOM with the new questions
function dataLoaded(e) {
    // event.target is the xhr object
    let xhr = e.target;

    // xhr.responseText is the JSON file we just downloaded
    // console.log(xhr.responseText);

    // turn the text into a parsable JavaScript object
    let obj = JSON.parse(xhr.responseText);

    // if there are no results, print a message and return
    if (!obj.results || obj.results.length == 0) {
        // console.log("bail");
        document.querySelector(".carousel-inner").innerHTML = "<h2>An error occurred while loading questions. Please wait a few seconds and try again.";
        return; // Bail out
    }

    // Start building an HTML string we will display to the user
    let results = obj.results;
    // console.log("results.length = " + results.length);
    document.querySelector(".carousel-overlay-controls").style.visibility = "visible";
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

        // Build a display of all possible answers
        // value of the div is the correct answer
        line += `<div class="q_possibleAnswers" data-value="${answer}"><h3>Options:</h3>`;
        let possibleAnswers = result.incorrect_answers;
        possibleAnswers[possibleAnswers.length] = result.correct_answer;
        while (possibleAnswers.length > 0) {
            let randIndex = Math.random();
            randIndex *= possibleAnswers.length;
            randIndex = Math.floor(randIndex);

            // line += `<p>${possibleAnswers[randIndex]}</p>`;
            line += `<div><input type="radio" id="${possibleAnswers[randIndex]}${i + 1}" name="answerOptions${i + 1}" value="${possibleAnswers[randIndex]}" /><label for="${possibleAnswers[randIndex]}${i + 1}">${possibleAnswers[randIndex]}</label></div>`;

            possibleAnswers.splice(randIndex, 1);
        }
        line += '</fieldset></div>';
        line += '<p class="q_checkResult">No Result Yet</p>'
        line += '<button type="button" class="q_checkAnswers">Check Answer!</button>';

        // continue building div for question
        line += `<p class="q_answer">${answer}</p>`;
        line += '<button type="button" class="q_reveal">Reveal Answer</button>';
        line += '</div></div>';

        // add the <div> to 'bigString' and loop
        bigString += line;
    }

    // all done building the HTML = show it to the user
    document.querySelector(".carousel-inner").innerHTML = bigString;

    // add revealAnswer to each button's onclick
    let revealButtons = document.getElementsByClassName("q_reveal");
    for (let button of revealButtons) {
        button.disabled = true;
        button.onclick = revealAnswer;
    }
    let checkButtons = document.getElementsByClassName("q_checkAnswers");
    for (let button of checkButtons) {
        button.onclick = checkAnswer;
    }
    let checkResults = document.getElementsByClassName("q_checkResult");
    for (let p of checkResults) {
        p.style.visibility = "hidden";
    }
}

// Called when there is an error loading data (either categories or questions)
function dataError(e) {
    // console.log("An error occurred");
    document.querySelector(".carousel-inner").innerHTML = "<h2>An error occurred while loading data. Please wait a few seconds and try again.";
}

// Called when the "reveal answer" button is clicked. Disables the button
// after the answer is revealed.
function revealAnswer(e) {
    let revealButton = e.target;

    let answerText = revealButton.previousElementSibling;

    answerText.style.visibility = "visible";
    revealButton.disabled = true;
}

// Method to switch questions between display options.
// Called when the "Display All Questions"/"Display One Question"
// button is clicked.
function switchDisplay(e) {
    if (currentlyCarousel) {
        // Code to switch
        // Move to show all div
        showAllDiv.appendChild(carouselInnerDiv);
        // Hide questions div
        questionsDiv.style.display = "none";
        // Show show all div
        showAllDiv.style.display = "block";
        // Change to vertical flex direction
        carouselInnerDiv.style.flexDirection = "column";
        carouselInnerDiv.style.gap = "2rem";
        carouselInnerDiv.style.alignItems = "normal";

        // Change bool tracker
        currentlyCarousel = false;

        // Change button text
        e.target.textContent = "Display One Question";
    }
    else {
        // Code to switch
        // Move to carousel
        carouselPeekDiv.appendChild(carouselInnerDiv);
        // Hide show all div\
        showAllDiv.style.display = "none";
        // Show questions div
        questionsDiv.style.display = "block";
        // Change back to row flex
        carouselInnerDiv.style.flexDirection = "row";
        carouselInnerDiv.style.gap = "";
        carouselInnerDiv.style.alignItems = "center";

        // Change bool tracker
        currentlyCarousel = true;

        // Change button text
        e.target.textContent = "Display All Questions";
    }
}

// Called when the "Check Answer!" button is clicked.
// Checks that an answer has been seleced. If one has, it sets
// the radio input options and the check answer button to disabled to "lock in"
// the user's answer, changes the DOM to display whether the answer was correct,
// and enables the button that allows the user to reveal the answer.
function checkAnswer(e) {
    // Get the check button which was checked
    let checkButton = e.target;
    // Get the radio set group name for this question
    let answerGroupName = checkButton.previousElementSibling.previousElementSibling.querySelector("input").name;

    // Get the currently selected answer
    let selectedAnswer = document.querySelector(`input[name="${answerGroupName}"]:checked`)?.value;

    // end method if nothing selected
    if (selectedAnswer == undefined) {
        // console.log("No answer selected");
        return;
    }

    let checkResultsP = checkButton.previousElementSibling;
    if (checkButton.previousElementSibling.previousElementSibling.dataset.value == selectedAnswer) {
        checkResultsP.innerHTML = "Correct!";
    }
    else {
        checkResultsP.innerHTML = "Incorrect.";
    }
    checkResultsP.style.visibility = "visible";
    checkButton.disabled = true;

    // disable radios for this question
    let answerRadios = document.querySelectorAll(`input[name="${answerGroupName}"]`);
    answerRadios.forEach(radio => {
        radio.disabled = true;
    });

    // enable reveal answer button
    checkButton.nextElementSibling.nextElementSibling.disabled = false;
}