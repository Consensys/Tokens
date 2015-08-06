# Personal Token 

This is a simple token template for a personal token. The idea is that you can replace the config.json with your name, image and address of the token contract (uses Standard_Token.sol).

It uses React in the front-end currently to scaffold this form/input. Perhaps slightly overkill at the moment, but useful for future templating.

# Forking the Template

First you must deploy the Standard_Token.sol to the network (your only option being how much initial tokens you will receive). When you have the address, you must edit the following:

You do NOT have to rebuild for this to work. In the "build" directory, all you need to change is the following:

In reactor_config.json, there is a key for the address. Replace the old address with the new one (for your deployed Standard_Token.sol).
In config.json, you must edit 2 things: the name as the header, and a simple link to a static image/logo of your token.

Currently, the code uses ajax calls, thus if you run it locally, you need to serve the directory (something as simple as ```python -m SimpleHTTPServer``` will work). A fully bundled version will come soon (where you don't need to serve the local files). Of course if you upload it to S3 or whatnot, and update the static files to full HTTP links, then you won't need to to do have a local server running.

It currently works by connecting to a local RPC, so you must have geth running. Enjoy sending/creating tokens!

# Building on this template

The template uses the [Contract Reactor](https://github.com/simondlr/Contract-Reactor) & [Truffle](https://github.com/ConsenSys/truffle). The Contract Reactor is a set of React components that allows you to easily scaffold out a front-end. If you want to have more functionality from the ABI, just edit the reactor_config.json with the required templating sections (see Contract Reactor for documentation). Truffle is a development framework for Ethereum. It bundles different components together (which is what you see in the build directory).
