#!/usr/bin/env groovy
import groovy.grape.Grape

@Grab(group="org.codehaus.groovy.modules.http-builder", module="http-builder", version="0.7.1")
import groovyx.net.http.HTTPBuilder
import static groovyx.net.http.Method.PUT
import static groovyx.net.http.ContentType.JSON

@Grab(group="org.seleniumhq.selenium", module="selenium-chrome-driver", version="2.53.1")
@Grab(group="org.gebish", module="geb-core", version="0.13.1")
import geb.*;

@GrabResolver(name='sonatype', root='http://oss.sonatype.org/content/repositories/snapshots/')
@Grab(group="org.spockframework", module="spock-core", version="1.0-groovy-2.4")
import spock.lang.*

@GrabResolver(name='sonatype', root='http://oss.sonatype.org/content/repositories/snapshots/')
@Grab(group="org.gebish", module="geb-spock", version="0.13.1")
import geb.spock.GebReportingSpec

@Grab(group='junit', module='junit', version='4.11')
import org.junit.runner.*;
import org.junit.*;

@Grab(group="org.codehaus.groovy.modules.http-builder", module="http-builder", version="0.7.1")
import groovyx.net.http.*
import static groovyx.net.http.Method.*
import static groovyx.net.http.ContentType.*

//import groovy.transform.BaseScript
//@BaseScript TestRPC testrpc_handler


class UpchainTokenPage extends Page {
    static at = { $('h2').text() == 'Upchain Token Dapp' }
    static content = {
        lbls_nameMe     { $(name:'me') }
        lbls_nameOther  { $(name:'other') }
        lbls_balance    { $(name:'balance') }

        int_balance_hd  { $("#balance_hd").text().toInteger() }
        int_balance_td  { $("#balance_td").text().toInteger() }
        inp_amountSend  { $("#amount_send") }
        btn_send        { $("#send") }

        lbl_reserved    { $("#reserved") }
        inp_amountAllow { $("#amount_allow") }
        btn_allow       { $("#allow") }

        lbl_credit      { $("#credit") }
        inp_amountClaim { $("#amount_claim") }
        btn_claim       { $("#claim") }

        int_currentFund { $("#currentfund").text().toInteger() }
    }
}

class AlicePage extends UpchainTokenPage {
    static url = "http://localhost:9090/index.html?alice"
}

class BobPage extends UpchainTokenPage {
    static url = "http://localhost:9090/index.html?bob"
}

class UpchainTokenSpecification extends GebReportingSpec  {

    // fields
    // fixture methods
    def setup() {}          // run before every feature method
    def cleanup() {}        // run after every feature method
    def setupSpec() {       // run before the first feature method
        testRPC_snap();
    }

    def cleanupSpec() {     // run after the last feature method
        testRPC_revert();
    }

    // feature methods
    @Unroll
    def "[#NN] opens to #myName account page"(NN, myPage, balance, myName, otherName) {
        when:
        to myPage

        then:
        at UpchainTokenPage
        lbls_nameMe*.text() as Set == [myName] as Set
        lbls_nameOther*.text() as Set == [otherName] as Set
        lbls_balance*.text()*.toInteger() as Set == [balance] as Set

        where:
        NN | myPage    | balance | myName  | otherName
         1 | AlicePage | 93623   | 'Alice' | 'Bob'
         2 | BobPage   | 6378    | 'Bob'   | 'Alice'
    }

    @Unroll
    def "[#NN] sends 100 token from #myName to #otherName"(NN, myPage, myName, otherName) {
        given:

        when:
        to myPage
        def oldBalance      = int_balance_hd
        def oldCurrentFund  = int_currentFund
        inp_amountSend = 100
        btn_send.click()

        then:
        at UpchainTokenPage
        int_balance_hd == oldBalance - 100
        int_balance_td == oldBalance - 100
        int_currentFund == oldCurrentFund - 100

        where:
        NN | myPage    | myName  | otherName
         1 | AlicePage | 'Alice' | 'Bob'
         2 | BobPage   | 'Bob'   | 'Alice'
    }

    // helper methods
    def static call_testRPC = { evm_method ->
        return new RESTClient('http://localhost:8545').post(
                body: ["jsonrpc": "2.0", "method" : evm_method,"params" : [],"id":1]
                ,requestContentType: JSON
        ).data.result
    }
    def static testRPC_snap = call_testRPC.curry("evm_snapshot")
    def static testRPC_revert = call_testRPC.curry("evm_revert")
}

println "starting tests...";
def JUnitCore junit = new JUnitCore();
junit.addListener(new org.junit.internal.TextListener(System.out));
junit.run(UpchainTokenSpecification.class);
