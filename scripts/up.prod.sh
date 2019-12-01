#!/bin/sh
git pull
docker-compose -f docker-compose.prod.yml up -d --build