# Personal Token 

This is a simple token template for a personal token. The idea is that you can replace the config.json with your name, image and address of the token contract (uses Standard_Token.sol).

It uses React in the front-end currently to scaffold this form/input. Perhaps slightly overkill at the moment, but useful for future templating.

It uses Bower to install the front-end components.

# Forking the Template

First you must deploy the Standard_Token.sol to the network (your only option being how much initial tokens you will receive). When you have the address, you must edit the following:

In reactor_config.json, there is a key for the address. Replace the old address.
In config.json, you must edit 2 things: the name as the header, and a simple link to a static image/logo of your token.

Then, you must install the bower components. Bower, is a package manager that allows you to install front-end components. Once you have bower installed, run:
bower install

where the bower.json file lives. This will install the components.

(Later on, bower will be replaced with a distributed bundle, so you don't have to use bower to install the front-end components.)

If everything is set up correctly, and you have an Ethereum node with RPC enabled, double-clicking on the index.html file will open a portal to the token contract. Enjoy sending tokens around! In order for others to use this token system, you will need upload the static files somewhere on the web where others can access them. They will also need to a run a local Ethereum node.

