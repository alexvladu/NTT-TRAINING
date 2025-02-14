const fs=require('fs');
const http=require('http');
const url=require('url');
const transformCard=require('./modules/transform-card');
const path = require('path');
const overviewHTML=fs.readFileSync('./templates/overview.html', 'utf-8');
const productHTML=fs.readFileSync('./templates/product.html', 'utf-8');
const productCardHTML=fs.readFileSync('./templates/product-card.html', 'utf-8');
const productData=fs.readFileSync('./dev-data/data.json', 'utf-8');
const productJson=JSON.parse(productData);

const server=http.createServer((req, res)=>{
    const {query, pathname}=url.parse(req.url, true);
    if(pathname=="/" || pathname=="/overview")
    {
        res.writeHead(200, {'content-type':'text/html'});
        const cardsHTML=productJson.map(el => transformCard(el, productCardHTML)).join("");
        const output=overviewHTML.replace(/{%PRODUCT_CARDS%}/g, cardsHTML);
        res.end(output);
    }
    else if(pathname=="/product")
    {
        res.writeHead(200, {'content-type':'text/html'});
        let output=transformCard(productJson[query.id], productHTML);

        res.end(output);
    }
    else if(pathname=='/api'){
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(productData);
    }
    else{
        res.writeHead(404);
        res.end("Page not found!");
    }
});
server.listen(8000, '127.0.0.1', ()=>{
    console.log("Server is listening requests");
});