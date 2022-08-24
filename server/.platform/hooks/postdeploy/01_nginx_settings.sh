#!/usr/bin/env bash
set -x
sed -i "/client_header_timeout/i client_max_body_size 50M;" /etc/nginx/nginx.conf
systemctl reload nginx
