/**
 * Created by gota on 29/11/17.
 */
module.exports = (function(host) {
    'use strict';
    return {
        db: (dbpath) => require('mongoskin').db(`${process.env.MONGODB_HOST}/${dbpath}`)
    }
})();