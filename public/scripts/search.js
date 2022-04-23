var archive_results = {};

function downloadArchive() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      archive_results = JSON.parse(this.responseText);
      var results_node = document.getElementById("list_results");
      results_node.innerHTML = "<p>Introduïu els termes de la cerca.</p>";
    }
  };
  xmlhttp.open("GET", "/archive/index.json", true);
  xmlhttp.send();
}

function runSearch(q) {
  q = q.trim().toLowerCase();
  var results_node = document.getElementById("list_results");
  results_node.innerHTML = "";
  var count = 0;
  if (q.length > 3) {
    var results = [];
    var terms = q.split(/ +/);
    q = terms.join(" ");
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
        const result = { "url": item.url, "title": item.title, "text": item.content_text, "date": item.date_published, "tags": item.tags, "score": score};
        results.push(result);
        count++;
      }
    }
  }
  if (count) {
    results.sort( function(a, b) { return b["score"] - a["score"] } );
    for (let i = 0; i < results.length; i++) {
      var p_node = document.createElement("p");        
      var link_node = document.createElement("a");
      if (results[i]["date"] != "0001-01-01T00:00:00+00:00") {
        var d = Date.parse(results[i]["date"]);
        var date_s = new Date(d).toISOString().substr(0, 10);
        var date_node = document.createTextNode(date_s); 
        link_node.appendChild(date_node);
      }
      link_node.href = results[i]["url"];
      var title_node = null;
      if (results[i]["title"].length > 0) {
        title_node = document.createElement("span");
        title_node.innerHTML = ' <a href="'+results[i]["url"]+'">' + results[i]["title"] + "</a>"
        s = results[i]["title"] + " " + results[i]["text"];
      }
      var s = results[i]["text"];
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
  else {
    results_node.innerHTML = "<p>No s'ha trobat res que hi concordi. Intenteu precisar més la cerca.</p>";
  }
}

downloadArchive();
