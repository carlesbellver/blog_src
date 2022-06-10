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
  if (typeof(q) == "string" && q.length) {
    var qq = q.trim().toLowerCase();
    var results_node = document.getElementById("list_results");
    results_node.innerHTML = "";
    var count = 0;
    if (q.length > 3 && q.length < 100) {
      var results = [];
      var q = chrCleanup(q);
      var literal = 0;
      var regExp = /^"([^"]+)"$/g;
      if (match = regExp.exec(q)){
        q = literal = match[1];
      }
      if (!literal) {
        var terms = q.split(/[ '’"-]+/);
        terms_p = [];
        for (let i = 0; i < terms.length; i++) {
          if (terms[i].length > 3) {
            terms_p.push(terms[i]);
          }
        }
        if (terms_p.length > 5) {
          terms_p = terms_p.slice(0, 4);
        }
        q = terms_p.join(" ");
      }
      console.log(q);
      var pattern_node = document.getElementById("search_pattern");
      pattern_node.innerHTML = qq;
      for (var i = 0; i < archive_results.items.length; i++) {
        score = 0;
        var item = archive_results.items[i];
        var title_lower = chrCleanup(item.title).toLowerCase();
        var tags_lower = chrCleanup(item.tags).toLowerCase();
        var text_lower = chrCleanup(item.content_text).toLowerCase();
        if (literal || terms_p.length > 1) {
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
        if (!literal) {
          for (let i = 0; i < terms_p.length; i++) {
            if (terms_p[i].length > 3) {
              if (title_lower.includes(terms_p[i])) {
                score += 10;
              }
              if (tags_lower.includes(terms_p[i])) {
                score += 5;
              }
              if (text_lower.includes(terms_p[i])) {
                score += 1;
              }
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
      var pattern_node = document.getElementById("search_pattern");
      pattern_node.innerHTML = "La vista cansada";
      var no_hits_node = document.getElementById("no_hits");
      no_hits_node.innerHTML = "zero pàgines";
      results_node.innerHTML = "<p>No s'ha trobat res que hi concordi. Intenteu precisar més la cerca.</p>";
    }
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

function chrCleanup(s) {
  s = s.replace(/à/g, 'a');
  s = s.replace(/á/g, 'a');
  s = s.replace(/è/g, 'e');
  s = s.replace(/é/g, 'e');
  s = s.replace(/í/g, 'i');
  s = s.replace(/ï/g, 'i');
  s = s.replace(/ò/g, 'o');
  s = s.replace(/ó/g, 'o');
  s = s.replace(/ú/g, 'u');
  s = s.replace(/ü/g, 'u');
  s = s.replace(/ç/g, 'c');
  s = s.replace(/ñ/g, 'n');
  s = s.replace(/À/g, 'A');
  s = s.replace(/É/g, 'A');
  s = s.replace(/È/g, 'E');
  s = s.replace(/É/g, 'E');
  s = s.replace(/Í/g, 'I');
  s = s.replace(/Ï/g, 'I');
  s = s.replace(/Ò/g, 'O');
  s = s.replace(/Ó/g, 'O');
  s = s.replace(/Ú/g, 'U');
  s = s.replace(/Ü/g, 'U');
  s = s.replace(/Ç/g, 'C');
  s = s.replace(/Ñ/g, 'N');
  s = s.replace(/-/g, ' ');
  s = s.replace(/'/g, ' ');
  s = s.replace(/’/g, ' ');
  return s;
}
