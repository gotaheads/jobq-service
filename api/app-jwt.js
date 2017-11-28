/**
 * Created by gota on 28/11/17.
 */
'use strict';
module.exports = ((secret) => {
    const unless = require('express-unless');
    const jwt = require('express-jwt');
    const jwtCheck = jwt({
        secret: secret
    });
    jwtCheck.unless = unless;

    console.log('app-jwt start');
    return jwtCheck;
})
