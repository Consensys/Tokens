module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/jquery-3.1.0.min.js",
      "javascripts/jquery.color-2.1.2.min.js",
      "javascripts/app.js"
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
