//takes instance and its part of the ABI + its part of the template
var FunctionWrapper = React.createClass({
    executeFunction: function(type) {
        args = {};
        //get inputs [replace with pure js as this requires jquery as a dependency]
        $.each(this.refs, function(i, obj) {
              args[obj.props.arg] = obj.state.value; //map inputs to a dictionary
        });
        var function_name = this.props.data.name.split("(")[0]; //seems very hacky to get only function name. It's written as 'function(args)' usually.
        if(type == "call") {
            result = this.props.instance[function_name].call(args);
            console.log(result);
        } else if(type == "transact") {
            result = this.props.instance[function_name].sendTransaction(args);
            console.log(result);
        }
    },
    render: function() {
        //use react refs to keep track of inputs to a function.
        if(this.props.function_template.button != undefined) {
            var button = <div><button className={"btn btn-default"} onClick={this.executeFunction.bind(this,"transact")}>{this.props.function_template.button}</button></div>;
        } else {
            var button = <div><button className={"btn btn-default"} onClick={this.executeFunction.bind(this,"call")}>Call() {this.props.data.name}</button> - <button className={"btn btn-default"} onClick={this.executeFunction.bind(this,"transact")}>Transact() {this.props.data.name}</button></div>;
        }
        return (
        <div>
            {this.props.data.inputs.map(function(result) {
                var input_template = {};
                var arg = result.name;
                if (this.props.function_template.inputs.hasOwnProperty(result.name)) { //if a specific function has a template for it.
                    input_template = this.props.function_template.inputs[result.name];
                    arg = this.props.function_template.inputs[result.name].default_value;
                }

                return <div key={result.name}><InputWrapper input_template={input_template} ref={result.name} arg={arg} /></div>
            }, this)}
            <br />

            {button}
        </div>
        );
            
    }
});
