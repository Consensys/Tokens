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
        React.render(<ContainerHelper templates={reactor_config.templates} compiled={reactor_config.total_compiled} addresses={reactor_config.addresses} options={reactor_config.options}/>, document.getElementById('contracts'));
    }
});
