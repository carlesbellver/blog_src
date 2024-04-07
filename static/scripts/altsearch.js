const FUZZY = 0.2;
const MAX = 2000;
const BATCHSIZE = 20;
const DELAY = 10;
const MIN_WL = 3;
const SUMMARY_LENGTGH = 80;

$inputSearch = document.getElementById('input_search');
$searchPattern = document.getElementById("search_pattern");
$noHits = document.getElementById("no_hits");
$searchNotice = document.getElementById("srch_notice");
$listResults = document.getElementById("list_results");

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
      $searchPattern.innerHTML = "La vista cansada";
			displayResults(archive);
		}
	}
};
xmlhttp.open("GET", "/archive/index.json", true);
xmlhttp.send();

function resetSearch() {
  $searchPattern.innerHTML = "La vista cansada";
  q = "";
  document.location.href='/archive/?q=';
  displayResults(archive);
}

function runSearch(q) {
  if (typeof(q) == "string" && q.length) {
    qq = q.trim(); // .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    $searchPattern.innerHTML = qq;
    $listResults.innerHTML = "";
    var results = [];
    if (qq.length >= MIN_WL && qq.length < 100) {
      results = miniSearch.search(qq);
    }
    if (results.length) {
      // results.sort( function(a, b) { return b["score"] - a["score"] } );
      displayResults(results);
    }
    else {
      $noHits.innerHTML = ". Cap resultat.";
      $listResults.innerHTML = "<p>No s’ha trobat cap pàgina coincident. Intenteu precisar més la cerca.</p>";
    }
  }
}

function displayResults(results) {
  // var refTime = (new Date()).getTime();
  $listResults.innerHTML = "";
  max = results.length;
  if (results.length == 1) {
    $noHits.innerHTML = ". Una&nbsp;pàgina";
  }
  else {
    $noHits.innerHTML = ". " + results.length + "&nbsp;pàgines";
    if (max > MAX) {
      max = MAX;
      $listResults.innerHTML = "<p>Només se’n mostren les " + max + " primeres.</p>";
    }
  }
  
  function addResultsInBatches(container, results, batchSize, delay) {
    let idx = 0;
    function addBatch() {
      const batch = results.slice(idx, idx + batchSize);
      batch.forEach(result => {
        h_entry_node = buildResultEl(result);
        container.appendChild(h_entry_node);
      });
      idx += batchSize;
      // Check if there are more results to add
      if (idx < results.length) {
        setTimeout(addBatch, delay); // Schedule next batch
      }
    }
    // Start adding batches
    addBatch();
  }
  addResultsInBatches($listResults, results, BATCHSIZE, DELAY);
  
// for (let i = 0; i < max; i++) {
//   if (results[i]["date_published"].substring(0, 3) != "000" && results[i]["date_published"].substring(0, 3) != "197") {
//     h_entry_node = buildResultEl(results[i]);
//		$listResults.appendChild(h_entry_node);
//   }
// }
 
  // var lapsedTime = ((new Date()).getTime() - refTime)/1000;
	// console.log("Display results: " + lapsedTime + "seconds");
}

function buildResultEl(r) {
  var h_entry_node = document.createElement("div");
  h_entry_node.classList.add("h-entry");
  if (r["date_published"].substring(0, 3) != "000" && r["date_published"].substring(0, 3) != "197") {
    var item_date_node = document.createElement("div");
    item_date_node.classList.add("post-list-item-date");
    var item_date_link_node = document.createElement("a");
    item_date_link_node.classList.add("dt-published");
    var d = Date.parse(r["date_published"]);
    var date_s = new Date(d).toISOString().substr(0, 10);
    var date_node = document.createTextNode(date_s);
    item_date_link_node.appendChild(date_node);
    item_date_link_node.href = r["url"];
    item_date_node.appendChild(item_date_link_node);
    h_entry_node.appendChild(item_date_node);
  }
  item_title_node = document.createElement("div");
  item_title_node.classList.add("post-list-item-title");
  var s = r["content_text"];
  if (s.length > SUMMARY_LENGTGH) {
    s = s.substr(0, SUMMARY_LENGTGH) + "…";
  }
  item_title_node.innerHTML = '';
  /* Link? */
  if (r["tags"].includes("retalls")) {
    item_title_node.innerHTML = item_title_node.innerHTML + "<img src=\"/svg.icons/link.svg\" class=\"inline\"> ";
  }
  /* Picture? */
  else if (r["tags"].includes("fotos")) {
      item_title_node.innerHTML = item_title_node.innerHTML + "<img src=\"/svg.icons/eye.svg\" class=\"inline\">";
  }
  /* Title? */
  if (r["title"] && r["title"].length > 0) {
    item_title_node.innerHTML = item_title_node.innerHTML + ' <a class="u-url" href="'+r["url"]+'">' + r["title"] + '</a>';
    if (q && s) {
      item_title_node.innerHTML = item_title_node.innerHTML + ' <span class="p-summary">'+ s +'</span>';
    }
  }
  else { /* untitled */
    item_title_node.innerHTML = item_title_node.innerHTML + ' <span class="p-summary">'+s+'</span>';
    item_title_node.innerHTML = item_title_node.innerHTML + ' <a href="'+r["url"]+'">[+]</a>';
  }
  if (item_title_node != null) {
    h_entry_node.appendChild(item_title_node); 
  }
  return h_entry_node;
}