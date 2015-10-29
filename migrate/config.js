var dateFormat = require('dateformat');
exports.config = (function () {
    now = new Date()
    stamp =  dateFormat(now, "yyyyMMddHHmm");
    //console.log('stamp:%s', stamp)

    var toJson = function(err, res) {
        s = res.text

        if(s.indexOf('Internal Server Error') > -1) {
            return;
        }

        s = s.replace(/\n/g, "\\n")

        return JSON.parse(s)
    }
    return {
        src:{
            basePath: 'http://landscapequoting.appspot.com/restlet',
            createUrl:function(path) {
                return this.basePath + path;
            },
            toJson: function(err, res) {
                s = res.text
                if(s.indexOf('Internal Server Error') > -1) {
                    return;
                }
                s = s.replace(/\n/g, "\\n")
                return JSON.parse(s)
            }
        },
        target:{
            basePath: 'http://localhost:3200/dfl' + stamp,
            createUrl:function(path) {
                return this.basePath + path
            },
            idCreated:function(res) {
                var parts = res.header.location.split('/')
                    id = parts[parts.length - 1];

                if(id === undefined) {
                    console.error('id has not been found  %j', res, res.text)
                    throw new Error('id has not been found')
                }
                //console.log('json res: %j, %s', res.header, id)
                return id
            },
            toJson: function(err, res) {
                s = res.text
                return JSON.parse(s)
            }
        },
        toJson: toJson


}
})()
