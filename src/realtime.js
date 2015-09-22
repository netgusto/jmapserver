'use strict';

import SocketIO from 'socket.io';
import Cookies from 'cookies';
import co from 'co';
import Chalk from 'chalk';
import Immutable from 'immutable';

export default ({ server, appkeys, sessionStore }) => {

    const io = SocketIO(server);
    let queue = Immutable.List();

    io.use((socket, next) => {
        const handshakeData = socket.request;

        if(!('headers' in handshakeData) || !('cookie' in handshakeData.headers)) {
            return next(new Error('No cookie transmitted.'));
        }

        const cookies = new Cookies({ headers: handshakeData.headers }, null, appkeys);
        const sessionID = 'koa:sess:' + cookies.get('koa.sid');

        co(function *() {

            let session;

            try {
                session = yield sessionStore.get(sessionID);
            } catch(e) {
                return next(new Error('Error'));
            }

            if(!session || session === undefined) {
                return next(new Error('Error'));
            } else {
                socket.sessionID = sessionID;
                socket.session = session;

                return next();
            }
        });
    });

    const authentifiedSocketActionWrapper = function(socket, success, failure) {
        let failureWrapper = () => {
            console.log(Chalk.red('# Websocket: Unauthorized Socket Connection dropped !!!'));
            failure();
        };

        return (data) => {
            co(function*() {
                try {
                    const session = yield sessionStore.get(socket.sessionID);
                    if(session && session.user) {
                        //console.log(Chalk.green('# Websocket:') + ' ' + Chalk.gray('Authorized action from ' + socket.sessionID));
                        success(data, session.user);
                    } else {
                        failureWrapper();
                    }
                } catch(e) {
                    return failureWrapper();
                }
            });
        };
    };

    io.on('connection', function(socket) {
        console.log(Chalk.green('# Websocket:') + ' ' + Chalk.gray('Welcome, ' + socket.sessionID));

        socket.on('store', authentifiedSocketActionWrapper(socket, (data/*, user*/) => {
            queue = queue.push({ origin: socket.id, data });
        }));
        queue = queue.push({ origin: socket.id });
    });

    setInterval(() => {
        if(queue.count() === 0) { return; }

        //console.log('EMIT !', queue.count(), 'event(s) in queue');

        let finalQueue = queue;
        queue = Immutable.List();

        if(finalQueue.count() > 0) {
            console.log(Chalk.green('# Websocket:') + ' Emitting %s event(s)', finalQueue.count());
            io.sockets.emit('reload', finalQueue.toJS());
        }
    }, 1000);

    return io;
};
