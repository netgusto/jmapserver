'use strict';

import path from 'path';
import Sequelize from 'sequelize';
import raven from 'raven';
//import { CronJob } from 'cron';

import SequelizeSessionStore from './Utils/SequelizeSessionStore';
import environment from './environment';
import ModelFactory from './models';

import { Collaborateur } from './Shared/records';

import { Trunk } from 'trunk';

export default function({ appdir, scope = 'http' }) {

    const trunk = new Trunk();

    trunk
        .add('appdir', () => appdir)
        .add('scope', () => scope)
        .add('sessionttl', () => 30 * 60 * 1000)     // 30 minutes, en millisecondes
        .add('keys', () => ['nIp3monn0awg5aud2goAt0Giev2Amt1Ok4uj2nic7vOf1Ag5yA'])
        .add('logging', () => null)
        .add('ravenclient', ['env'], (env) => new raven.Client(env.RAVENID))
        .add('publicdir', ['appdir'], (_appdir) => path.join(_appdir, 'public'))
        .add('privatedir', ['appdir'], (_appdir) => path.join(_appdir, 'private'))
        .add('env', () => environment())
        .add('db', ['env', 'logging'], (env, logging) => new Sequelize(env.DATABASE_URL, { logging }))
        .add('models', ['db'], (db) => ModelFactory({ db }));

        if(scope === 'http') {
            // Initializing Session store (db-backed)
            trunk
                .add('sessionStore', ['db'], (db) => new SequelizeSessionStore({ db }))
                .add('getCurrentUser', () => function(ctx) {
                    return new Collaborateur(ctx.session.user);
                });

            // Initializing cronjobs
            /*
            trunk
                .add('statsjob', ['statsbuilder'], (statsbuilder) => new CronJob({
                    cronTime: '0 3 * * * *',
                    start: false,
                    onTick: function() {
                        statsbuilder({ date: new Date() });
                    }
                }));
            */
        }

    return trunk;
}
