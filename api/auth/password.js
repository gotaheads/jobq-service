/**
 * Created by gota on 29/11/17.
 */
const bcrypt = require('bcrypt');
const R = require('ramda');
module.exports = (function(host) {
    'use strict';
    //const salt = bcrypt.genSaltSync();
    const salt = process.env.SALT;
    const comparePassword = (plainPass, hashword) => {
        return bcrypt.compareSync(plainPass, hashword);
    }

    console.log('S: %s', salt);
    return {
        cryptPassword: (password) => bcrypt.hashSync(password, salt),
        comparePassword:comparePassword,
        findMaching: (user, users) => {
            console.log('findMaching user: %j users: %j', user, users);
            return users.filter(toCheck => {
                const matched = comparePassword(user.password, toCheck.password);
                console.log('findMaching compare %s', matched);
                return R.equals(toCheck.username, R.prop('username', user)) && matched
            })[0];
        }
    }
})();