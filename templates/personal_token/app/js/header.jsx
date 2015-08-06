var Header = React.createClass({
    getInitialState: function() {
        return {
            blockNumber: "", //todo, later for potentially adding contract creation as well.
        }
    },
    render: function() {
        return (
        <div>
            <h3 className={"text-center"} >{this.props.data.token_name} </h3>
            <img src={this.props.data.token_image} className={"img-circle center-block"}/>
        </div>
        );
    }
});
