let http = require('http');
let url = require('url');
let strings = require('./lang/en/en.js');
let utils = require('./modules/utils.js');
http.createServer(function (req, res){
    let q = url.parse(req.url, true);
    console.log(q.query);
    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(strings.greeting.replace('%1', q.query["name"]) + utils.getDate());
}).listen(8080);

// http://localhost:8080/?name=Keith