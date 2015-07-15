var DeployWrapper = React.createClass({
    getInitialState: function() {
        //check if contract exists
        codeOnChain = web3.eth.getCode(this.props.instance.address);
        var submitted = true;

        /*
        Currently, this check is a hack. Compiled code has a padded part in the front (that is supposedly the keccak hash of the bytecode).
        However, haven't been able to understand or reproduce it from the yellow paper or the solidity compiler code.
        The latter parts will match though. However, there could be scenarios where only parts of it matches and thus it could erroneously match.
        At the very least, it should not be 0x.
        */
        if (this.props.compiled.code.indexOf(codeOnChain.substring(2)) == -1 || codeOnChain == "0x") {
            submitted = false;
            //console.log("Contract doesn't exist.");
        }
        return {
           submitted : submitted,
        }
    },
    deployContract: function() {
        //use max gas for now.
        var address = web3.eth.sendTransaction({gas: '3141592', from: web3.eth.accounts[0], data: this.props.compiled.code}); //TODO: change to include other accounts
        console.log(address); //TODO: Add callback that cascades back and sets addresses for contracts.
    },
    render: function() {
        if(this.state.submitted == true) {
            return (
                <div>
                    Contract exists on the blockchain.   
                </div>
            );
        } else {
            return (
                <div>
                    Contract does not exist on the blockchain. <button className={"btn btn-default"} onClick={this.deployContract}>Deploy Contract {this.props.name}</button>
                </div>
            );
        }
    }
});
