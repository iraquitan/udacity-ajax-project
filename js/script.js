
function loadData() {
    var body = document.querySelector('body');
    var wikiHeaderElem = document.querySelector('#wikipedia-header');
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
                var anchor = '<a href="' + nytDoc.web_url + '" target=_blank rel="noopener noreferrer">' + nytDoc.headline.main + '</a>';
                var paragraph = '<p>' + nytDoc.snippet + '</p>';
                article.innerHTML += anchor + paragraph;
                nytElem.appendChild(article);
            })
        }, function () {
            nytHeaderElem.innerText = "New York Times Articles Could Not Be Loaded";
        }, "#nytimes-loader");

        // Wikipedia AJAX request
        var wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + cityStr + "&format=json&callback=wikiCallback";
        setTimeout(window.wikiCallback, 8000, "");
        window.wikiCallback = function(data) {
            if (data !== "") {
                for (var i = 0; i < data[1].length; i++) {
                    var article = document.createElement("li");
                    article.classList.add("article");
                    var anchor = '<a href="' + data[3][i] + '" target=_blank rel="noopener noreferrer">' + data[1][i] + '</a>';
                    article.innerHTML += anchor;
                    wikiElem.appendChild(article);
                }
                clearTimeout(window.wikiCallback);
            } else {
                wikiHeaderElem.innerText = "Wikipedia Links Could Not Be Loaded";
            }
        };
        var scriptEl = document.createElement('script');
        scriptEl.setAttribute('src', wikiUrl);
        document.body.appendChild(scriptEl);
    }
    return false;
}

document.querySelector("#form-container").addEventListener("submit", function(event) {
    event.preventDefault();
    loadData();
});

function myAjax(url, handle_success, handle_error, loader) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            document.querySelector(loader).style.display = "none";
            if (httpRequest.status === 200) {
                var response = JSON.parse(httpRequest.responseText);
                handle_success(response);
            } else {
                handle_error();
                // console.warn('There was a problem with the request.');
            }
        } else if (httpRequest.readyState === XMLHttpRequest.LOADING) {
            document.querySelector(loader).style.display = "block";
        }
    };
    httpRequest.open("GET", url);
    httpRequest.send();
}