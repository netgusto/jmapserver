'use strict';

var argv = process.argv;
var childargs = [
    "./node_modules/babel/bin/babel-node",
    "--harmony",
    "./src/cli/cli-es6.js",
    "--"
].concat(argv.slice(2));

var proc = require("child_process").spawn("/usr/bin/env", childargs, {
        encoding: 'utf8',
        stdio: 'inherit'
    }
);

proc.on('exit', function(code) { process.exit(code); });
