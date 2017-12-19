/**
 * Created by gota on 12/12/17.
 */
const request = require('superagent');
const R = require('ramda');
const quoteItemLoader = require('./load-quotes');

module.exports = (path) => {
    const url = `${process.env.PROXY_HOST}/${path}/quotes`;
    console.log('url: %s', url);
    return request.get(url).then(res => {
        const quotes = R.prop('body',res);
        console.log('quotes: %s', quotes);
        return quoteItemLoader(quotes);
    });
};
