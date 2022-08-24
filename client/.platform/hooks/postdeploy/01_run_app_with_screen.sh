#!/usr/bin/env bash
set -x
# Redirect "https://buddipro.com" to "https://www.buddipro.com"
echo "postdeploy: configuring nginx"
sed -i "/server {/i    server {\n        listen 80;\n        server_name buddipro.com;\n        return 301 \https://www.buddipro.com\$request_uri;\n    }" /etc/nginx/nginx.conf
sed -i "/client_header_timeout/i if (\$http_x_forwarded_proto = 'http') {\nreturn 301 https://\$host\$request_uri;\n}\nadd_header  X-Frame-Options SAMEORIGIN;\nadd_header X-Content-Type-Options nosniff;\nadd_header cache-control no-cache;" /etc/nginx/nginx.conf

systemctl reload nginx
# echo "Creating new screen session and run yarn start"
# screen -dmS run-webapp
# screen -S run-webapp -X stuff 'yarn start\n'
