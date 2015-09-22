'use strict';

import fs from 'fs';
import path from 'path';
import co from 'co';
import Chalk from 'chalk';
import R from 'ramda';

import Trunk from '../trunk';

const commandspath = path.resolve(__dirname + '/commands');

fs.readdir(commandspath, function (err, files) {
    if(err) { throw err; }

    const commands = files
        .map(file => path.join(commandspath, file))
        .filter(file => fs.statSync(file).isFile())
        .filter(file => path.extname(file) === '.js')
        .map(file => {
            let commandModule = require(file);
            let meta = commandModule.meta();
            let func = commandModule.default;
            return {
                command: meta.command,
                description: meta.description,
                func
            };
        });

    const args = ['node', 'console.js'].concat(process.argv.slice(3));
    const commandname = 2 in args ? args[2] : '';

    const command = R.find(R.propEq('command', commandname))(commands);

    if(commandname === '' || command === undefined) {
        const availablecommands = commands.map(o => {
            const paddedCommand = o.command + Array(20 - o.command.length + 1).join(' ');
            return Chalk.yellow(paddedCommand) + '\t' + Chalk.cyan(o.description);
        }).join('\n');
        console.error(Chalk.red('Command not found ' + commandname + '; available commands:\n') + availablecommands);
        process.exit(1);
    }

    const trunk = Trunk({ appdir: path.resolve(__dirname, '..', '..'), scope: 'cli' });
    trunk.open().then(() => {
        co((command['func']())({ args, trunk: trunk.services }))
            .then(() => {
                console.log(Chalk.cyan('-- Commande terminée.'));
                process.exit(0);
            })
            .catch(err => {
                console.error(Chalk.red(err.stack));
                process.exit(1);
            });
    }).catch(err => console.log(err.stack));

});