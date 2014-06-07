var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    port = process.argv[2] || 3000,
    backName = '<<',
    log = function(req, code){
        /*
            Reset = "\x1b[0m"
            Bright = "\x1b[1m"
            Dim = "\x1b[2m"
            Underscore = "\x1b[4m"
            Blink = "\x1b[5m"
            Reverse = "\x1b[7m"
            Hidden = "\x1b[8m"

            FgBlack = "\x1b[30m"
            FgRed = "\x1b[31m"
            FgGreen = "\x1b[32m"
            FgYellow = "\x1b[33m"
            FgBlue = "\x1b[34m"
            FgMagenta = "\x1b[35m"
            FgCyan = "\x1b[36m"
            FgWhite = "\x1b[37m"

            BgBlack = "\x1b[40m"
            BgRed = "\x1b[41m"
            BgGreen = "\x1b[42m"
            BgYellow = "\x1b[43m"
            BgBlue = "\x1b[44m"
            BgMagenta = "\x1b[45m"
            BgCyan = "\x1b[46m"
            BgWhite = "\x1b[47m"
         */
        var codeColor = (code === 200) ? '\x1b[32m' : '\x1b[31m';
        console.log('\x1b[36m', req.method, codeColor, code, '\x1b[0m', req.url);
    },
    errorResponse = function(code, req, res, err) {
        var contentType = {
                'Content-Type': 'text/plain'
            },
            message = (code === 404) ? '404 Not Found\n' : err + '\n';

        log(req, code);
        res.writeHead( code, contentType);
        res.write(message);
        res.end();
        return;
    },
    normalResponse = function(req, res, body, type){
        var contentType = {
            'Access-Control-Allow-Origin': '*'
        };
        log(req, 200);
        res.writeHead(200, contentType);
        res.write( body, type);
        res.end();
        return;
    };

http.createServer(function(req, res) {

    var uri = url.parse(req.url).pathname,
        filename = path.join(process.cwd(), uri);

    fs.exists(filename, function(exists) {
        if(!exists) {
            errorResponse(404, req, res);
            return;
        }

        var isFolder = fs.statSync(filename).isDirectory();

        if(isFolder){
            fs.readdir(filename, function(err, files){
                if(err) {
                    return errorResponse(500, req, res, err);
                }

                var html = '<html><head><style>body{margin:0;}.content{list-style:none;padding:10px;}.row{height:30px;line-height:30px}.row:hover{background-color:#f1f1f1}</style></head><body><ul class="content">',
                    liTag = function(name, url) {
                        url = url || name;
                        var el = '<li class="row">';
                        el += '<a href="' + req.url + url + '">';
                        el += name;
                        el += '</a></li>';
                        return el;
                    };

                // back
                html += (req.url === '/') ? '': liTag(backName, '..');

                for(var i = 0; i < files.length; i++) {
                    var f = files[i];
                    f += (fs.statSync(filename + f).isDirectory()) ? '/' : '';
                    html += liTag(f);
                }

                html += '</ul></body></html>';
                return normalResponse(req, res, html);
            });
        }else{
            var readStream = fs.createReadStream( filename, {
                flags: 'r',
                encoding: 'utf8',
                fd: null,
                mode: 0666,
                autoClose: true
            });

            readStream.on('open', function () {
                readStream.pipe(res);
            });

            readStream.on('error', function(err) {
                errorResponse( 500, req, res, err);
            });
        }
    });
}).listen(parseInt(port, 10));

console.log('Static file server running at => http://localhost:' + port + '/\nCTRL + C to shutdown');