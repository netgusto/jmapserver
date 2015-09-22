'use strict';

import path from 'path';

import koa from 'koa';
import bodyparser from 'koa-bodyparser';
import session from 'koa-generic-session';
import staticserver from 'koa-static';
import compress from 'koa-compress';

import Chalk from 'chalk';

import responsetime from './middlewares/responsetime';
import errorwatch from './middlewares/errorwatch';
import routes from './middlewares/routes';
import logger from './middlewares/logger';

import server from './server';
import realtime from './realtime';
import Trunk from './trunk';

const appdir = path.resolve(__dirname, '..');
const trunk = Trunk({ appdir: appdir, scope: 'http' });

trunk.open().then(() => {

    //const { env, models, sessionStore, keys } = container;

    const env = trunk.get('env');
    const models = trunk.get('models');
    const sessionStore = trunk.get('sessionStore');
    const keys = trunk.get('keys');

    // Initializing application
    const app = koa();
    app.trunk = trunk.koa();
    app.keys = keys;

    // Initializing app monitoring
    app.on('error', err => app.trunk.ravenclient.captureError(err));

    // Middlewares
    app
        .use(compress())
        .use(responsetime())
        .use(errorwatch())
        .use(logger())
        .use(session({ store: sessionStore, ttl: trunk.get('sessionttl') }))
        .use(bodyparser())
        .use(staticserver('./public'))
        .use(routes({ models }).koa());

    // Server
    const appserver = server({ app, env });

    // Realtime
    app.io = realtime({ server: appserver, sessionStore, appkeys: app.keys });

    // Launch !
    appserver.listen(env.PORT, '0.0.0.0');
    console.log(Chalk.black.bgGreen(' (' + env.ENVIRONMENT + ') Magic happens at http://0.0.0.0:' + env.PORT + ' \n'));

    // Starting cronjobs
    //trunk.get('statsjob').start();

}).catch(e => console.log(e.stack));
