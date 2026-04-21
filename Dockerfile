FROM node:18-alpine as builder

WORKDIR /data
COPY . /data/

RUN yarn config delete proxy && yarn config delete https-proxy
RUN yarn install
RUN yarn run build:prod


FROM nginx
COPY --from=builder  /data/build/  /usr/share/nginx/html/
COPY --from=builder /data/nginx.conf /etc/nginx/nginx.conf
