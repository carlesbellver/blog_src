+++
title = "Cercar"
slug = "search"
tags = ["special"]
+++

<link type="text/css" rel="stylesheet" href="/scripts/search.css" />

<script src="/scripts/search.js" defer></script>

<form class="search" onSubmit="return false;">
	<input class="field" type="text" name="q" id="input_search" placeholder="Paraules clau" onChange="runSearch(this.value());" /><input class="submit" type="submit" value="cerca" />
</form>

<div id="list_results">
  <p id="srch_notice">S'està carregant l'índex…</p>
</div>
