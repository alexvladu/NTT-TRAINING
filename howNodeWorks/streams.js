const fs=require('fs');
const server=require('http').createServer();

server.on('request',(req,res)=>{
    //solution 1
    // fs.readFile('test-file.txt','utf8',(err,data)=>{
    //     if(err) throw err;
    //     res.writeHead(200,{'Content-Type':'text/plain'});
    //     res.end(data);
    //);

    //solutin 2
    // const readable= fs.createReadStream('test-file.txt');
    // readable.on('data',(chunk)=>{
    //     res.write(chunk);
    // });
    // readable.on('end',()=>{
    //     res.end();
    // });
    // readable.on('error',(err)=>{
    //     res.writeHead(500,{'Content-Type':'text/plain'});
    //     res.end(`Error reading file: ${err.message}`);
    // });

    //solution3
    const readable= fs.createReadStream('test-file.txt');
    readable.pipe(res);
    
});

server.listen(8000, 'localhost', ()=>{
    console.log('Server is running at http://localhost:8000/');
});