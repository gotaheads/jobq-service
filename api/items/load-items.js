/**
 * Created by gota on 19/12/17.
 */
const R = require('ramda');

const transform = (i, quote) => {
    return {
        created:quote.created,
        itemType:i.itemType,
        item:i.item,
        wholesale:i.wholesale,
        retail:i.retail,
        margin:i.margin,
    }
}

module.exports = (items, quote) => {
    console.log('items.length!: %s', items.length);
    return items.map(i => transform(i, quote));
};

//
// const objs = [
//     {name: '1st', completed: false},
//     {name: '2nd', completed: false},
//     {name: '3rd', completed: true}
// ]
//
// const transducer = R.compose(
//     R.filter(R.propEq('completed', true)),
//     R.map(obj => {
//         return {
//             label: `${obj.name} (${obj.completed})`
//         }
//     })
// )
//
// const intoArray = R.into([])
//
// intoArray(transducer, objs)