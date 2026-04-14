{{- if .Title -}}# {{ .Title }}{{- end }}

{{ if .Date -}}{{ .Date.Format "2006-01-02" }}{{- end }}

{{ .RawContent }}