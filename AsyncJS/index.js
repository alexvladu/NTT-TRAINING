const fs=require('fs');
const superagent=require('superagent');

const readFilePromise=(filePath) => {
    return new Promise((resolve, reject)=>{
        fs.readFile(filePath, 'utf8', (err, data) => {
            if(err) reject('Error reading file: '+err);
            resolve(data);
        });
    })
}
const writeFilePromise=(filePath, data) => {
    return new Promise((resolve, reject)=>{
        fs.writeFile(filePath, data, 'utf8', (err) => {
            if(err) reject('Error writing file: '+err);
            resolve("A fost scris in fisierul: "+filePath+" cu succces ");
        });
    })
}

console.log("Before promise");
(async()=>{
    try{
        const data=await readFilePromise("./dog.txt");
        const write=await writeFilePromise("./dogBreed.txt", data);
    }
    catch(err){
        throw(err);
    }
    return "ready async function";
})().then(data=>console.log(data))
.catch(err=>console.error(err));


console.log("After promise");