+++date = "2021-11-04T18:30:00+01:00"
tags = []
slug = "n-est-pas-un-livre"
photos = ["/uploads/2021/2021-11-04-unicorns.png"]
categories = ["fotos"]
+++

Un llibre pot prendre mil formes i es pot distribuir de moltes maneres. Per exemple, dins d’aquesta imatge.

<img alt="Una imatge en format PNG que conté un fitxer de text" src="/uploads/2021/2021-11-04-unicorns.png">

    $ unzip 2021-11-04-unicorns.png
    Archive:  2021-11-04-unicorns.png
    inflating: unicorns.txt

Com pot ser una imatge al mateix temps un arxiu ZIP? El truc és que el codi que indica que un fitxer és un PNG o JPEG es troba al començament, mentre que el codi que indica que és un ZIP es troba al final. Així que podem incrustar el ZIP a continuació del PNG o JPEG i obtenir una mena de fitxer de doble cara o 2×1.

Més detalls tècnics ací 👉 [tweetable-polyglot-png](https://github.com/DavidBuchanan314/tweetable-polyglot-png)
