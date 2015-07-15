//takes reference & name for arguments
var InputWrapper = React.createClass({
    getInitialState: function() {
        return {
            value: ""
        }
    },
    handleChange: function(event) {
        this.setState({value: event.target.value});
    },
    render: function() {
        return <div> {this.props.input_template.label} <input className={"form-control"} type="text" value={this.state.value} placeholder={this.props.arg} onChange={this.handleChange}/> </div>
    }
});
