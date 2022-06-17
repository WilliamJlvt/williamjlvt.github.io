const url = 'src/data/lang/';
let languageData;
let language;

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function init() {
    if (localStorage.getItem("language") == null) {
        let language = navigator.language;
        if (language.toString().includes("fr")) {
            localStorage.setItem("language", "fr");
        } else {
            localStorage.setItem("language", "en");
        }
    }
    language = localStorage.getItem("language");

    readTextFile(url + language + ".json", function(text) {
        languageData = JSON.parse(text);
        document.title = languageData["title"]
        loadPage();
    });
}

function loadPage() {
    let collection = document.body.getElementsByTagName("*");
    for (var element of collection) {
        if (element.className != null && languageData[element.className] != null) {
            element.innerHTML = languageData[element.className];
        }
    }
}

window.onload = function () {
    init();
}