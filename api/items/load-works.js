/**
 * Created by gota on 19/12/17.
 */
const R = require('ramda');
const loader = require('./load-items');

module.exports = (works, quote) => {
    return works.reduce((prev, work) => {
        console.log('work.title: %s', work.title);
        return prev.concat(loader(R.prop('items', work), quote));
            // console.log('work.title: %s, works.items: %s, prev.length: %j',
            //     work.title, items.length, prev.length);
            // return prev.concat(items);
        }, []);

};
