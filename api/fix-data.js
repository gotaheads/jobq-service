/**
 * Created by gota on 30/11/17.
 */
require('dotenv').config();

var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;
const _ = require('lodash');
'use strict';
var id = '56320103f7a04dff112944cd',
    database = require('./db/index').db('max');

database.collection('userprofiles').remove({'_id': ObjectID.createFromHexString(id)}, function (err, result) {
    if (err) {
        console.error('error')
    }
    console.log('success');
});
