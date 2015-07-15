//TODO: Add control panel. Starts mining & unlocks + result view (instead of JS console)
//TODO: config.json doesn't feel 100% the best route to take... Potentially refactor into one, and allow rewriting of it (when addresses are created)
//TODO: Templating should be derived from the .sol eventually.

var Reactor = React.createClass({
    render: function() {
        return (
        <div>
            {Object.keys(this.props.compiled).map(function(result) { //iterate through multiple contracts based on keys
                //console.log(this.props.compiled[result]);
                //var abi = this.props.compiled[result].info.abiDefinition;
                var contract = web3.eth.contract(this.props.compiled[result].info.abiDefinition);
                var instance = contract.at(this.props.addresses[result]);
                <hr/>
                var contract_template = {};
                var new_compiled = this.props.compiled;
                var abi = this.props.compiled[result].info.abiDefinition;
                if(this.props.options[result]["template_overlay"] == false) {
                    //remove parts of the ABI.
                    $.each(abi, function(i, obj) {
                        if(obj.name != undefined) {
                            //console.log(this.props.templates[result]);
                            if(this.props.templates[result].hasOwnProperty(obj.name) == false) {
                                console.log("deleting part of abi");
                                console.log(abi[i]);
                                delete abi[i];
                            }
                        }
                    }.bind(this));
                    console.log("false");
                    
                }

                if(this.props.templates.hasOwnProperty(result)) {
                    contract_template = this.props.templates[result]; //if a contract has a template.
                }
                return  (
                    <div key={result}>
                    <ContractWrapper key={result} name={result} contract_template={contract_template} compiled={this.props.compiled[result]} instance={instance} />
                    </div>
                )
            }, this)}
        </div>
        );
    }
});
