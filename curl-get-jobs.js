console.log('starting..');

curl = require('curlrequest');
//curl = require('node-curl');

exports.jobs = function() {
    console.log('starting module..');

    var options = { url: 'http://landscapequoting.appspot.com/restlet/jobs', include: true };

    curl.request(options, function (err, parts) {
        parts = parts.split('\r\n');
        var data = parts.pop()
            , head = parts.pop();

        console.log('%s data, head %s', data, head);

        client.post("http://remote.site/rest/xml/method", args, function(data,response) {
            // parsed response body as js object
            console.log(data);
            // raw response
            console.log(response);
        });

    });

    //curl -d '{ "A1" : 201 }' -H "Content-Type: application/json" http://localhost:3000/dfl/jobs


    //curl('http://landscapequoting.appspot.com/restlet/jobs', function(err) {
    //    console.info(this.status);
    //    console.info('-----');
    //    console.info(this.body);
    //    console.log('%s this.body', this.body);
    //    console.info('-----');
    //    console.info(this.info('SIZE_DOWNLOAD'));
    //});

    //var Client = require('node-rest-client').Client;
    //
    //client = new Client();
    //
    //client.registerMethod("jsonMethod", "http://landscapequoting.appspot.com/restlet/jobs", "GET");
    //
    //client.methods.jsonMethod(function(data,response){
    //    // parsed response body as js object
    //    console.log('%s jobs data: %j', data.length, data[0]);
    //    // raw response
    //    console.log('response: %s', response);
    //});

    //client.get("http://landscapequoting.appspot.com/restlet/jobs",
    //    function(data, response){
    //    // parsed response body as js object
    //    console.log('data: %j', data);
    //    // raw response
    //    console.log('response: %s', response);
    //});
}()

//http://landscapequoting.appspot.com/restlet/jobs


// direct way
//client.get("http://remote.site/rest/xml/method", function(data, response){
//    // parsed response body as js object
//    console.log(data);
//    // raw response
//    console.log(response);
//});
//
//// registering remote methods
//client.registerMethod("jsonMethod", "http://remote.site/rest/json/method", "GET");
//
//client.methods.jsonMethod(function(data,response){
//    // parsed response body as js object
//    console.log(data);
//    // raw response
//    console.log(response);
//});


//var http = require('http')
//    url = 'http://landscapequoting.appspot.com',
//    options = {
//    host: url,
//    port: 80,
//    path: '/restlet/jobs',
//    method: 'POST'
//};
//
//http.request(options, function(res) {
//    console.log('STATUS: ' + res.statusCode);
//    console.log('HEADERS: ' + JSON.stringify(res.headers));
//    res.setEncoding('utf8');
//    res.on('data', function (chunk) {
//        console.log('BODY: ' + chunk);
//    });
//}).end();