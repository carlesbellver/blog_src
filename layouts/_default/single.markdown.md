+++
{{ if .Title -}}title = "{{ .Title }}"{{- end }}
{{ if .Date -}}date = "{{ .Date }}"{{- end }}
{{ if .Params.tags -}}tags = {{ .Params.tags }}{{- end }}
+++

{{ .RawContent }}