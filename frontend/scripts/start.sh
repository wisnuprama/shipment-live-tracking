#!/bin/sh
docker run -itv ${PWD}:/app -v /app/node_modules -p 3000:3000 --rm bigdata-frontend:dev