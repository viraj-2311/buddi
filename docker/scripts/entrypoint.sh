#!/bin/bash
set -ex
mkdir -p /var/log/benji/
_print_status() {
    # Show   red x if last command failed
    # Show green o if last command succeeded
    case $? in
        0) printf '[\342\234\224]\n\n' ;;
        *) printf '[\342\234\227]\n\n' ;;
    esac
    history -a
    true
}

function wait_for_db {
  while ! nc -z ${BENJI_DATABASE_HOST} ${BENJI_DATABASE_PORT};
  do
    echo  "Waiting for ${BENJI_DATABASE_HOST}:${BENJI_DATABASE_PORT} to come up" || _print_status
    sleep 10
  done
}

function createdb {
  wait_for_db
  env
	if psql -h $BENJI_DATABASE_HOST -U postgres -lqt | cut -d \| -f 1 | grep -qw ${BENJI_DATABASE_NAME}; then
		echo "Database exists. Not creating"
	else
		psql -h $BENJI_DATABASE_HOST -U postgres -c "CREATE DATABASE ${BENJI_DATABASE_NAME}"
		psql -h $BENJI_DATABASE_HOST -U postgres -tc "SELECT 1 FROM pg_user WHERE usename = '${BENJI_DATABASE_USER}'" | grep -q 1 || psql -h "${BENJI_DATABASE_HOST}" -U postgres -c "CREATE ROLE ${BENJI_DATABASE_USER} LOGIN PASSWORD '${BENJI_DATABASE_PASSWORD}'; ALTER USER ${BENJI_DATABASE_USER} CREATEDB;"
	fi
}

function static {
  python manage.py collectstatic --noinput
}

function migrate {
	python manage.py migrate
}

function startdjango {
  if [ -z ${BENJI_ENVIRONMENT+hi} ]; then
    echo "var is unset";
  else
    if [ ${BENJI_ENVIRONMENT} == "local_noserver" ]; then
      while :; do echo 'Not starting since local....\nHit CTRL+C'; sleep 90000; done
    fi
  fi
  echo ">> Static..."
  static
  echo ">> Migrating..."
  migrate
  num_of_cpu=$(nproc --all)
  ((num_of_thread = $num_of_cpu * 2))
  gunicorn --bind :8000 --worker-class=gevent --worker-connections=1000 --workers=5  benji_app.wsgi:application

}

function prepare_server_env {
  if test -f /server/.env.template; then
    /usr/local/bin/envsubst < /server/.env.template  > /server/.env
    export $(grep -v '^#' /server/.env | xargs)
  fi
}

function start_django_server {
    echo ">> Preparing environmental variables..."
    prepare_server_env
    echo ">> Checking database..."
    createdb
    _print_status
    echo ">> Starting celery..."
    celery worker -A benji_app -B --loglevel=info --concurrency=1 &
    _print_status
    echo ">> Starting django..."
    startdjango
}

function start_yarn {
  echo ">> Starting yarn..."
  yarn start
}


eval $@
