const url = 'src/data/lang/';
let languageData;
let language;

const lang_fr = "fr";
const lang_en = "en";

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

function init(lang) {
    if (lang != null) {
        localStorage.setItem("language", lang);
    } else if (localStorage.getItem("language") == null) {
        let language = navigator.language;
        if (language.toString().includes(lang_fr)) {
            localStorage.setItem("language", lang_fr);
        } else {
            localStorage.setItem("language", lang_en);
        }
    }
    language = localStorage.getItem("language");

    document.getElementById('htmlTag').lang = language;
    readTextFile(url + language + ".json", function(text) {
        languageData = JSON.parse(text);
        document.title = languageData["title"];
        loadPage();
    });
    return languageData;
}

function loadPage() {
    let collection = document.body.getElementsByTagName("*");
    for (const element of collection) {
        if (element.className == null)
            continue;
        for (const attribute of element.className.split(" ")) {
            if (!attribute.startsWith("lang="))
                continue;
            const key = attribute.replace("lang=", "");
            if (languageData != null && languageData[key] != null) {
                element.innerHTML = languageData[key];
            }
        }
    }
}

function changeLanguage(lang) {
    init(lang);
    setTimeout(function() {
        displayRepos();
    }, 50);
}

window.onload = function () {
    init(null);
}

function getTranslation(key) {
    if (languageData == null || languageData[key] == null) {
        return key;
    }
    return languageData[key];
}

function formatDate(date) {
    if (language === lang_fr) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    } else {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }
}
