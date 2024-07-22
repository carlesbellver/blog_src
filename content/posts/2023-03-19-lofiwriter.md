+++
title = "Generant històries amb ChatGPT"
date = "2023-03-19T10:19:24+01:00"
tags = []
slug = "lofiwriter"
fedurl = "https://mastodon.social/@carlesbellver/110051193243202635"
image = "/uploads/2023/2023-03-19-lofiwriter.jpg"
+++

<img src="/uploads/2023/2023-03-19-lofiwriter.jpg" alt="Pintura a l’oli d’un robot escrivint en un quadern. Generada per DALL·E.">

A última hora i per primera vegada en trenta-dos anys, l’UJI va decidir tancar el campus per [Magdalena](https://ca.m.wikipedia.org/wiki/Festes_de_la_Magdalena) i donar-nos vacances. Una part d’aquestes hores inesperades de lleure les he dedicat a continuar jugant amb l’API de ChatGPT i programar un petit bot ([@lofiwriter](https://mastodon.social/@lofiwriter)) que genera textos amb pretensions literàries.

El *prompt* que envia el bot a l’API és d’aquest estil:

> *Draft a short story imitating the style of Jeanette Winterson. Mention or imply a mistake and a windstorm. Be imaginative and ironic. Avoid sentimentality and grandiloquence. Length: between two and five sentences. Language: English.*

L’autora o autor que cal imitar els trac d’una llista que vaig demanar al mateix ChatGPT (*“Give me a list of one hundred acclaimed modernist or postmodern writers, including international ones”*), de manera que m’assegure que els coneix. Les paraules clau venen de diverses llistes del mateix tipus: llocs, objectes, etc.

A més a més d’un relat (*“short story”*) el bot pot sol·licitar altres formes (l’extensió i el nombre de paraules clau depenen de la forma triada):

- Una idea per a una novel·la.
- Una idea per a una pel·lícula.
- Un diàleg entre dos personatges.
- Les frases inicials d’una novel·la.
- Les frases finals d’una novel·la.
- Un koan.
- Un haiku (i altres tipus de poemes breus).
- Un aforisme.
- Una meditació.

Després d’obtenir una resposta, el bot demana a ChatGPT que la traduïsca al català i publica ambdues versions en [Mastodon](https://mastodon.social/@lofiwriter).

Fins ara, havent assajat diferents variacions, diria que els resultats obtinguts són més prompte mediocres (en català, ni tan sols aconsegueix un nivell acceptable de correcció lingüística). Com a inspiració, em va funcionar millor l’aleatorietat pura dels [exemples del DIEC](https://42.carlesbellver.net).
