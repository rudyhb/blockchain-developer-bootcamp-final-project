#!/bin/bash
if [ -e ./src/web3Info/develop-details.json ]
then
    echo "develop-details.json already exists"
else
    echo "creating an empty develop-details.json"
    echo "{}" > ./src/web3Info/develop-details.json
fi
