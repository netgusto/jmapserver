'use strict';

import http from 'http';

export default function({ app/*, env*/ }) {
    return http.createServer(app.callback());
}
