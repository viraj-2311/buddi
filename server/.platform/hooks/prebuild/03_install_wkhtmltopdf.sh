#!/usr/bin/env bash
rpm -qa |grep wkhtmltox|| yum install -y https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox-0.12.6-1.amazonlinux2.x86_64.rpm
