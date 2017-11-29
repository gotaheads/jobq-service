/**
 * Created by gota on 29/11/17.
 */
const bcrypt = require('bcrypt');
module.exports = (function(host) {
    'use strict';
    //const salt = bcrypt.genSaltSync();
    const salt = process.env.SALT
    console.log('S: %s', salt);
    return {
        cryptPassword: (password) => bcrypt.hashSync(password, salt),
        comparePassword:(plainPass, hashword) => {
            return bcrypt.compareSync(plainPass, hashword);
        }
    }
})();