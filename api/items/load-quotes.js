/**
 * Created by gota on 19/12/17.
 */
const R = require('ramda');
const workLoader = require('./load-works');


const itemSort = R.sortWith([
    R.descend(R.prop('created')),
    R.ascend(R.prop('itemType')),
    R.ascend(R.prop('item'))
]);

module.exports = (quotes) => {
    return itemSort(quotes.reduce((items, quote, index) => {
        return items.concat(workLoader(R.prop('works', quote), quote));
    }, []));
};
