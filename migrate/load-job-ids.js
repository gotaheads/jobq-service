console.log('starting..');
fs = require('fs');

var curl = require('curlrequest'),
    jobs = require('./jobs')

exports.loadJobs = function() {
    console.log('starting module..');

    var options = { url: 'http://landscapequoting.appspot.com/restlet/jobs', include: true };

    var s = '[{"id":"263003","client":"Michelle and Glen Shepherd","address":"Woodhead St Fitzroy Nth","brief":"This is for Michelle and Glen, they want to have this ...","budget":30000.00,"created":1369049039222,"updated":1389854769158,"totalPrice":29843.04,"finalPrice":30097.04,"totalDiff":1.00,"status":"Completed","version":1,"quoteId":987341,"quotes":[]},{"id":"394009","client":"De-Arne campbell","address":"20 Barry St","brief":"Paving to porch\n\n* aa","budget":0.00,"created":1372323665528,"updated":1373196447802,"totalPrice":8567.40,"finalPrice":8567.40,"totalDiff":1.00,"status":"Cancelled","version":1,"quoteId":393008,"quotes":[]},{"id":"507001","client":"Kylie Weaver","address":"26 Cole Crescent Coburg, Victoria 3058","brief":"Front and rear design and construction","budget":40000.00,"created":1383098722805,"updated":1399614468041,"totalPrice":700.00,"finalPrice":700.00,"totalDiff":1.00,"status":"Pending","version":12,"quoteId":5367003,"quotes":[]},{"id":"1067021","client":"Go","address":"204/50 Altona st Kensington","brief":"decking","budget":5000.00,"created":1389607312707,"updated":1398164738802,"totalPrice":11693.50,"finalPrice":11753.50,"totalDiff":1.00,"status":"Preparing Quote","version":7,"quoteId":3217110,"quotes":[]},{"id":"1237001","client":"Tony Ward","address":"16 Arnold St Brighton East","brief":"Soft landscaping to new development on two titles.  One is a family home and the other is to be sold.  Priority is to be given to property being sold with completion done by approximately 19th Feb for promotional photography.\nIrrigation to be included","budget":15000.00,"created":1391222014204,"updated":1394354796646,"totalPrice":21111.22,"finalPrice":22996.62,"totalDiff":1.08,"status":"Completed","version":96,"quoteId":2257066,"quotes":[]},{"id":"2027001","client":"Rosie Nicholson and Tim Ruse","address":"24 Smith St Brunswick West","brief":"Quote on design by MUD","budget":0.00,"created":1393980002876,"updated":1405069771844,"totalPrice":50845.96,"finalPrice":52530.26,"totalDiff":1.03,"status":"Cancelled","version":71,"quoteId":11367170,"quotes":[]},{"id":"2367301","client":"Kate Symons","address":"101 Thompson St Northcote","budget":0.00,"created":1394667807853,"updated":1394689427269,"totalPrice":7480.00,"finalPrice":7480.00,"totalDiff":1.00,"status":"Cancelled","version":17,"quoteId":2367368,"quotes":[]},{"id":"2417934","client":"Debra Armstrong","address":"15/105 Torbay St, Macleod","budget":0.00,"created":1395453267170,"updated":1407292774918,"totalPrice":22282.00,"finalPrice":22517.13,"totalDiff":1.01,"status":"Completed","version":46,"quoteId":6547008,"quotes":[]},{"id":"2507001","client":"David Eales","address":"45 Little Baillie St North Melbourne","brief":"Quote on design by Mud Office","budget":0.00,"created":1395450216325,"updated":1412721904642,"totalPrice":9727.33,"finalPrice":9988.11,"totalDiff":1.02,"status":"Completed","version":58,"quoteId":8597004,"quotes":[]},{"id":"3247001","client":"Tony ward","address":"16 Arnold Rd Brighton East","brief":"Variations","budget":0.00,"created":1398133424589,"updated":1398242677994,"totalPrice":2792.75,"finalPrice":2822.75,"totalDiff":1.01,"status":"Completed","version":33,"quoteId":3247189,"quotes":[]},{"id":"3867273","client":"Sue Riebel paving options","address":"78 Carlton St Carlton","budget":0.00,"created":1429747752574,"updated":1429758198648,"totalPrice":15929.41,"finalPrice":15929.41,"totalDiff":1.00,"status":"Pending","version":13,"quoteId":8877320,"quotes":[]},{"id":"6407001","client":"Allison Bosidis","address":"13  Brooke St Northcote","budget":0.00,"created":1405576566413,"updated":1405660902438,"totalPrice":4182.73,"finalPrice":4182.73,"totalDiff":1.00,"status":"Pending","version":12,"quoteId":11407025,"quotes":[]},{"id":"6757007","client":"Meredith Cole \u0026 Nicholas Tweedie","address":"56 May St Fitzroy North","brief":"Quote on design by Mud Office","budget":0.00,"created":1412732323399,"updated":1415331115225,"totalPrice":58083.56,"finalPrice":59212.96,"totalDiff":1.01,"status":"Pending","version":133,"quoteId":3607024,"quotes":[]},{"id":"7157001","client":"Tim Bishop","address":"132a Gertrudes St Fitzroy","brief":"screen extension design and costing","budget":0.00,"created":1428284428962,"updated":1428287755410,"totalPrice":1493.40,"finalPrice":1493.40,"totalDiff":1.00,"status":"Pending","version":10,"quoteId":7087019,"quotes":[]},{"id":"7887037","client":"Sue Riebel","address":"78 Carlton Street Carlton","brief":"quote on design by MUD","budget":0.00,"created":1427772180956,"updated":1429770658667,"totalPrice":36791.25,"finalPrice":37176.57,"totalDiff":1.01,"status":"Preparing Quote","version":60,"quoteId":8907371,"quotes":[]},{"id":"9757001","client":"Chiu Beng Oh and Elsa Ng","address":"133 Yarrbat Ave Balwyn","brief":"Quote on design by \nMud Office","budget":0.00,"created":1423565756925,"updated":1429835985325,"totalPrice":67932.80,"finalPrice":72279.86,"totalDiff":1.06,"status":"Pending","version":110,"quoteId":3857500,"quotes":[]},{"id":"11437164","client":"Catherine Button \u0026 Nick Bisley","address":"39 Rowe St North Fitzroy","brief":"Competitive Tender. Quote on design provided by Eckersley Garden Architecture.","budget":0.00,"created":1405673152051,"updated":1407103668402,"totalPrice":41569.62,"finalPrice":41569.62,"totalDiff":1.00,"status":"Cancelled","version":113,"quoteId":7427701,"quotes":[]}]',
        s = s.replace(/\n/g, "\\n"),
        s = JSON.parse(s)
    console.log('data:%s, %s', typeof s, s)
    console.log('len:%s, id', s.length, s[0].id)
    //console.log('jobs: %j', jobs)
    //jobs.jobs.post(s[0])

    s.forEach(function(j) {
        jobs.loadJobs.post(j)
    })


    //curl.request(options, function (err, parts) {
    //    // preserve newlines, etc - use valid JSON
    //    var s = parts,
    //    s = s.replace(/\n/g, "\\n"),
    //    //s = s.replace(/[\u0000-\u0026]+/g,""),
    //    s = JSON.parse(s),
    //    json = 'jobs-' + new Date().getTime() +'.json';
    //
    //    fs.writeFile(json, s, function (err) {
    //        if (err) return console.log(err);
    //    });
    //
    //    s.forEach(function(j) {
    //        jobs.jobs.post(j)
    //    })
    //
    //});

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