#!/bin/sh
curl -X POST --data '{"jsonrpc":"2.0","method":"evm_snapshot","params":[],"id":1}' localhost:8545
