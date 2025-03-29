import { log } from "node:console";
import http from "node:http";

const handler = {};

function Server(req, res) {
    const fullUrl = new URL(req.url, `http://${req.headers.host}`);
    const query = Object.fromEntries(fullUrl.searchParams);
    req.query = query
    let reqUrl = fullUrl.pathname.trim().toLowerCase();
    const reqMethod = req.method.trim().toUpperCase();


    if(/\/\d+/.test(reqUrl) || reqMethod == "GET" || reqMethod == "PUT" || reqMethod == "DELETE"){
       const reqUrlWithoutNumber = reqUrl.split('/').filter(item => /^\D*$/.test(item)).join('/');
       for(let key of Object.keys(handler)){
            const changedKey = key.split('/').filter(item => !item.includes(':')).join('/'); 
            if(changedKey == reqUrlWithoutNumber) {
                const reqUrlNumbers = reqUrl.split('/').filter(item => !(/^\D*$/.test(item)));
                const reqUrlParams = key.split('/').filter(item => item.includes(':')); 
                req.params = {}
                for (let i = 0; i < reqUrlParams.length; i++) {
                    req.params[reqUrlParams[i].slice(1)] = reqUrlNumbers[i];                    
                }   
            reqUrl = key;  
            break;}
       }
    } 
    

    if(reqMethod == "POST" || reqMethod == "PUT") {
        req.body = new Promise((resolve, reject)=>{
            let body = '';
            req.on('data', (chunk)=> body+=chunk);
            req.on('end', ()=> resolve(JSON.parse(body)));
            req.on('error', (error) => reject(error))
        })
    }

    res.json = function(data){
        res.setHeader('Content-Type',"application/json");
        return res.end(JSON.stringify(data))
    }
    return  handler[reqUrl][reqMethod](req, res);
}

export default function Express(){
    this.server = http.createServer(Server);

    this.get = (url, callBack) => {
        url = url.includes(':') ? url.trim():url.trim().toLowerCase();
        handler[url] = handler[url] || {}; 
        handler[url]['GET'] = callBack;
    }

    this.post = (url, callBack) => {
        url = url.trim().toLowerCase();
        handler[url] = handler[url] || {};
        handler[url]['POST'] = callBack;
    }

    this.put = (url, callBack) => {
        url = url.includes(':') ? url.trim():url.trim().toLowerCase();
        handler[url] = handler[url] || {};
        handler[url]['PUT'] = callBack;
    }

    this.delete = (url, callBack) => {
        url = url.includes(':') ? url.trim():url.trim().toLowerCase();
        handler[url] = handler[url] || {};
        handler[url]['DELETE'] = callBack;
    }

    this.listen = function(PORT, callBack){
        this.server.listen(PORT, callBack);
    }
}