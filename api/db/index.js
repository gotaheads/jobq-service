/**
 * Created by gota on 29/11/17.
 */
module.exports = (function(host) {
    'use strict';
    var db = {
        db: (dbpath) => require('mongoskin').db(`${process.env.MONGODB_HOST}/${dbpath}`)
    }

    //const dbpath = 'dfl1';
    //const db1 = require('mongoskin').db(`${process.env.MONGODB_HOST}/${dbpath}`);

    return db;
});