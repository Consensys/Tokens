module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/jquery-3.1.0.slim.min.js",
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
    host: "localhost",
    port: 8545
  }
};
