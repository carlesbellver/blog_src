var SUMMARY_LENGTGH = 80;

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [month, day].join('-');
}

function renderPost(post) {
  console.log('SHIT');
  ElHTML = '<div class="h-entry">';
  var d = Date.parse(post.date_published)
  var date_iso = new Date(d).toISOString();
  var date_s = date_iso.substr(0, 10);
  ElHTML += '<div class="post-list-item-date"><a href="'+post.url+'" class="dt-published"><span="dt-published" datetime="'+date_iso+'">'+date_s+'</span></a></div>';
  ElHTML += '<div class="post-list-item-title">';
  if (post.tags.includes("retalls")) {
    ElHTML += "<img src=\"/svg.icons/link.svg\" class=\"inline\"> ";
  }
  else if (post.tags.includes("fotos")) {
    ElHTML += "<img src=\"/svg.icons/eye.svg\" class=\"inline\"> ";
  }
  if (post.title != undefined && post.title != '') {
    ElHTML += '<a href="'+post.url+'" class="u-url"><span class="p-name">'+post.title+'</a>';
  }
  else {
    var s = post.content_text;
    if (s.length > SUMMARY_LENGTGH) {
      s = s.substr(0, SUMMARY_LENGTGH) + "…";
    }
    /* if (post.tags.includes("fotos")) {
      s += " &#x1F5BC;";
    } */
    ElHTML += ' <span class="p-summary">'+s+'</span> <a href="'+post.url+'">[+]</a>';
  }
  ElHTML += '</div>'
  ElHTML += '</div>'
  return ElHTML;
}

function renderNoContent() {
  return 'Sense articles per a aquesta data. Torneu a provar-ho demà.'
}

var preferredDate = 0;
if (location.search.match(/prefdate=([^&]*)/i)) {
  preferredDate = location.search.match(/prefdate=([^&]*)/i)[1];
}

if (preferredDate) {
  if (preferredDate == 'tomorrow') {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    preferredDate = formatDate(tomorrow)
  }
  else if (preferredDate == 'aftertomorrow') {
    var aftertomorrow = new Date();
    aftertomorrow.setDate(aftertomorrow.getDate() + 2);
    preferredDate = formatDate(aftertomorrow)
  }
  else if (preferredDate == 'yesterday') {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    preferredDate = formatDate(yesterday)
  }
}
else {
  var today = new Date();
  preferredDate = formatDate(today)
}

var container = document.getElementById('onthisday');

var endPoint = '/archive/index.json';
var xhr = new XMLHttpRequest();
xhr.responseType = "json";
xhr.open('GET', endPoint, true);
xhr.send();

xhr.onreadystatechange = function(e) {
  if (xhr.readyState == 4 && xhr.status == 200) {
    container.innerHTML = ''
    postList = ''
    if (xhr.response.length == 0) {
      postList = renderNoContent();
    } else {
      xhr.response.forEach(function(post) {
        if (post.url.match(/\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\//) && post.date_published.search("-"+preferredDate) != -1) {
          postList = postList + renderPost(post);
        }
      });
    }
  if (postList.length == 0) {
    postList = renderNoContent();
  }
  container.innerHTML = postList;
  }
}
