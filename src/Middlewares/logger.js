'use strict';

import Chalk from 'chalk';

module.exports = function() {
    return function *(next) {
        const start = new Date();
        yield next;
        const ms = new Date() - start;
        let email;
        if(this.session && this.session.user && this.session.user.email) {
            email = this.session.user.email;
        } else {
            email = 'anonymous';
        }

        console.log('%s %s - %s - %s', Chalk.cyan(this.method), Chalk.gray(this.url), Chalk.red(ms + 'ms'), Chalk.cyan(email));
    };
};
