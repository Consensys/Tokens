var account_me, account_other;
var name_me, name_other;
var balance_me, allowed_me;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
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
      setStatus(error);
    } else {
      if (event.args._owner==account_me){
        $('#allowed').text(balance_me=event.args._value).hide().fadeIn();
      } else {
        $('#credit').text(allowed_me=event.args._value).hide().fadeIn();
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
  setStatus("Initiating transaction... (please wait)");
  return token.transfer(account_other, amount, {from: account_me}).then(function(tx,err) {
    setStatus("Transaction complete!");
    return fetchTokenData();
  });
};

function allow() {
  var token = HumanStandardToken.deployed();
  var amount = parseInt($("#amount_allow").val());
  if (isNaN(amount)) {
    setStatus("invalid or missed amount!");
  }
  setStatus("Initiating transaction... (please wait)");
  token.approve(account_other, amount, {from: account_me}).then(function() {
    setStatus("Transaction complete!");
    fetchTokenData();
  });
};

function claim() {
  var token = HumanStandardToken.deployed();
  var amount = parseInt($("#amount_claim").val());
  if (isNaN(amount)) {
    setStatus("invalid or missed amount!");
  }
  setStatus("Initiating transaction... (please wait)");
  token.transferFrom(account_other, account_me, amount, {from: account_me}).then(function() {
    setStatus("Transaction complete!");
    fetchTokenData();
  });
};

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
    if (url.substring(url.indexOf("#")+1) == 'bob'){
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
    $('#hello').append(name_me)
    $('[name="other"]').append(name_other);
    fetchTokenData();
    setupEventHandlers();
  });
}
