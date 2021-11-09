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
  ElHTML = ''
  var d = Date.parse(post.date_published)
  var date_s = new Date(d).toISOString().substr(0, 10);
  ElHTML += '<p><a href="'+post.url+'">'+date_s+'</a>'
  /* if (post.photos[0]) { */
  if (post.tags.includes("fotos")) {
    ElHTML += " &#x1F5BC;"
  }
  if (post.title != '') {
    ElHTML += ' <a href="'+post.url+'">'+post.title+'</a>'
  }
  var s = post.content_text;
  if (s.length > 200) {
    s = s.substr(0, 200) + "…"
  }
  ElHTML += ' <span>'+s+'</span></p>'
  return ElHTML
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
    yesterday.setDate(yesterday.getDate() + 2);
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
      postList = renderNoContent()
    } else {
      xhr.response.items.forEach(function(post) {
        if (post.date_published.search("-"+preferredDate) != -1) {
          postList = postList + renderPost(post)
        }
      });
    }
  container.innerHTML = postList;
  }
}
