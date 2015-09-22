'use strict';

//import Chalk from 'chalk';
import PrettyError from 'pretty-error'

export default function() {

    const pe = new PrettyError();
    pe.skipNodeFiles();

    return function *(next) {
        try {
            yield next;
        } catch (err) {
            this.status = err.status || 500;
            this.body = err.message;

            //console.log(Chalk.red(err.stack));
            console.log(pe.render(err));
            console.log(err.stack);

            this.app.emit('error', err, this);
        }
    };
};
