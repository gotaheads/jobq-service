/**
 * Created by gota on 28/11/17.
 */
'use strict';
module.exports = (() => {
    const unless = require('express-unless');
    const jwt = require('express-jwt');
    const secret = 'jobq-secret-aws-u14123654789874';
    const jwtCheck = jwt({
        secret: secret
    });
    jwtCheck.unless = unless;

    console.log('app-jwt start');
    return jwtCheck;
})()
