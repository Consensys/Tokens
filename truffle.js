module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/upchain-web3-http-provider.js",
      "javascripts/jquery-3.1.0.min.js",
      "javascripts/jquery.color-2.1.2.min.js",
      "javascripts/app.js",
      "javascripts/web3-util.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/",
    "fonts/": "fonts/"
  },
  rpc: {
    providerName: "UpchainHttpProvider",
    additionalHeaders: {
      'X-API-KEY': '239239'
    },
    certificate: './cert/localhost.crt',
    key: './cert/localhost.key',
    secure: false,
    host: "localhost",
    port: 8545
  }
};
