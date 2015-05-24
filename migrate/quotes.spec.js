var request = require('superagent');
var expect = require('expect.js');
id = 987341
url = 'http://landscapequoting.appspot.com/restlet/job/quote/' + id
ms = 30000
describe('Migrate Quotes', function() {
    this.timeout(ms);
    it ('Load quote: ' + id + ', timeout in ' + ms/1000 + ', url: ' + url, function(done){
        console.log('')
        request.get(url).end(function(err, res) {
            console.log('loaded: %j', res.text)
            expect(res).to.exist;
            expect(res.status).to.equal(200);
            text = res.text
            quote = JSON.parse(text)
            expect(quote.id).to.equal(id);

            done();
        });
    });
});

//describe('Load quote and pase to json', function(){
//    it (function(done){
//        request.post('http://landscapequoting.appspot.com/restlet/job/quote/987341').end(function(res){
//            expect(res).to.exist;
//            expect(res.status).to.equal(200);
//            done();
//        });
//    });
//
//})
