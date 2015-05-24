var dateFormat = require('dateformat');
exports.config = (function () {
    now = new Date()
    stamp =  dateFormat(now, "yyyyMM");
    console.log('stamp:%s', stamp)
    return {
        src:{
            basePath: 'http://landscapequoting.appspot.com/restlet',
            createUrl:function(path) {
                return this.basePath + path;
            }
        },
        target:{
            basePath: 'http://localhost:3000/dfl' + stamp,
            createUrl:function(path) {
                return this.basePath + path;
            }
        }


}
})()
