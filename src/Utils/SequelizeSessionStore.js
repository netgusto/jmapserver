'use strict';

/**
 * Module dependencies.
 */

 import Sequelize  from 'sequelize';

//var debug = require('debug')('koa-generic-session:SequelizeSessionStore');

export default class SequelizeSessionStore {
    constructor({ db }) {
        this.db = db;

        this.Session = db.define('session', {
            sid: { type: Sequelize.STRING(255), primaryKey: true },
            expires: { type: Sequelize.DATE, allowNull: false },
            data: {
                type: Sequelize.TEXT,
                get: function() {
                    return JSON.parse(new Buffer(this.getDataValue('data'), 'base64').toString('utf8'));
                },
                set: function(val) {
                    this.setDataValue('data', new Buffer(JSON.stringify(val), 'utf8').toString('base64'));
                }
            }
        }, {
            freezeTableName: true, // Model tableName will be the same as the model name
            underscored: true
        });

        this.Session.sync();
    }

    * get(sid) {

        //console.log('SESSION:get', sid);
        //debug('get with key %s', sid);
        const queryres = yield this.Session.findOne({ where: { sid } });

        if(queryres) {
            return queryres.data;
        }

        return null;
    }

    * set(sid, data, ttl) {
        //debug('set with key %s', sid);

        const queryres = yield this.Session.upsert({
            sid,
            data,
            expires: new Date(new Date().getTime() + ttl)
        });

        return queryres;
    }

    * destroy(sid) {
        //debug('destroy with key %s', sid);

        const queryres = yield this.Session.destroy({
            where: { sid }
        });

        return queryres;
    }
}
