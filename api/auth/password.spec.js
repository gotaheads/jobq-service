/**
 * Created by gota on 29/11/17.
 */
require('dotenv').config();

const passwd = require('./password');

const pass = '12345', hash = passwd.cryptPassword(pass);
console.log('hash %s', hash);
const yesNo = passwd.comparePassword(pass, hash);
console.log('comparePassword %s', yesNo);
