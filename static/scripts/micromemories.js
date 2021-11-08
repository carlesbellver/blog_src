var preferredDate = 0;
if (location.search.match(/prefdate=([^&]*)/i)) {
  preferredDate = location.search.match(/prefdate=([^&]*)/i)[1];
}

var container = document.getElementById('onthisday');
var postList = document.createElement('div');

function renderPost(post) {
  var postEl = document.createElement('article');
  postEl.class = 'post-list';
  ElHTML = '';
  if (post['properties']['name'] != '') {
    ElHTML += '<header class="post-header"><h1 class="post-title"><a href="'+post['properties']['url'][0]+'">'+post['properties']['name']+'</a></h1></header>';
  }
  ElHTML += post['properties']['content'][0]['html'];
  var published = post['properties']['published'][0];
  published = new Date(published.slice(0,19).replace(' ', 'T'));
  ElHTML += '<div class="post-info"><a href="'+post['properties']['url'][0]+'" class="u-url"><div class="post-date dt-published">'+published.toISOString().split('T')[0]+'</div></a></div>';

  postEl.innerHTML = ElHTML;
  container.appendChild(postEl);
  
/*    
  var postSep = document.createElement('span');
  postSep.className = 'separator';
  var postDiv = document.createElement('span');
  postDiv.className = 'divider';
  postSep.appendChild(postDiv);
  container.appendChild(postSep);
*/

}

function renderNoContent() {
  var noPostsEl = document.createElement('p');
  noPostsEl.innerText = 'Sense articles per a aquesta data. Torneu a provar-ho demà.';
  container.appendChild(noPostsEl);
}

var endPoint = 'https://blog.carlesbellver.net/scripts/micromemories.php';
if (preferredDate) {
  endPoint += '?prefdate='+preferredDate;
}
var xhr = new XMLHttpRequest();
xhr.responseType = "json";
xhr.open('GET', endPoint, true);
xhr.send();

xhr.onreadystatechange = function(e) {
  if (xhr.readyState == 4 && xhr.status == 200) {
    container.innerHTML = '';
    if (xhr.response.length == 0) {
      renderNoContent();
    } else {
      xhr.response.forEach(function(post) {
      renderPost(post);
      });
    }
    container.appendChild(postList);
  }
}
