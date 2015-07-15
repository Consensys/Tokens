//takes compiled code, instance and template.
var ContractWrapper = React.createClass({
    render: function() {
        return (
            <div>
            <ul>
                {this.props.compiled.info.abiDefinition.map(function(result) {
                    if(result.type == "function") { //TODO: Determine whether events can be called from outside, otherwise it should be included.
                        //react key = unique function name for contract.
                        var function_template = {};
                        if (this.props.contract_template.hasOwnProperty(result.name)) { //if a specific function has a template for it.
                            function_template = this.props.contract_template[result.name];
                        }
                        return <FunctionWrapper function_template={function_template} instance={this.props.instance} key={result.name} data={result}/>;
                    }
                }, this)}
            </ul>
            </div>
        );
    }
});
