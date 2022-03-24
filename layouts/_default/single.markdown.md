+++
title = "{{ if .Title }}{{ .Title }}{{ end }}"
date = "{{ if .Date }}{{ .Date }}{{ end }}"
tags = {{ if .Params.tags }}{{ .Params.tags }}{{ end }}
+++

{{ .RawContent }}