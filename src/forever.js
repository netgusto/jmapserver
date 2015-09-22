'use strict';

var forever = require('forever-monitor');
var path = require('path');

var logdir = path.join(__dirname, '..', 'var', 'log');

/*var child = */forever.start(['npm', 'run', 'nodemon-prod'], {
    max: Number.MAX_VALUE,
    silent: false,
    pidFile: './var/run/forever.pid',
    killTree: true,
    watch: false,
    logFile: logdir + '/forever.log',
    outFile: logdir + '/stdout.log',
    errFile: logdir + '/stderr.log'
});
