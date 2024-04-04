var MIN_WL = 3;
var SUMMARY_LENGTGH = 80;

let stopWords = new Set(["a", "abans", "ací", "ah", "així", "això", "al", "aleshores", "algun", "alguna", "algunes", "alguns", "alhora", "allà", "allí", "allò", "als", "altra", "altre", "altres", "amb", "ambdues", "ambdós", "anar", "ans", "apa", "aquell", "aquella", "aquelles", "aquells", "aquest", "aquesta", "aquestes", "aquests", "aquí", "baix", "bastant", "bé", "cada", "cadascuna", "cadascunes", "cadascuns", "cadascú", "com", "contra", "dalt", "de", "del", "dels", "des", "després", "dins", "dintre", "doncs", "durant", "e", "eh", "eixa", "eixe", "eixes", "eixos", "el", "elles", "ells", "els", "em", "en", "encara", "ens", "entre", "era", "erem", "eren", "eres", "es", "esta", "estan", "estat", "estava", "estaven", "este", "estem", "esteu", "estes", "estic", "està", "estàvem", "estàveu", "estos", "et", "etc", "ets", "fa", "faig", "fan", "fas", "fem", "fer", "feu", "fi", "fins", "fora", "gairebé", "ha", "han", "has", "haver", "havia", "he", "hem", "heu", "hi", "ho", "i", "igual", "iguals", "inclòs", "ja", "jo", "la", "les", "li", "llarg", "llavors", "ma", "mal", "malgrat", "mateix", "mateixa", "mateixes", "mateixos", "me", "mentre", "meu", "meua", "meua", "meues", "meus", "meva", "meves", "molt", "molta", "moltes", "molts", "mon", "mons", "més", "ne", "ni", "no", "nogensmenys", "només", "nosaltres", "nostra", "nostre", "nostres", "o", "oh", "oi", "on", "pas", "pel", "pels", "per", "perque", "perquè", "però", "poc", "poca", "pocs", "podem", "poden", "poder", "podeu", "poques", "potser", "primer", "propi", "puc", "qual", "quals", "quan", "quant", "que", "quelcom", "qui", "quin", "quina", "quines", "quins", "què", "sa", "sabem", "saben", "saber", "sabeu", "sap", "saps", "semblant", "semblants", "sense", "ser", "ses", "seu", "seua", "seues", "seus", "seva", "seves", "si", "sobre", "sobretot", "soc", "solament", "sols", "som", "son", "sons", "sota", "sou", "sóc", "són", "ta", "tal", "també", "tampoc", "tan", "tant", "tanta", "tantes", "te", "tenim", "tenir", "teniu", "teu", "teua", "teues", "teus", "teva", "teves", "tinc", "ton", "tons", "tot", "tota", "totes", "tots", "un", "una", "unes", "uns", "us", "va", "vaig", "vam", "van", "vas", "vau", "vosaltres", "vostra", "vostre", "vostres", "érem", "éreu", "és", "essent", "últim", "ús"]);

const urlParams = new URLSearchParams(window.location.search);
const q = urlParams.get('q');
if (q) {
  document.getElementById('input_search').value = q.trim();
}

var miniSearch;
var archive = [];
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		archive = JSON.parse(this.responseText);
		var notice = document.getElementById("srch_notice");
		notice.innerHTML = "";
		miniSearch = new MiniSearch({
			// fields to index for full-text search
			fields: ['title', 'content_text'],
			// fields to return with search results
			storeFields: ['title', 'url', 'date_published', 'tags', 'content_text'],
			searchOptions: {
				boost: { title: 5 },
				fuzzy: 0.2,
				processTerm: (term, _fieldName) => stopWords.has(term) ? null : term.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
			}
		});
		miniSearch.addAll(archive);
		if (q) {
			runSearch(q);
		}
		else {
		  var pattern_node = document.getElementById("search_pattern");
      pattern_node.innerHTML = "La vista cansada";
			displayResults(archive);
		}
	}
};
xmlhttp.open("GET", "/archive/index.json", true);
xmlhttp.send();

