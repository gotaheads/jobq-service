require('dotenv').config();
const request = require('superagent');
const R = require('ramda');
const expect = require('expect.js');

describe('Quote items', function () {

    it('Load items', function (done) {


        console.log('URL: %s', process.env.URL_MAX_QUOTES);
        request.get(process.env.URL_MAX_QUOTES).then(res => {
            const quotes = R.prop('body',res);
            console.log('quotes: %j', quotes);


            done();
        });

        // expect(res).to.exist;
        // expect(res.status).to.equal(200);
        // expect(quotes.id).to.equal(id);
    });
});

