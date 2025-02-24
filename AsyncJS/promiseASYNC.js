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

readFilePromise('./dog.txt').then((breed) => {
     console.log(breed);
     return writeFilePromise('./dogBreed.txt', breed);
}).then(data => {
    console.log(data);
}).catch(err => {
    console.log(err);
});

