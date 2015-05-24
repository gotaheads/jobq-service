var dateFormat = require('dateformat');
exports.config = (function () {
    now = new Date()
    stamp =  dateFormat(now, "yyyyMMddHHmm");
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
        },
        toJson: function(err, res) {
            s = res.text

            if(s.indexOf('Internal Server Error') > -1) {
                return;
            }

            s = s.replace(/\n/g, "\\n")
            return JSON.parse(s)
        }


}
})()
