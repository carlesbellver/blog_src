var archive_results = {};
downloadArchive();

function downloadArchive() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      archive_results = JSON.parse(this.responseText);
      var results_node = document.getElementById("list_results");
      /* results_node.innerHTML = "<p>Introduïu els termes de la cerca.</p>"; */
      var notice = document.getElementById("srch_notice");
      notice.innerHTML = "";
      displayResults(results_node, archive_results.items);
    }
  };
  xmlhttp.open("GET", "/archive/index.json", true);
  xmlhttp.send();
}

function resetSearch() {
  var pattern_node = document.getElementById("search_pattern");
  pattern_node.innerHTML = "La vista cansada";
  var results_node = document.getElementById("list_results");
  displayResults(results_node, archive_results.items);
}

function runSearch(q) {
  q = q.trim().toLowerCase();
  q = q.replace(/[ld]['’]/g, '');
  var results_node = document.getElementById("list_results");
  results_node.innerHTML = "";
  var count = 0;
  if (q.length > 3 && q.length < 20) {
    var results = [];
    var terms = q.split(/ +/);
    if (terms.length > 5) {
      terms = terms.slice(0, 4);
    }
    q = terms.join(" ");
    var pattern_node = document.getElementById("search_pattern");
    pattern_node.innerHTML = q;
    for (var i = 0; i < archive_results.items.length; i++) {
      score = 0;
      var item = archive_results.items[i];
      var title_lower = item.title.toLowerCase();
      var tags_lower = item.tags.toLowerCase();
      var text_lower = item.content_text.toLowerCase();
      if (terms.length > 1) {
        if (title_lower.includes(q)) {
          score += 10;
        }
        if (tags_lower.includes(q)) {
            score += 5;
          }
        if (text_lower.includes(q)) {
          score += 1;
        }        
      }
      for (let i = 0; i < terms.length; i++) {
        if (terms[i].length > 3) {
          if (title_lower.includes(terms[i])) {
            score += 10;
          }
          if (tags_lower.includes(terms[i])) {
            score += 5;
          }
          if (text_lower.includes(terms[i])) {
            score += 1;
          }
        }
      }
      if (score > 0) {
        /* const result = { "url": item.url, "title": item.title, "text": item.content_text, "date": item.date_published, "tags": item.tags, "score": score}; */
        item.score = score;
        results.push(item);
        count++;
      }
    }
  }
  if (count) {
    results.sort( function(a, b) { return b["score"] - a["score"] } );
    displayResults(results_node, results);
  }
  else {
    results_node.innerHTML = "<p>No s'ha trobat res que hi concordi. Intenteu precisar més la cerca.</p>";
  }
}

function displayResults(results_node, results) {
  var no_hits_node = document.getElementById("no_hits");
  if (results.length == 1) {
    no_hits_node.innerHTML = results.length + " pàgina";
  }
  else {
    no_hits_node.innerHTML = results.length + " pàgines";
  }
	for (let i = 0; i < results.length; i++) {
		var p_node = document.createElement("p");        
		var link_node = document.createElement("a");
		if (results[i]["date_published"].substring(0, 3) != "000" && results[i]["date_published"].substring(0, 3) != "197") {
			var d = Date.parse(results[i]["date_published"]);
			var date_s = new Date(d).toISOString().substr(0, 10);
			var date_node = document.createTextNode(date_s); 
			link_node.appendChild(date_node);
		}
		link_node.href = results[i]["url"];
		var title_node = null;
		if (results[i]["title"].length > 0) {
			title_node = document.createElement("span");
			title_node.innerHTML = ' <a href="'+results[i]["url"]+'">' + results[i]["title"] + "</a>"
			s = results[i]["title"] + " " + results[i]["content_text"];
		}
		var s = results[i]["content_text"];
		if (s.length > 200) {
			s = s.substr(0, 200) + "…";
		}
		var text_node = document.createElement("span");
		text_node.innerHTML = " " + s;
		p_node.appendChild(link_node);
		if (results[i]["tags"].includes("fotos")) {
			var pic_node = document.createElement("span");
			pic_node.innerHTML = " &#x1F5BC;"
			p_node.appendChild(pic_node);
		}
		if (title_node != null) {
			p_node.appendChild(title_node);
		}
		p_node.appendChild(text_node);
		results_node.appendChild(p_node);
	}

}
