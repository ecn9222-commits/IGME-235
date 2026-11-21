window.onload = (e) => {
    // generate list of categories
    // getCategories("https://opentdb.com/api_category.php");
    // add functionality to generate questions
    document.querySelector("#generate").onclick = generateButtonClicked
};

let category = "";

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
    if (!obj.results || obj.results.length == 0) {
        // document.querySelector("#status").innerHTML = "<b> No results found for '" + displayTerm + "'</b>";
        console.log("error loading categories");
        return; // Bail out
    }

    // Start building an HTML string we will display to the user
    let results = obj.results;
    console.log("results.length = " + results.length);
    // let bigString = "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
    let bigString = "";

    // loop through the array of results
    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        // get the categories ID number
        let idNum = result.id;

        // get name of the category
        let name = result.name;

        // Build a select option for each
        let line = `<option value='${id}'>${name}</option>`;

        // add the <option> to 'bigString' and loop
        bigString += line;
        
        // add line as a new child to category
        // document.querySelector("#category").appendChild(line);
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
    category_term = category_term.trim()
    category_term = encodeURIComponent(category_term);
    if (category_term.length < 1) return;
    url += "&category=" + category_term;

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


        // Build a <div> to hold each result
        // ES6 string templating
        // let line = `<div class='result'><img src='${smallURL}' title='${result.id}' />`;
        // line += `<span><a target='_blank' href='${url}'>View on Giphy></a><br>Rating: ${result.rating.toUpperCase()}</span></div>`;

        // build a div for the question
        let line = "<div class='carousel-item";
        if (i == 0) line += " active";
        line += "'><div class='q_content'></div>";
        line += `<h2 class="q_question">${question}</h2>`;
        line += `<p class="q_answer">${answer}</p>`;
        line += '<button type="button" class="q_reveal">Reveal Answer</button>';
        line += '</div></div>';

        // document.querySelector(".carousel-inner").appendChild(line);
        console.log("q added");
        console.log("line");

        // another way of doing the same thing above
        // look in directions for this (I don't wanna type it out)

        // add the <div> to 'bigString' and loop
        bigString += line;
    }

    // all done building the HTML = show it to the user
    document.querySelector(".carousel-inner").innerHTML = bigString;

    // update the status
    // document.querySelector("#status").innerHTML = "<b>Success!</b>" + "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
}

function dataError(e) {
    console.log("An error occurred");
}