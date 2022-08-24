#!/usr/bin/env bash
mkdir -p /var/log/benji
chmod -R 777 /var/log/benji
chown -R webapp:webapp /var/log/benji
rpm -qa |grep rabbitmq || yum install -y \
  https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm \
  https://packages.erlang-solutions.com/erlang/rpm/centos/7/x86_64/esl-erlang_24.0.2-1~centos~7_amd64.rpm \
  https://github.com/rabbitmq/rabbitmq-server/releases/download/v3.8.19/rabbitmq-server-3.8.19-1.el7.noarch.rpm
systemctl enable rabbitmq-server
systemctl start rabbitmq-server
