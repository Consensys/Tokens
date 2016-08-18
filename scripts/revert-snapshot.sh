#!/bin/sh
curl -X POST --data '{"jsonrpc":"2.0","method":"evm_revert","params":["0x02"],"id":1}' localhost:8545
