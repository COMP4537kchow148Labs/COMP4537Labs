let http = require('http');
let url = require('url');
let fs = require('fs');
let strings = require('./lang/en/en.js');
let utils = require('./modules/utils.js');

http.createServer(function (req, res){
    let q = url.parse(req.url, true);
    console.log(q.query);
    if(q.pathname === strings.dateURL){
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end('<div style="color: blue;">' + strings.greeting.replace('%1', q.query["name"]) + utils.getDate() + '</div>');
    } 
    else if(q.pathname === strings.writeURL){
        fs.appendFile('file.txt', q.query["text"] + '\n', function(err){
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end('<div style="color: blue;">' + strings.writeMessage.replace('%1', q.query["text"]) + '</div>');
        });
    }
    else if(q.pathname.startsWith(strings.readURL)){
        fs.readFile('file.txt', function(err, data) {
            if (err) {
                res.writeHead(404, {"Content-Type": "text/html"});
                res.end('<div style="color: blue;">' + q.pathname + strings.errorMessage + '</div>');
            }
            else {
                res.writeHead(200, {"Content-Type": "text/html"});
                res.end('<div style="color: blue;"><pre>' + data + '</pre></div>');
            }
        });
    }
    else {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end('<div style="color: blue;">' + strings.errorMessage + '</div>');
    }
}).listen(8080);

// http://localhost:8080/COMP4537/labs/3/getDate/?name=Keith
// http://localhost:8080/COMP4537/labs/3/writeFile/?text=BCIT
// http://localhost:8080/COMP4537/labs/3/readFile/file.txt
// test