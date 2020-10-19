#!/bin/bash

set -e

docker exec regulator-ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
docker exec regulator-ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["GET", "POST"]'
docker exec regulator-ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Headers '["Authorization"]'
docker exec regulator-ipfs ipfs config --json API.HTTPHeaders.Access-Control-Expose-Headers '["Location"]'
docker exec regulator-ipfs ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
