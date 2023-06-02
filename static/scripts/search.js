var MIN_WL = 3;
var SUMMARY_LENGTGH = 80;

const urlParams = new URLSearchParams(window.location.search);
const q = urlParams.get('q');

var archive_items = {};
downloadArchive(q);

function downloadArchive(q) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      archive_items = JSON.parse(this.responseText);
      var notice = document.getElementById("srch_notice");
      notice.innerHTML = "";
      if (q) {
        runSearch(q);
      }
      else {
        displayResults(archive_items);
      }
    }
  };
  xmlhttp.open("GET", "/archive/index.json", true);
  xmlhttp.send();
}

function resetSearch() {
  var pattern_node = document.getElementById("search_pattern");
  pattern_node.innerHTML = "La vista cansada";
  q = "";
  document.location.href='/archive/?q=';
  displayResults(archive_items);
}

function runSearch(q) {
  if (typeof(q) == "string" && q.length) {
    var qq = q.trim().toLowerCase();
    var results_node = document.getElementById("list_results");
    results_node.innerHTML = "";
    var count = 0;
    if (qq.length >= MIN_WL && qq.length < 100) {
      var results = [];
      var q = chrCleanup(qq);
      // var q = qq.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
      var literal = 0;
      var regExp = /^ *["“”](.+)["“”] *$/g;
      if (match = regExp.exec(q)){
        q = literal = match[1];
      }
      if (!literal) {
        var terms = q.split(/[ '’"-]+/);
        terms_p = [];
        for (let i = 0; i < terms.length; i++) {
          if (terms[i].length >= MIN_WL) {
            terms_p.push(terms[i]);
          }
        }
        if (terms_p.length > 5) {
          terms_p = terms_p.slice(0, 4);
        }
        q = terms_p.join(" ");
        terms = terms_p;
      }
      console.log(q);
      var pattern_node = document.getElementById("search_pattern");
      pattern_node.innerHTML = qq;
      for (var i = 0; i < archive_items.length; i++) {
        var score = 0;
        var item = archive_items[i];
        if (item.title == undefined) {
          item.title = "";
        }
        var title_lower = chrCleanup(item.title).toLowerCase();
        var tags_lower = chrCleanup(item.tags).toLowerCase();
        var text_lower = chrCleanup(item.content_text).toLowerCase();
        if (literal || terms.length > 1) {
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
          for (let i = 0; i < terms.length; i++) {
            if (terms[i].length >= MIN_WL) {
              /* word boundary + term + 0-2 chars + word boundary */
              var exp = "\\b" + terms[i] + "[a-z]{0,2}\\b";
              var re = new RegExp(exp, "gi");
              if (title_lower.match(re)) {
                score += 10;
              }
              if (tags_lower.match(re)) {
                score += 5;
              }
              mm = text_lower.match(re);
              if (mm) {
                score += mm.length;
              }
            }
          }
        }
        if (score > 0) {
          item.score = score;
          results.push(item);
          count++;
        }
      }
    }
    if (count) {
      results.sort( function(a, b) { return b["score"] - a["score"] } );
      displayResults(results);
    }
    else {
      var pattern_node = document.getElementById("search_pattern");
      pattern_node.innerHTML = "La vista cansada";
      var no_hits_node = document.getElementById("no_hits");
      no_hits_node.innerHTML = "";
      results_node.innerHTML = "<p>No s'ha trobat res que hi concordi. Intenteu precisar més la cerca.</p>";
    }
  }
}

function displayResults(results) {
  var results_node = document.getElementById("list_results");
  var no_hits_node = document.getElementById("no_hits");
  if (results.length == 1) {
    no_hits_node.innerHTML = results.length + "&nbsp;pàgina";
  }
  else {
    no_hits_node.innerHTML = results.length + "&nbsp;pàgines";
  }
  results_node.innerHTML = "";
  for (let i = 0; i < results.length; i++) {
    var p_node = document.createElement("p");        
    var link_node = document.createElement("a");
    if (results[i]["date_published"].substring(0, 3) != "000" && results[i]["date_published"].substring(0, 3) != "197") {
      link_node.classList.add("dt-published");
      link_node.classList.add("u-url");
      var d = Date.parse(results[i]["date_published"]);
      var date_s = new Date(d).toISOString().substr(0, 10);
      var date_node = document.createTextNode(date_s); 
      link_node.appendChild(date_node);
    }
    link_node.href = results[i]["url"];
    var s = results[i]["content_text"];
    if (s.length > SUMMARY_LENGTGH) {
      s = s.substr(0, SUMMARY_LENGTGH) + "…";
    }
    var title_node = document.createElement("span");
    if (results[i]["title"] && results[i]["title"].length > 0) {
      title_node.innerHTML = ' <a class="u-url" href="'+results[i]["url"]+'">' + results[i]["title"] + '</a>';
      if (q && s) {
        title_node.innerHTML = title_node.innerHTML + ' <span class="p-summary">'+ s +'</span>';
      }
    }
    else {
      if (results[i]["tags"].includes("fotos")) {
        title_node.innerHTML = title_node.innerHTML + " &#x1F5BC;"
      }
      /* title_node.innerHTML = title_node.innerHTML + ' <span class="p-summary"><a href="'+results[i]["url"]+'">'+s+"</a></span>"; */
      title_node.innerHTML = title_node.innerHTML + ' <span class="p-summary">'+s+'</span> <a href="'+results[i]["url"]+'">[+]</a>';
    }
    p_node.appendChild(link_node);
    if (title_node != null) {
      p_node.appendChild(title_node);
    }
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
