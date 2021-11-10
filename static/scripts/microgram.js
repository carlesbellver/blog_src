var max = 120;

var container = document.getElementById('microgram');

function renderImage(image) {

    var linkEl = document.createElement('a');
    linkEl.href = image['url'];
    linkEl.className = 'photo-link';
    container.appendChild(linkEl);

    var imageEl = document.createElement('div');
    imageEl.className = 'photo';
    var url = image['image'];
    imageEl.style.backgroundImage = 'url(' + url + ')';
    
    /* var textEl = document.createElement('div');
    textEl.innerHTML = image['content_text'];
    textEl.className = 'photo-text';
    imageEl.appendChild(textEl); */
    
    linkEl.appendChild(imageEl);
}

function renderNoContent() {
    var noPostsEl = document.createElement('p');
    noPostsEl.innerText = 'No recent photos.';
    container.appendChild(noPostsEl);
}

var hostname = window.location.hostname;
var domains = hostname.split('.');
if (domains.length > 2) {
  domains.shift();
  hostname = domains.join('.');
} 

var host = window.location.host;
var protocol = window.location.protocol;
/* var jsonUrl = protocol + '//'+ host + '/photos/index.json'; */
jsonUrl = '/photos/index.json';

var xhr = new XMLHttpRequest();
xhr.responseType = "json";
xhr.open('GET', jsonUrl, true);
xhr.send();

xhr.onreadystatechange = function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
        container.innerHTML = '';
        if (xhr.response.length == 0) {
            renderNoContent();
        } else {
            var count = 0;
            xhr.response['items'].forEach(function(image) {
                if (count < max) {
                    if (image['image'].indexOf(hostname) != -1) {
                      renderImage(image);
                      count++;
                    }
                }
            });
        }
    }
}

microgram.innerHTML = '';
microgram.appendChild(container);