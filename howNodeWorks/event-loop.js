const fs=require('fs');

setTimeout(()=>{
    console.log("Timer 1 finished", 10000);
}, 1000);
setImmediate(()=>
    console.log("Immediate 1 finished", 1)
);

fs.readFile('test-file.txt', 'utf8', (err, data) => {
    console.log("File read finished", 2);
});

console.log("Top level code finished", 3);