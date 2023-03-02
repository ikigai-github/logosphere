#!/bin/sh

<% applications.forEach(function(application){ %>
docker build -t logosphere/<%= application.name %>:latest ./<%= application.path %>
<% }); %>

helm uninstall logosphere
helm dependency build .
helm install --create-namespace -n logosphere logosphere .