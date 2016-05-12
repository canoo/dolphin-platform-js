Client javascript Dolphin tests runner 
======================================

Prerequisites
-------------
Install node globally. Used version to build '4.2.4'.

Before karma execution make sure to run

`> npm install`

This will install all dependencies specified in package.json into node_modules in your current working directory 

Run tests locally
----------------
 
`>./node-modules/karma/bin/karma start`

Running Karma with the karma-sauce-launcher plugin locally
----------------------------------------------------------
create sauce.json file with username and key ( see example at https://github.com/saucelabs/karma-sauce-example)

Then run karma using karma.conf-ci.js file configuration

`>./node-modules/karma/bin/karma start karma.conf-ci.js`