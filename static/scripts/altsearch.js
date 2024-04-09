const FUZZY = 0.1;
const MAX = 2000;
const BATCHSIZE = 20;
const DELAY = 10;
const MIN_WL = 3;
const SUMMARY_LENGTGH = 80;
const BLOG_TITLE = "La vista cansada";

const $inputSearch = document.getElementById('input_search');
const $searchPattern = document.getElementById("search_pattern");
const $noHits = document.getElementById("no_hits");
const $searchNotice = document.getElementById("srch_notice");
const $listResults = document.getElementById("list_results");

const urlParams = new URLSearchParams(window.location.search);
const q = urlParams.get('q');
if (q) {
  $inputSearch.value = q.trim();
}

var miniSearch;
var archive = [];
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		archive = JSON.parse(this.responseText);
		$searchNotice.innerHTML = "";
		miniSearch = new MiniSearch({
			// fields to index for full-text search
			fields: ['title', 'content_text'],
			// fields to return with search results
			storeFields: ['title', 'url', 'date_published', 'tags', 'content_text'],
			searchOptions: {
				boost: { title: 5 },
				fuzzy: FUZZY,
				processTerm: (term, _fieldName) => term.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
			}
		});
		miniSearch.addAll(archive);
		if (q) {
			runSearch(q);
		}
		else {
      $searchPattern.innerHTML = BLOG_TITLE;
			displayResults(archive);
		}
	}
};
xmlhttp.open("GET", "/archive/index.json", true);
xmlhttp.send();

function resetSearch() {
  $searchPattern.innerHTML = BLOG_TITLE;
  q = "";
  document.location.href='/archive/?q=';
  displayResults(archive);
}

function runSearch(q) {
  if (typeof(q) == "string" && q.length) {
    var q = q.trim(); // .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    var literal = false;
    let regExp = /^ *["“”](.+)["“”] *$/g;
    if (match = regExp.exec(q)){
      q = literal = match[1];
    }
    $searchPattern.innerHTML = q;
    $listResults.innerHTML = "";
    var results = [];
    if (q.length >= MIN_WL && q.length < 100) {
      let f = FUZZY;
      let c = 'OR'
      if (literal) {
        f = 0;
        c = 'AND'
      }
      results = miniSearch.search(q, { fuzzy: f , combineWith: c });
    }
    if (results.length) {
      // results.sort( function(a, b) { return b["score"] - a["score"] } );
      displayResults(results);
    }
    else {
      $searchPattern.innerHTML = "";
      $noHits.innerHTML = "Cap resultat";
      let $noHitsNotice = document.createElement("p");
      $noHitsNotice.innerHTML = "No s’ha trobat cap pàgina coincident. Intenteu precisar més la cerca.";
      $listResults.appendChild($noHitsNotice);
    }
  }
}

function displayResults(results) {
  // var refTime = (new Date()).getTime();
  $listResults.innerHTML = "";
  var max = results.length;
  if (results.length == 1) {
    $noHits.innerHTML = ". Una&nbsp;pàgina";
  }
  else {
    $noHits.innerHTML = ". " + results.length + "&nbsp;pàgines";
    //if (q && max > MAX) {
    if (max > MAX) {
      max = MAX;
      let $maxHitsNotice = document.createElement("p");
      $maxHitsNotice.innerHTML = "Només es mostren les " + max + " primeres pàgines.";
      $listResults.appendChild($maxHitsNotice);
    }
  }
  
  function addResultsInBatches(container, results, batchSize, delay) {
    let idx = 0;
    function addBatch() {
      const batch = results.slice(idx, idx + batchSize);
      batch.forEach(result => {
        let $h_entry = buildResultEl(result);
        container.appendChild($h_entry);
      });
      idx += batchSize;
      // Check if there are more results to add
      if (idx < max) {
        setTimeout(addBatch, delay); // Schedule next batch
      }
    }
    // Start adding batches
    addBatch();
  }
  addResultsInBatches($listResults, results, BATCHSIZE, DELAY);
  
// for (let i = 0; i < max; i++) {
//   if (results[i]["date_published"].substring(0, 3) != "000" && results[i]["date_published"].substring(0, 3) != "197") {
//     $h_entry = buildResultEl(results[i]);
//		$listResults.appendChild($h_entry);
//   }
// }
 
  // var lapsedTime = ((new Date()).getTime() - refTime)/1000;
	// console.log("Display results: " + lapsedTime + "seconds");
}

function buildResultEl(r) {
  var $h_entry = document.createElement("div");
  $h_entry.classList.add("h-entry");
  if (r["date_published"].substring(0, 3) != "000" && r["date_published"].substring(0, 3) != "197") {
    var $item_date = document.createElement("div");
    $item_date.classList.add("post-list-item-date");
    var $item_date_link = document.createElement("a");
    $item_date_link.classList.add("dt-published");
    var d = Date.parse(r["date_published"]);
    var date_s = new Date(d).toISOString().substr(0, 10);
    var $date = document.createTextNode(date_s);
    $item_date_link.appendChild($date);
    $item_date_link.href = r["url"];
    $item_date.appendChild($item_date_link);
    $h_entry.appendChild($item_date);
  }
  $item_title = document.createElement("div");
  $item_title.classList.add("post-list-item-title");
  var s = r["content_text"];
  if (s.length > SUMMARY_LENGTGH) {
    s = s.substr(0, SUMMARY_LENGTGH) + "…";
  }
  $item_title.innerHTML = '';
  /* Link? */
  if (r["tags"].includes("retalls")) {
    $item_title.innerHTML += "<img src=\"/svg.icons/link.svg\" class=\"inline\"> ";
  }
  /* Picture? */
  else if (r["tags"].includes("fotos")) {
      $item_title.innerHTML += "<img src=\"/svg.icons/eye.svg\" class=\"inline\">";
  }
  /* Title? */
  if (r["title"] && r["title"].length > 0) {
    $item_title.innerHTML += ' <a class="u-url" href="'+r["url"]+'">' + r["title"] + '</a>';
    if (q && s) {
      $item_title.innerHTML += ' <span class="p-summary">'+ s +'</span>';
    }
  }
  else { /* untitled */
    $item_title.innerHTML += ' <span class="p-summary">'+s+'</span>';
    $item_title.innerHTML += ' <a href="'+r["url"]+'">[+]</a>';
  }
  if ($item_title != null) {
    $h_entry.appendChild($item_title); 
  }
  return $h_entry;
}