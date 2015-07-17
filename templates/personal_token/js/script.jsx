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
    var config = 'reactor_config.json'; //random default
}

$.ajax({
    url: config,
    dataType: 'json',
    cache: false,
    error: function(data) {
        console.log(data);
    },
    success: function(data) {
        //map through multiple contracts (this includes multiple ones in 1 file + different files).
        console.log(data);
        var total_compiled = {};
        var addresses = {}; 
        var templates = {};
        var options = {};
        Object.keys(data["contracts"]).map(function(contract_name) { //iterate through multiple contracts based on keys
            $.ajax({
                //fetch .sol and compile it, adding compiled result & its specified address to separate dictionaries
                //3 parts: the compiled code from .sols. The address mapping. The templates.
                url: data["contracts"][contract_name].path,
                dataType: 'text',
                cache: false,
                async: false,
                success: function(contract) {
                    /*
                    This is slightly "hacky". If one file has multiple contracts, it returns one dictionary.
                    This concatenates them in the scenario where there are multiple files as well.
                    */
                    compiled = web3.eth.compile.solidity(contract);
                    console.log(compiled);
                    console.log(data["contracts"]);
                    Object.keys(compiled).map(function(compiled_contract_name) {
                        if(compiled_contract_name in data["contracts"]) {
                            console.log("compiled name yes");
                            if(total_compiled.hasOwnProperty(compiled_contract_name) == false) { //not yet inserted
                                console.log("inserting");
                                addresses[compiled_contract_name] = data["contracts"][compiled_contract_name].address; //not sure why I've been doing [] & . notation here.
                                templates[compiled_contract_name] = data["contracts"][compiled_contract_name].template;
                                options[compiled_contract_name] = {
                                    "template_overlay": data["contracts"][compiled_contract_name].template_overlay,
                                    "deploy_overlay": data["contracts"][compiled_contract_name].deploy_overlay
                                };

                                //feels like really nasty code. rewrite.
                                var comp = {};
                                comp[compiled_contract_name] = compiled[compiled_contract_name];
                                $.extend(total_compiled, comp);
                            }
                        }
                    });
                }
            });
        });
        console.log(total_compiled); 
        console.log(addresses); 
        console.log(templates); 
        console.log(options); 
        //fetch template specific config information
        $.ajax({
              url: "../config.json",
                dataType: 'json',
                cache: false,
        })
        .done(function(data) {
            React.render(<Header data={data} />, document.getElementById('top'));
            React.render(<Reactor templates={templates} compiled={total_compiled} addresses={addresses} options={options}/>, document.getElementById('contracts'));
        });
    }
});
