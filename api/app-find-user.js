/**
 * Created by gota on 29/11/17.
 */
'use strict';
module.exports = (() => {
    const _ = require('lodash');
    console.log('app-find-user init');
    return (req, res, next) => {
        console.log('app-find-user req.user: %j', req.user);
        const user = _.get(req, 'user', {});
        next();
    }
})();

