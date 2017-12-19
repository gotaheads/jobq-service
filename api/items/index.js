
module.exports = (function (api) {
    const R = require('ramda');
    const loader = require('./load-quote-items');
    api.route('/items').get(function (req, res) {
        const path = R.path(['user','path'], req);
        console.log('/items path: %s ', path);
        loader(path).then(items => {
            res.json(items);
        })

    });
    return api;
});
