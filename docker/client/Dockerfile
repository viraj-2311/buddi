# pull official base image
FROM node:12.16.1-alpine
RUN apk add --no-cache bash
# set working directory
RUN mkdir -p /client
WORKDIR /client

COPY ./client  /client
RUN yarn install
COPY ./docker/scripts/entrypoint.sh /client/entrypoint.sh
ENTRYPOINT ["/bin/bash", "-xv", "/client/entrypoint.sh"]
CMD ["start_yarn"]
