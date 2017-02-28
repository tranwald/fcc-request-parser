const http = require('http');
const urlParser = require('url');

const IP_RE = /(\d{1,3}\.){3}\d{1,3}/;
const UA_RE = /\((.*)\)/i;
const LANG_RE = /([\w\d-]*),?/i;

const server = http.createServer((req, res) => {
    const pathname = urlParser.parse(req.url).pathname;

    console.log(`Request header: ${JSON.stringify(req.headers)}`);
   
    if (/^\/api\/whoami\/?/.test(pathname)) {
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddres;
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            ipaddress: IP_RE.exec(ipAddress)[0],
            language: LANG_RE.exec(req.headers['accept-language'])[1],
            software: UA_RE.exec(req.headers['user-agent'])[1]
        }));
    } else {
        res.writeHead(404);
        res.end();
    }
}).listen(process.env.PORT || 8080, () => {
    console.log(`Startig server at ${server.address().port}`);
});