//EXAMPLE
//helper function to get URL parameters.
var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();
/*------------------*/

var config;
if("config" in urlParams) {
    config = urlParams['config'];
} else {
    var config = './reactor_config.json'; //default
}

if("address" in urlParams) {
    config = './token_reactor.json';
}

var Header = React.createClass({
    render: function() {
        return (<div><h2>{this.props.title}</h2></div>);
    }
});

$.ajax({
    url: config,
    dataType: 'json',
    cache: false,
    error: function(data) {
        console.log(data);
        console.log("error");
    },
    success: function(data) {
        //map through multiple contracts (this includes multiple ones in 1 file + different files).
        console.log(data);
        console.log("success");
        var reactor_config = parseConfig(data);

        //fetch template specific config information
        if("address" in urlParams) {
            React.render(<Header title={"Token functions"}/>, document.getElementById('header'));
        } else {
            React.render(<Header title={"Create & Deploy a Token Contract"}/>, document.getElementById('header'));
        }


        React.render(<ContainerHelper templates={reactor_config.templates} compiled={reactor_config.total_compiled} addresses={reactor_config.addresses} options={reactor_config.options}/>, document.getElementById('contracts'));
    }
});
