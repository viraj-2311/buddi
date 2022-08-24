FROM python:3.7.6-alpine
ENV PYTHONUNBUFFERED 1

RUN apk add wkhtmltopdf
RUN apk add --no-cache msttcorefonts-installer fontconfig
RUN update-ms-fonts

RUN apk --update --no-cache add python3-dev libffi-dev gcc musl-dev make libevent-dev build-base

RUN apk add --no-cache --virtual .build-deps \
    postgresql-libs \
    postgresql-client \
    postgresql-dev \
    netcat-openbsd \
    gcc \
    musl-dev \
    curl \
    jpeg-dev zlib-dev libjpeg \
    openssl \
    bash
RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.2.0/envsubst-`uname -s`-`uname -m` -o /usr/local/bin/envsubst && \
    chmod +x /usr/local/bin/envsubst
RUN mkdir -p /server
RUN mkdir -p /var/log/benji
WORKDIR /server
COPY server/requirements.txt /server/requirements.txt
RUN pip install --upgrade pip && \
    pip install -r /server/requirements.txt
COPY ./server/ /server
COPY ./docker/scripts/entrypoint.sh /server/entrypoint.sh
ENTRYPOINT ["/bin/bash", "/server/entrypoint.sh"]
CMD ["start_django_server"]
