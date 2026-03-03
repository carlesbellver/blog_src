var max = 100;

var $microgram = document.getElementById('microgram');

function renderImage(image) {
	var $link = document.createElement('a');
	$link.href = image['url'];
	$link.className = 'photo-link';
	$link.title = image['date_published'].substring(0, 10);
	/* $link.title = image['content_text']; */
	$microgram.appendChild($link);
	var $image = document.createElement('div');
	$image.className = 'photo';
	var url = image['image'];
	$image.style.backgroundImage = 'url(' + url + ')';
	$image.innerHTML = "<span>"+image['content_text']+"</span>";
	$link.appendChild($image);
}

function renderNoContent() {
	var $noPosts = document.createElement('p');
	$noPosts.innerText = 'Sense fotos recents.';
	$microgram.appendChild($noPosts);
}

var jsonUrl = '/photos/index.json';
var xhr = new XMLHttpRequest();
xhr.responseType = "json";
xhr.open('GET', jsonUrl, true);
xhr.send();

xhr.onreadystatechange = function(e) {
  if (xhr.readyState == 4 && xhr.status == 200) {
    $microgram.innerHTML = '';
    if (xhr.response.length == 0) {
      renderNoContent();
    }
    else {
      var count = 0;
      xhr.response['items'].forEach(function(image) {
        if (count < max) {
          renderImage(image);
          count++;
        }        
      });
    }
  }
}
