'use strict';

import { Router, route } from 'airline';

import hellocontroller from '../controllers/hello';
//import authenticationcontroller from '../controllers/authentication';

export default function({ models, evaluationfsm }) {

    const router = new Router();

    // Anonymous routes
    const anonymousroutes =
        route('/',
            route('/', hellocontroller),
            route('/**', function *() { this.body = 'CatchAll'; })/*,
            route().post('/login', authenticationcontroller({
                finduser: ({ login }) => models.Collaborateur.findOne({ where: { email: login } })
            })),
            route('/logout', function* () {
                delete this.session.user;
                this.response.redirect('/');
            })*/
        );

    // API routes
    const apiroutes =
        route('/',
            route('/api', function *() { this.body = { hello: 'world' }; })
        );

    // Mounting routes
    const assertSession = function *(next) {
        this.assert(this.session.user, 401);
        yield next;
    };

    router.load(
        route('/',
            route('/', anonymousroutes),
            route('/api', [assertSession], apiroutes)
        )
    );

    //console.log(router.reflection);

    return router;
};