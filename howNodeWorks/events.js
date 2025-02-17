const EventEmitter = require('events');
const http = require('http');

class Sales extends EventEmitter{
    constructor(){
        super();
    }
}
const myEmitter=new Sales();

myEmitter.on('newSale', () => {
   console.log("There was a new sale!"); 
});

myEmitter.on('newSale', () => {
    console.log("Custermer name: Jonas");
});

myEmitter.emit('newSale');


///

const server =http.createServer();

server.on('request', (req, res) => {
    console.log('Request received');
});
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
