#!/bin/bash

# nodejs static server
port="${1:-3000}"
open "http://localhost:${port}/"
echo "Static file server running at => http://localhost:${port}"
echo "CTRL + C to shutdown"
node -e 'var http=require("http"),url=require("url"),path=require("path"),fs=require("fs"),port=process.argv[2]||3e3,backName="<<",log=function(e,r){var n=200===r?"\x1b[32m":"\x1b[31m";console.log("\x1b[36m",e.method,n,r,"\x1b[0m",e.url)},errorResponse=function(e,r,n,t){var o={"Content-Type":"text/plain"},s=404===e?"404 Not Found\n":t+"\n";log(r,e),n.writeHead(e,o),n.write(s),n.end()},normalResponse=function(e,r,n,t){var o={"Access-Control-Allow-Origin":"*"};log(e,200),r.writeHead(200,o),r.write(n,t),r.end()},fileextensions=["html","htm","js","jsx","css","less","sass","scss","jpeg","jpg","png","gif","webp","webm"];http.createServer(function(e,r){var n=url.parse(e.url).pathname,t=path.join(process.cwd(),n);fs.exists(t,function(n){if(!n)return void errorResponse(404,e,r);var o=fs.statSync(t).isDirectory();if(o)fs.readdir(t,function(n,o){if(n)return errorResponse(500,e,r,n);var s="<html><head><style>body{margin:0;}.content{list-style:none;padding:10px;}.row{height:30px;line-height:30px}.row:hover{background-color:#f1f1f1}</style></head><body><ul class=\"content\">",a=function(r,n){n=n||r;var t="<li class=\"row\">";return t+="<a href=\""+e.url+t+"\">",t+=r,t+="</a></li>"};s+="/"===e.url?"":a(backName,"..");for(var i=0;i<o.length;i++){var l=o[i];l+=fs.statSync(t+l).isDirectory()?"/":"",s+=a(l)}return s+="</ul></body></html>",normalResponse(e,r,s)});else{var s=RegExp(".("+fileextensions.join("|")+")$","i"),a=t.match(s);if(a)fs.readFile(t,"binary",function(n,t){return n?errorResponse(500,e,r,n):normalResponse(e,r,t,"binary")});else{var i=fs.createReadStream(t,{flags:"r",encoding:"utf8",fd:null,mode:438,autoClose:!0});i.on("open",function(){var e=path.basename(t);r.setHeader("Content-disposition","attachment; filename="+e),i.pipe(r)}),i.on("error",function(n){errorResponse(500,e,r,n)})}}})}).listen(parseInt(port,10)),console.log("Static file server running at => http://localhost:"+port+"/\nCTRL + C to shutdown");' "$port"
