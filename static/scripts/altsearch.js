const FUZZY = 0.1;
const MAX = 2000;
const BATCHSIZE = 20;
const DELAY = 10;
const MIN_WL = 3;
const SUMMARY_LENGTH = 80;
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
    if (results.length == 1) {
      window.location.href = results[0]["url"];
    }
    else if (results.length) {
      results.sort( function(a, b) { return b["score"] - a["score"] } );
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
}

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
    $item_type_icon.src = "/svg.icons/image.svg";
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
    if (q && s) {
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
