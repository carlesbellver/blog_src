var nocontent = 'Sense articles per a aquesta data. Podeu tornar a provar demà.';
var SUMMARY_LENGTH = 80;

function buildResultEl(r) {
  var $h_entry = document.createElement("div");
  $h_entry.classList.add("h-entry");
  var $item_date = document.createElement("div");
  $item_date.classList.add("post-list-item-date");
  if (r["date_published"].substring(0, 3) != "000" && r["date_published"].substring(0, 3) != "197") {
    var $item_date_link = document.createElement("a");
    $item_date_link.classList.add("dt-published");
    var d = Date.parse(r["date_published"]);
    var date_s = new Date(d).toISOString().substr(0, 10);
    /* var $date = document.createTextNode(date_s); */
    var $date = document.createElement("span");
    $date.classList.add("dt-published");
    $date.innerHTML = date_s;
    $item_date_link.appendChild($date);
    $item_date_link.href = r["url"];
    $item_date.appendChild($item_date_link);
  }
  $h_entry.appendChild($item_date);
  var $item_type = document.createElement("div");
  $item_type.classList.add("post-list-item-type");
  var $item_type_link = document.createElement("a");
  $item_type_link.href = r["url"];
  var $item_type_icon = document.createElement("img");
  $item_type_icon.classList.add("inline");
  if (r["tags"].includes("retalls")) {
    $item_type_icon.src = "/svg.icons/link.svg";
  }
  else if (r["tags"].includes("ressenyes")) {
    $item_type_icon.src = "/svg.icons/book.svg";
  }
  else if (r["tags"].includes("citacions")) {
    $item_type_icon.src = "/svg.icons/smartquote.svg";
  }
  else if (r["tags"].includes("fotos")) {
    $item_type_icon.src = "/svg.icons/eye.svg";
  }
  else {
    $item_type_icon.src = "/svg.icons/hash.svg";
  }
  $item_type_link.appendChild($item_type_icon);
  $item_type.appendChild($item_type_link);
  $h_entry.appendChild($item_type);
  $item_title = document.createElement("div");
  $item_title.classList.add("post-list-item-title");
  var s = r["content_text"];
  if (s.length > SUMMARY_LENGTH) {
    s = s.substr(0, SUMMARY_LENGTH) + "…";
  }
  if (r["title"] && r["title"].length > 0) {
    $item_title_link = document.createElement("a");
    $item_title_link.classList.add("u-url");
    $item_title_link.href = r["url"];
    $item_title_link.innerHTML = r["title"];
    $item_title.appendChild($item_title_link);
    if (s) {
      $item_title.appendChild(document.createTextNode(" "));
      $item_title_summary = document.createElement("span");
      $item_title_summary.classList.add("p-summary");
      $item_title_summary.innerHTML = s;
      $item_title.appendChild($item_title_summary);
			$item_title.appendChild(document.createTextNode(" "));
			$item_more = document.createElement("a");
			$item_more.classList.add("more");
			$item_more.href = r["url"];
			$item_more.innerHTML = '[+]';
			$item_title.appendChild($item_more);
    }
  }
  else { /* untitled */
    $item_title_summary = document.createElement("span");
		$item_title_summary.classList.add("p-summary");
		$item_title_summary.innerHTML = s;
		$item_title.appendChild($item_title_summary);
		$item_title.appendChild(document.createTextNode(" "));
		$item_more = document.createElement("a");
		$item_more.classList.add("more");
		$item_more.href = r["url"];
		$item_more.innerHTML = '[+]';
		$item_title.appendChild($item_more);
  }
  if ($item_title != null) {
    $h_entry.appendChild($item_title); 
  }
  return $h_entry;
}

var preferredDate = 0;
if (location.search.match(/prefdate=([^&]*)/i)) {
  preferredDate = location.search.match(/prefdate=([^&]*)/i)[1];
}

if (preferredDate) {
  if (preferredDate == 'tomorrow') {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    preferredDate = new Date(tomorrow).toISOString().substr(5, 5);
  }
  else if (preferredDate == 'aftertomorrow') {
    var aftertomorrow = new Date();
    aftertomorrow.setDate(aftertomorrow.getDate() + 2);
    preferredDate = preferredDate = new Date(aftertomorrow).toISOString().substr(5, 5);
  }
  else if (preferredDate == 'yesterday') {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    preferredDate = preferredDate = new Date(yesterday).toISOString().substr(5, 5);
  }
}
else {
  preferredDate = new Date().toISOString().substr(5, 5);
}

var $onthisday = document.getElementById('onthisday');

var endPoint = '/archive/index.json';
var xhr = new XMLHttpRequest();
xhr.responseType = "json";
xhr.open('GET', endPoint, true);
xhr.send();

xhr.onreadystatechange = function(e) {
  if (xhr.readyState == 4 && xhr.status == 200) {
    $onthisday.innerHTML = ''
    if (xhr.response.length == 0) {
      $onthisday.innerHTML = nocontent;
    } else {
      xhr.response.forEach(function(post) {
        if (post.url.match(/\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\//) && post.date_published.search("-"+preferredDate) != -1) {
          // postList = postList + renderPost(post);
          $onthisday.appendChild(buildResultEl(post))
        }
      });
    }
		if ($onthisday.childElementCount == 0) {
			$onthisday.innerHTML = nocontent;
		}
  }
}
