+++
title = "Cercar"
slug = "search"
tags = ["special"]
+++

<link type="text/css" rel="stylesheet" href="/scripts/search.css" />

<script src="/scripts/search.js"></script>

<form class="search" onSubmit="return false;">
	<input class="field" type="text" name="q" id="input_search" placeholder="Paraules clau" onChange="runSearch(this.value.toLowerCase());" /><input class="submit" type="submit" value="cerca" />
</form>

<div id="list_results">
   <p>S'està carregant l'índex de paraules…</p>
</div>
