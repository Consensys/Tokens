var TX_BROWSER="https://morden.ether.camp/transaction";
var account_me, account_other;
var name_me, name_other;
var balance_me, allowed_me;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
}

const MAX_LOG_ROWS=3;
var nextRowId=0;
function log(msgType,message,txId, rowId) {
    var rowByTxId = $('tr[txId="'+txId+'"]');
    var rowByRowId = $('tr#row_'+rowId);
    var noTx = typeof txId === 'undefined';
    if (typeof rowId === 'undefined') {
        rowId = !noTx && rowByTxId.length==1
              ? parseInt(rowByTxId.attr('id').substring('row_'.length)) //recover rowId from existing row
              : nextRowId++ % (MAX_LOG_ROWS+1);                         //create new rowId for new row
    }
    var dateTime = new Date($.now()).toLocaleTimeString().toLowerCase();
    var newRowHtml = noTx
        ? '<tr id="row_'+rowId+'">' +
            '<td>'+msgType+'</td>' +
            '<td>'+message+'</td><td>'+dateTime+'</td>' +
          '</tr>'
        : '<tr id="row_'+rowId+'" txId="'+txId+'">' +
            '<td><a href="'+TX_BROWSER+'/'+txId+'" target="__blank">'+msgType+'</a></td>' +
            '<td>'+message+'</td><td>'+dateTime+'</td>' +
          '</tr>'
        ;
    var targetRow = rowByRowId.add(rowByTxId);
    if (targetRow.length==0) {
        $(newRowHtml).prependTo('table#log > tbody');
        $('[id^="row_"]:nth-child('+MAX_LOG_ROWS+')').nextAll().remove();
    } else  {
        targetRow.replaceWith(newRowHtml);
    }
    return rowId;
}

function readAttributesPromise(contract, attributes){
  var allPromises=[];
  attributes.forEach(e=>{
    try{
      var val = contract[e]();
  allPromises.push(val);
  }catch(e){
      console.log(e);
    }
  });
  return Promise.all(allPromises).then(values =>{
          var result={'id':contract.address};
    attributes.forEach((attr,i)=>{
      result[attr]=values[i];
  });
    return result;
  })
}

function setupEventHandlers(){
  var token = HumanStandardToken.deployed();
  token.Approval().watch(function (error, event) {
    if (error) {
      log("ERR",error);
      setStatus(error);
    } else {
      if (event.args._owner == account_me) {
          log("ACK",event.args._value+" tokens  approved for "+name_other,event.transactionHash);
          $('#allowed').text(balance_me = event.args._value).hide().fadeIn();
      } else if (event.args._spender == account_me) {
          log("ACK",event.args._value+" tokens approved for me",event.transactionHash);
          $('#credit').text(allowed_me = event.args._value).hide().fadeIn();
      } else {
          //do nothing: it is unrelated event.
      }
      return $("#currentfund").text(balance_me.plus(allowed_me)).hide().fadeIn();
   }
  });
  token.Transfer().watch(function (error, event) {
    if (error) {
      setStatus(error);
    } else {
      if (event.args._to==account_me || event.args._from==account_me){
        token.balanceOf(account_me, {from: account_me}).then(function (value) {
           // log("ACK",event.args._value+" tokens received by me ",event.transactionHash);
            $("[name=balance]").text(balance_me=value).hide().fadeIn();
            $("#currentfund").text(balance_me.plus(allowed_me)).hide().fadeIn();
            return token.allowance(account_me, account_other, {from: account_me});
        }).then(function (value) {
          return $("#allowed").text(value).hide().fadeIn();
        })
      }
    }
  });
}

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
    setStatus("invalid or missed amount!");
    return;
  }
  var rowId;
  token.transfer(account_other, amount, {from: account_me}).then(function(tx,err) {
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

function allow() {
  var token = HumanStandardToken.deployed();
  var amount = parseInt($("#amount_allow").val());
  if (isNaN(amount)) {
    setStatus("invalid or missed amount!");
  }
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

function claim() {
  var token = HumanStandardToken.deployed();
  var amount = parseInt($("#amount_claim").val());
  if (isNaN(amount)) {
    setStatus("invalid or missed amount!");
  }
  var rowId;
  token.transferFrom(account_other, account_me, amount, {from: account_me}).then(function(tx,err) {
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
  });
}
