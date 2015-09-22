'use strict';

export default function() {
    return {
        PORT: process.env.PORT || 4000,
        DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:@host:5432/dbname',
        //SPAURL: 'http://127.0.0.1:8003/',
        //RAVENID: process.env.RAVEN_ID || 'https://xxx:xxx@app.getsentry.com/xxx',
        ENVIRONMENT: process.env.ENVIRONMENT || 'prod'
    };
}
