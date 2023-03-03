{{- define "logosphere.labels" -}}
app.kubernetes.io/name: logosphere
helm.sh/chart: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- range $k, $v := .Values.global.commonLabels }}
{{ $k }}: "{{ $v }}"
{{ end }}
{{- end }}


{{- define "logosphere.annotations" -}}
{{- range $k, $v := .Values.global.commonAnnotations -}}
{{ $k }}: "{{ $v }}"
{{ end }}
{{- end }}