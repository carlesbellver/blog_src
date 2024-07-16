+++
date = "2023-02-23T09:44:05+01:00"
tags = ["retalls"]
slug = "stephen-wolfram-chatgpt"
x_url = "https://writings.stephenwolfram.com/2023/02/what-is-chatgpt-doing-and-why-does-it-work/"
title = "What Is ChatGPT Doing… and Why Does It Work?"
x_source = "Stephen Wolfram"
+++

> El primer que cal explicar és que el que ChatGPT intenta fer és, fonamentalment, produir una “continuació raonable” del text, on per raonable entenem el que es podria esperar que algú escriga després de veure el que la gent ha escrit en milers de milions de pàgines web.
>
> El que fa, bàsicament, és preguntar-se una vegada i una altra: “tenint en compte el text que tinc fins ara, quina hauria de ser la paraula següent?” I cada vegada hi afegeix una paraula. (Més exactament, hi afegeix un *token*, que podria ser només una part d’una paraula, i per això de vegades pot “inventar” paraules noves.)
>
> A cada pas obté una llista de paraules amb diferents probabilitats. Però, quina hauria de triar per afegir-la al text que està escrivint? Es podria pensar que hauria de ser la paraula amb la probabilitat més alta. Però ací és on comença a introduir-se una mica de vudú. Perquè, per alguna raó —que potser algun dia podrem entendre de manera científica— si sempre escollim la paraula més ben valorada, normalment obtindrem un text massa “pla”, que no mostrarà cap creativitat… Però si de vegades escollim a l’atzar paraules amb menys probabilitat, obtenim un text més “interessant”.