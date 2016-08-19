// use strict
var TX_BROWSER="https://morden.ether.camp/transaction";
// camel case or uderscore. one of them
var account_me, account_other;
var name_me, name_other;
var balance_me, allowed_me;

// docs and own file
function setErrMsg(message) {
  $("#errmsg").text(message).stop().css({opacity:100}).delay(3000).fadeTo('slow',0);
}

const MAX_LOG_ROWS=3;
var nextRowId=0;
// apidcos
function log(msgType,message,txId, rowId) {
    // 2 spaces indent on JS

    var rowByTxId = $('tr[txId="'+txId+'"]');
    var rowByRowId = $('tr#row_'+rowId);
    var noTx = typeof txId === 'undefined';
    if (typeof rowId === 'undefined') {
        if (rowByTxId.length == 1) {
            return; // Tx is already confirmed.
        }
        // event from unconfirmed Tx just send.
        rowId = nextRowId++ % (MAX_LOG_ROWS+1);                         //create new rowId for new row // and put docs even more to the right side ;)
    }
    var dateTime = new Date($.now()).toLocaleTimeString().toLowerCase();
    // not so sexy, html
    var newRowHtml = noTx
        ? '<tr id="row_'+rowId+'">' +
            '<td>'+msgType+'</td>' +
            '<td class="message">'+message+'</td><td>'+dateTime+'</td>' +
          '</tr>'
        : '<tr id="row_'+rowId+'" txId="'+txId+'">' +
            '<td><a href="'+TX_BROWSER+'/'+txId+'" target="__blank">'+msgType+'</a></td>' +
            '<td class="message">'+message+'</td><td>'+dateTime+'</td>' +
          '</tr>'
        ;
    var targetRow = rowByRowId.add(rowByTxId);
    if (targetRow.length==0) {
        $(newRowHtml).prependTo('table#log > tbody');
        $('[id^="row_"]:nth-child('+MAX_LOG_ROWS+')').nextAll().remove();
    } else {
        targetRow.replaceWith(newRowHtml);
    }
    // 3 ifs in one piece of code, you might want to split this along the lines

    return rowId;
}

function readAttributesPromise(contract, attributes){
  var allPromises=[];
  // map?
  attributes.forEach(e=>{
    // #yutrycatch?
    try{
      var val = contract[e]();
      // indent
  allPromises.push(val);
  }catch(e){
    //  #yu console log. Never for end customer code. Handle a error in the ui
      console.log(e);
    }
  });
  return Promise.all(allPromises).then(values =>{
          // some spaces help reading.
          var result={'id':contract.address};
    attributes.forEach((attr,i)=>{
      result[attr]=values[i];
  });
  // formatting is important, if you decide to use that many
    return result;
  })
}

function setupEventHandlers(){
  var token = HumanStandardToken.deployed();
  token.Approval().watch(function (error, event) {
    if (error) {
      setErrMsg(error);
    } else {
      if (event.args._owner == account_me) {
          log("RCVD",event.args._value+" tokens  approved for "+name_other,event.transactionHash);
          $('#allowed').text(balance_me = event.args._value).hide().fadeIn();
      } else if (event.args._spender == account_me) {
          log("RCVD",event.args._value+" tokens approved for me",event.transactionHash);
          $('#credit').text(allowed_me = event.args._value).hide().fadeIn();
      } else {
          //do nothing: it is unrelated event.
      }
      return $("#currentfund").text(balance_me.plus(allowed_me)).hide().fadeIn();
   }
  });

  // return token.Transfer().watch(functionName) would be more readable
  token.Transfer().watch(function (error, event) {
    if (error) {
      setErrMsg(error);
    } else {
      // all this needs comments and cleanup
      if (event.args._to==account_me || event.args._from==account_me){
        token.balanceOf(account_me, {from: account_me}).then(function (value) {
            log("RCVD",event.args._value+" tokens received by me ",event.transactionHash);
            $("[name=balance]").text(balance_me=value).hide().fadeIn();
            $("#currentfund").text(balance_me.plus(allowed_me)).hide().fadeIn();
            return token.allowance(account_me, account_other, {from: account_me});
        }).then(function (value) {
          return $("#allowed").text(value).hide().fadeIn();
        })
      } else {
          //do nothing: it is unrelated event.
      }
    }
  });
}