function resetSearch() {
  var pattern_node = document.getElementById("search_pattern");
  pattern_node.innerHTML = "La vista cansada";
  q = "";
  document.location.href='/archive/?q=';
  displayResults(archive);
}

function runSearch(q) {
  if (typeof(q) == "string" && q.length) {
    qq = q.trim(); // .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    var pattern_node = document.getElementById("search_pattern");
    pattern_node.innerHTML = qq;
    var results_node = document.getElementById("list_results");
    results_node.innerHTML = "";
    var results = [];
    if (qq.length >= MIN_WL && qq.length < 100) {
      results = miniSearch.search(qq);
    }
    if (results.length) {
      // results.sort( function(a, b) { return b["score"] - a["score"] } );
      displayResults(results);
    }
    else {
      // pattern_node.innerHTML = "La vista cansada";
      var no_hits_node = document.getElementById("no_hits");
      no_hits_node.innerHTML = ". 0 pàgines";
      results_node.innerHTML = "<p>No s'ha trobat res que hi concordi. Intenteu precisar més la cerca.</p>";
    }
  }
}

function displayResults(results) {
  var results_node = document.getElementById("list_results");
  var no_hits_node = document.getElementById("no_hits");
  if (results.length == 1) {
    no_hits_node.innerHTML = ". Una &nbsp;pàgina";
  }
  else {
    no_hits_node.innerHTML = ". " + results.length + "&nbsp;pàgines";
  }
  results_node.innerHTML = "";
  for (let i = 0; i < results.length; i++) {
    if (results[i]["date_published"].substring(0, 3) != "000" && results[i]["date_published"].substring(0, 3) != "197") {
			var h_entry_node = document.createElement("div");        
			h_entry_node.classList.add("h-entry");
			var item_date_node = document.createElement("div");
			item_date_node.classList.add("post-list-item-date");
			var item_date_link_node = document.createElement("a");
			item_date_link_node.classList.add("dt-published");
			var d = Date.parse(results[i]["date_published"]);
			var date_s = new Date(d).toISOString().substr(0, 10);
			var date_node = document.createTextNode(date_s); 
			item_date_link_node.appendChild(date_node);
			item_date_link_node.href = results[i]["url"];
			item_date_node.appendChild(item_date_link_node);
			h_entry_node.appendChild(item_date_node);
			item_title_node = document.createElement("div");
			item_title_node.classList.add("post-list-item-title");
			var s = results[i]["content_text"];
			if (s.length > SUMMARY_LENGTGH) {
				s = s.substr(0, SUMMARY_LENGTGH) + "…";
			}
			item_title_node.innerHTML = '';
			/* Link? */
      if (results[i]["tags"].includes("retalls")) {
        item_title_node.innerHTML = item_title_node.innerHTML + "<img src=\"/svg.icons/link.svg\" class=\"inline\"> ";
      }
      /* Picture? */
			else if (results[i]["tags"].includes("fotos")) {
					item_title_node.innerHTML = item_title_node.innerHTML + "<img src=\"/svg.icons/eye.svg\" class=\"inline\">";
			}
			/* Title? */
			if (results[i]["title"] && results[i]["title"].length > 0) {
				item_title_node.innerHTML = item_title_node.innerHTML + ' <a class="u-url" href="'+results[i]["url"]+'">' + results[i]["title"] + '</a>';
				if (q && s) {
					item_title_node.innerHTML = item_title_node.innerHTML + ' <span class="p-summary">'+ s +'</span>';
				}
			}
			else { /* untitled */
				item_title_node.innerHTML = item_title_node.innerHTML + ' <span class="p-summary">'+s+'</span>';
        item_title_node.innerHTML = item_title_node.innerHTML + ' <a href="'+results[i]["url"]+'">[+]</a>';
			}
			if (item_title_node != null) {
				h_entry_node.appendChild(item_title_node); 
			}
			results_node.appendChild(h_entry_node);
		}
  }
}