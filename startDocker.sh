#!/bin/bash

set +e

docker stop regulator-ipfs
docker stop regulator-cluster

docker rm regulator-ipfs
docker rm regulator-cluster

docker rmi regulator-ipfs
docker rmi regulator-cluster

set -e

export CLUSTER_SECRET=$(od -vN 32 -An -tx1 .SECRET | tr -d ' \n')

docker-compose up --build --force-recreate -d regulator-ipfs regulator-cluster