// here you can build something testable
function fetchTokenData() {
  var token = HumanStandardToken.deployed();
  return Promise.all([
    token.totalSupply({from: account_me}).then(function(value) {
      return $("#total_supply").text(value);
    }),
    token.balanceOf(account_me, {from: account_me}).then(function (value) {
      return $("[name=balance]").text(balance_me=value);
    }),
    token.allowance(account_me, account_other, {from: account_me}).then(function (value) {
      return $("#allowed").text(value);
    }),
    token.allowance(account_other, account_me, {from: account_me}).then(function (value) {
      return $("#credit").text(allowed_me=value);
    }).then(()=>{
      return $("#currentfund").text(balance_me.plus(allowed_me));
    })
  ]);
}

function transfer() {
    var token = HumanStandardToken.deployed();
    var amount = parseInt($("#amount_send").val());
    if (isNaN(amount)) {
        setErrMsg("invalid or missed amount!");
    } else if (amount > balance_me) {
        setErrMsg("not enough money");
    } else {
        var rowId;
        token.transfer(account_other, amount, {from: account_me}).then(function (tx, err) {
            if (err) {
                var txId = web3.eth.getTransactionReceipt(tx).transactionHash;
                log("ERR", amount + " tokens sent to " + name_other, txId, rowId);
            } else {
                var txId = web3.eth.getTransactionReceipt(tx).transactionHash;
                log("ACK", amount + " tokens sent to " + name_other, txId, rowId);
            }
            return fetchTokenData();
        });
        rowId = log("SENT", amount + " tokens sent to " + name_other);
    }
}

function allow() {
  var token = HumanStandardToken.deployed();
  var amount = parseInt($("#amount_allow").val());
  if (isNaN(amount)) {
      setErrMsg("invalid or missed amount!");
  } else if (amount > balance_me) {
      setErrMsg("not enough money");
  } else {
      var rowId;
      token.approve(account_other, amount, {from: account_me}).then(function(tx,err) {
          if (err) {
              var txId = web3.eth.getTransactionReceipt(tx).transactionHash;
              log("ERR", amount + " tokens approved to " + name_other, txId, rowId);
          } else {
              var txId = web3.eth.getTransactionReceipt(tx).transactionHash;
              log("ACK", amount + " tokens approved to " + name_other, txId, rowId);
          }
        fetchTokenData();
      });
      rowId = log("SENT", amount + " tokens approved to " + name_other);
  }
}

function claim() {
  var token = HumanStandardToken.deployed();
  var amount = parseInt($("#amount_claim").val());
  if (isNaN(amount)) {
    setErrMsg("invalid or missed amount!");
  } else {
      var rowId;
      token.transferFrom(account_other, account_me, amount, {from: account_me}).then(function (tx, err) {
          if (err) {
              var txId = web3.eth.getTransactionReceipt(tx).transactionHash;
              log("ERR", amount + " tokens transfered from " + name_other, txId, rowId);
          } else {
              var txId = web3.eth.getTransactionReceipt(tx).transactionHash;
              log("ACK", amount + " tokens transfered from " + name_other, txId, rowId);
          }
          fetchTokenData();
      });
      rowId = log("SENT", amount + " tokens transfered from " + name_other);
  }
}

function setupOnEnter(){
    ['send','allow','claim'].forEach(actionName => {
        $('#amount_'+actionName).keypress(function(e) {
            if(e.which == 13) {
                $(this).blur();
                $('#'+actionName).focus().click().blur();
                $(this).focus();
            }
        });
    })
}

window.onload = function() {
  web3.eth.getAccounts(function(err, accounts) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accounts.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    var url = window.location.href;
    if (url.substring(url.indexOf("?")+1) == 'bob'){
      name_me='Bob';
      name_other='Alice';
      account_me=accounts[1];
      account_other=accounts[0];
    } else {
      name_me='Alice';
      name_other='Bob';
      account_me=accounts[0];
      account_other=accounts[1];
    }
    $('[name=me]').append(name_me)
    $('[name=other]').append(name_other);
    fetchTokenData();
    setupEventHandlers();
    setupOnEnter();
  });
}
