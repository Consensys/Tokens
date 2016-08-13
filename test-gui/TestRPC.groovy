#!/usr/bin/env groovy
import groovy.grape.Grape



@Grab(group="org.codehaus.groovy.modules.http-builder", module="http-builder", version="0.7.1")
import groovyx.net.http.*
import static groovyx.net.http.Method.*
import static groovyx.net.http.ContentType.*
/*
There’s also special non-standard methods that aren’t included within the original RPC specification:

evm_reset : No params, no return value.
evm_snapshot : No params. Returns the integer id of the snapshot created.
evm_revert : One optional param. Reverts to the snapshot id passed, or the latest snapshot.
When calling evm_reset, the testrpc will revert the state of its internal chain back to the genesis block and it will act as if no processing of transactions has taken place. Similarly, you can use evm_snapshot and evm_revert methods to save and restore the evm state as desired. Example use cases for these methods are as follows:

evm_reset : Run once at the beginning of your test suite.
evm_snapshot : Run at the beginning of each test, snapshotting the state of the evm.
evm_revert : Run at the end of each test, reverting back to a known clean state.

curl -X POST --data '{"jsonrpc":"2.0","method":"evm_snapshot","params":[],"id":1}' localhost:8545
{"id":1,"jsonrpc":"2.0","result":"0x2b"}

*/

abstract class TestRPC extends Script {
   def testrpc = new RESTClient('http://localhost:8545')
   def call_testRPC = { evm_method ->
        try {
            def resp = testrpc.post(
                    body: [
                            "jsonrpc": "2.0",
                            "method" : evm_method,
                            "params" : [],
                            "id"     : 1
                    ],
                    requestContentType: JSON)
            return resp.data.result
        }
        catch (ex) {
            println ex.getMessage();
            ex.printStackTrace();
        }
    }

    def testRPC_snap = call_testRPC.curry("evm_snapshot")
    def testRPC_revert = call_testRPC.curry("evm_revert")
}