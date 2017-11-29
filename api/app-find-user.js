/**
 * Created by gota on 29/11/17.
 */
'use strict';
module.exports = (() => {
    
    const _ = require('lodash');
    console.log('app-find-user init');

    const findUser = (req, res, next) => {
        console.log('app-find-user req.user: %j', req.user);
        const user = _.get(req, 'user', {});
        // const name = _.get(user, 'name', 'NO NAME');
        // const userId = _.get(user, 'sub', 'NO CLIENT ID');

        console.log('app-find-user user: %j', user);

        //req.user = {...req.user, id:userId};

        //console.log('app-find-user req.user.id: %s, req.user.name: %s, req.user: %j', userId, name, req.user);
        next();
    }

    return findUser;
})();

