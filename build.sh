#!/bin/bash
yarn config delete proxy
yarn config delete https-proxy
yarn config set registry https://ci-nexus.transsion.com/repository/npmmirror/
yarn install
yarn run build:prod
