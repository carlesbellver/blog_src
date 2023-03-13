+++
title = ""
date = "2023-03-13T10:12:41+01:00"
tags = ["retalls"]
slug = "censusgpt"
x_url = "https://censusgpt.com/"
x_title = "Census GPT"
x_source = ""
syndication = ["https://mastodon.social/@carlesbellver/110015246254853555"]
+++

Aquest web contesta preguntes sobre el cens dels EUA utilitzant ChatGPT. Com ho fa? La clau està en la funció `make_default_messages` del fitxer [`text_to_sql.py`](https://github.com/caesarHQ/textSQL/blob/main/api/app/api/utils/text_to_sql.py), que explica a ChatGPT l’estructura de la base de dades del cens. A partir d’això i d’uns pocs exemples, ChatGPT pot traduir les preguntes subsegüents de l’usuari a sentències SQL que el web executarà i processarà.