var archive_results = {};

function downloadArchive() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			archive_results = JSON.parse(this.responseText);
			var results_node = document.getElementById("list_results");
			results_node.innerHTML = "<p style=\"text-align: center;\">Introduïu els termes de la cerca.</p>";
		}
	};
	xmlhttp.open("GET", "/archive/index.json", true);
	xmlhttp.send();
}

function runSearch(q) {
	var results_node = document.getElementById("list_results");
	results_node.innerHTML = "";
	var count = 0;
	if (q.length > 0) {
		for (var i = 0; i < archive_results.items.length; i++) {
			var item = archive_results.items[i];
			var title_lower = item.title.toLowerCase();
			var tags_lower = item.tags.toLowerCase();
			var text_lower = item.content_text.toLowerCase();
			if (title_lower.includes(q) || tags_lower.includes(q) || text_lower.includes(q)) {
				count++;
				var p_node = document.createElement("p");        
				var link_node = document.createElement("a");
				var d = Date.parse(item.date_published);
				var date_s = new Date(d).toISOString().substr(0, 10);
				var date_node = document.createTextNode(date_s); 
				link_node.appendChild(date_node);
				link_node.href = item.url;
              	var title_node = null;
				if (item.title.length > 0) {
              		title_node = document.createElement("span");
                  	title_node.innerHTML = ' <a href="'+item.url+'">' + item.title + "</a>"
					s = item.title + " " + item.content_text;
				}
				var s = item.content_text;
				if (s.length > 200) {
					s = s.substr(0, 200) + "…";
				}
                if (item.photos[0]) {
                  s = "&#x1F5BC; " + s
                }
              	var text_node = document.createElement("span");
             	text_node.innerHTML = " " + s
				p_node.appendChild(link_node);
              	if (title_node != null) {
					p_node.appendChild(title_node);
                }
				p_node.appendChild(text_node);
				results_node.appendChild(p_node);
			}
		}
	} 
	if (! count) {
		results_node.innerHTML = "<p style=\"text-align: center;\">No s'ha trobat res que hi concordi.</p>";
	}
}

downloadArchive();
