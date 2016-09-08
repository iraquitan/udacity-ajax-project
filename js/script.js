
function loadData() {
    var body = document.querySelector('body');
    var wikiElem = document.querySelector("#wikipedia-links");
    var nytHeaderElem = document.querySelector('#nytimes-header');
    var nytElem = document.querySelector('#nytimes-articles');
    var greeting = document.querySelector('#greeting');
    var imageDiv = document.querySelector('#image-container');

    // clear out old data before new request
    wikiElem.innerText = "";
    nytElem.innerText = "";

    var streetStr = document.querySelector('#street').value;
    var cityStr = document.querySelector('#city').value;

    if (streetStr !== "" && cityStr !== "") {
        var address = streetStr + ", " + cityStr;
        greeting.innerText = "So, you want to live at " + address + "?";
        var streetviewUrl = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + address + "";
        var imageElem = '<img class="bgimg" src="' + streetviewUrl + '">';
        // Remove image if exist
        var bgImgs = document.querySelectorAll('.bgimg');
        if (bgImgs.length > 0) {
            bgImgs.forEach(function (bgImg) {
                bgImg.remove();
            });
        }
        imageDiv.innerHTML += imageElem;

        // NYTimes AJAX request
        var nytUrl = "https://api.nytimes.com/svc/search/v2/" +
            "articlesearch.json" + "?api-key=YOUR_API_KEY" +
            "&q=" + cityStr + "&sort=newest";
        myAjax(nytUrl, function (response) {
            response.response.docs.forEach(function (nytDoc) {
                var article = document.createElement("li");
                article.classList.add("article");
                var anchor = '<a href=' + nytDoc.web_url + '>' + nytDoc.headline.main + '</a>';
                var paragraph = '<p>' + nytDoc.snippet + '</p>';
                article.innerHTML += anchor + paragraph;
                nytElem.appendChild(article);
            })
        });

    }
    return false;
}

document.querySelector("#form-container").addEventListener("submit", function(event) {
    event.preventDefault();
    loadData();
});

function myAjax(url, handle) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                var response = JSON.parse(httpRequest.responseText);
                handle(response);
            } else {
                console.warn('There was a problem with the request.');
            }
        }
    };
    httpRequest.open("GET", url);
    httpRequest.send();
}