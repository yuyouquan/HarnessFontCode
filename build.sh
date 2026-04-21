#!/bin/bash
yarn config delete proxy
yarn config delete https-proxy
yarn install
yarn run build:prod
