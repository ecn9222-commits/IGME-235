// 1
window.onload = (e) => { document.querySelector("#search").onclick = searchButtonClicked };

// 2
let displayTerm = "";

// 3
function searchButtonClicked() {
    console.log("searchButtonClicked() called");

    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    // API Key
    // let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";
    let GIPHY_KEY = "pK5r3JtGjfexdVtP45hMRF8yqvBGC5UC";

    // build url string
    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    // parse the user entered term we want to search
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    // get rid any trailing or leading spaces
    term = term.trim();

    // encode spaces and special characters
    term = encodeURIComponent(term);

    // if there's no term to search then bail out of function
    if (term.length < 1) return;

    // append search term to the URL - param name is 'q'
    url += "&q=" + term;

    // grab the user chosen search 'limit' from <select> and append to URL
    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    // update the UI
    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

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
    if (!obj.data || obj.data.length == 0) {
        document.querySelector("#status").innerHTML = "<b> No results found for '" + displayTerm + "'</b>";
        return; // Bail out
    }

    // Start building an HTML string we will display to the user
    let results = obj.data;
    console.log("results.length = " + results.length);
    // let bigString = "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
    let bigString = "";

    // loop through the array of results
    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        // get the URL to the GIF
        let smallURL = result.images.fixed_width_downsampled.url;
        if (!smallURL) smallURL = "../images/no-image-found.png";

        // get the URL to the GIPHY page
        let url = result.url;

        // Build a <div> to hold each result
        // ES6 string templating
        let line = `<div class='result'><img src='${smallURL}' title='${result.id}' />`;
        line += `<span><a target='_blank' href='${url}'>View on Giphy></a><br>Rating: ${result.rating.toUpperCase()}</span></div>`;

        // another way of doing the same thing above
        // look in directions for this (I don't wanna type it out)

        // add the <div> to 'bigString' and loop
        bigString += line;
    }

    // all done building the HTML = show it to the user
    document.querySelector("#content").innerHTML = bigString;

    // update the status
    document.querySelector("#status").innerHTML = "<b>Success!</b>" + "<p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
}

function dataError(e) {
    console.log("An error occurred");
}